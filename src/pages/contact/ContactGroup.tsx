import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Box, Typography, Button, TextField, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useGetAllContactListsByUserIdQuery, useCreateContactListMutation, useUpdateContactListMutation, useDeleteContactListMutation } from 'src/features/contact/ContactListApiSlice'
import { useGetAllContactsByContactListIDQuery, useRemoveContactFromListMutation } from 'src/features/contact/ContactApiSlice'
import { useNotify } from 'src/utils/notify'
import ContactTable from 'src/components/ContactTable'
import ModalForm from 'src/components/ModalForm'
import { type RootState } from 'src/app/store'
import { useSelector } from 'react-redux'
import Sidebar from 'src/components/SideBar'
import ContactManagementLayout from 'src/components/ContactManagementLayout'

const ContactGroup: React.FC = () => {
  const notify = useNotify()
  const [selectedContactListId, setSelectedContactListId] = useState<string>('')
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [newContactListName, setNewContactListName] = useState('')
  const [updatedListName, setUpdatedListName] = useState('')
  const { user } = useSelector((state: RootState) => state.auth)
  const userId = user?.localAccountId ?? ''

  // Fetch data
  const { data: contactListsData = [] } = useGetAllContactListsByUserIdQuery(userId)
  const { data: contactsInList = [] } = useGetAllContactsByContactListIDQuery(selectedContactListId, { skip: selectedContactListId === '' })

  // Initialize contact lists state
  const [contactLists, setContactLists] = useState(contactListsData)
  useEffect(() => {
    setContactLists(contactListsData)
  }, [contactListsData])

  const [createContactList] = useCreateContactListMutation()
  const [updateContactList] = useUpdateContactListMutation()
  const [deleteContactList] = useDeleteContactListMutation()
  const [updateContact] = useRemoveContactFromListMutation()

  const handleCreateContactList = async (): Promise<void> => {
    try {
      const contactList = await createContactList({
        id: uuidv4(),
        listName: newContactListName,
        userId
      }).unwrap()
      setContactLists([...contactLists, contactList])
      notify('Contact list created successfully!', 'success')
      setOpenAddModal(false)
    } catch (error) {
      notify('Error creating contact list.', 'error')
    }
  }

  const handleUpdateContactList = async (): Promise<void> => {
    try {
      const updatedList = await updateContactList({
        id: selectedContactListId,
        listName: updatedListName,
        userId
      }).unwrap()
      setContactLists(contactLists.map(list => (list.id === selectedContactListId) ? updatedList : list))
      notify('Contact list updated successfully!', 'success')
      setOpenUpdateModal(false)
    } catch (error) {
      notify('Error updating contact list.', 'error')
    }
  }

  const handleRemoveContactFromList = async (contactId: string): Promise<void> => {
    try {
      await updateContact(contactId).unwrap()
      notify('Contact removed from list successfully!', 'success')
    } catch (error) {
      notify('Error removing contact from list.', 'error')
    }
  }

  const handleDeleteContactList = async (): Promise<void> => {
    try {
      await deleteContactList(selectedContactListId).unwrap()
      setContactLists(contactLists.filter(list => list.id !== selectedContactListId))
      notify('Contact list deleted successfully!', 'success')
      setSelectedContactListId('')
    } catch (error) {
      notify('Error deleting contact list.', 'error')
    }
  }

  return (
    <ContactManagementLayout>
    <Box display="flex" height="100vh">
      {/* Sidebar for contact lists */}
      <Sidebar
        sideBarName={'Contact Groups'}
        items={contactLists.map(list => ({ id: list.id, name: list.listName }))}
        selectedId={selectedContactListId}
        onSelect={id => { setSelectedContactListId(id) }}
        onAddClick={() => { setOpenAddModal(true) }}
      />

      {/* Main Content */}
      { (selectedContactListId !== '') && (
        <Box flex={1} p={3}>
          <Typography variant="h4" gutterBottom>
            {(selectedContactListId !== '') ? 'Selected Contact List' : 'Select a Contact List'}
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            {(selectedContactListId !== '') && (
              <>
                <Button variant="contained" onClick={() => { setOpenUpdateModal(true) }}>
                  Update List Name
                </Button>
                <Button variant="contained" color="error" onClick={() => { void handleDeleteContactList() }}>
                  Delete List
                </Button>
              </>
            )}
          </Box>
          {/* Contacts Table */}
          <ContactTable
            contacts={(selectedContactListId !== '') ? contactsInList : []}
            onRemove={ id => {
              void handleRemoveContactFromList(id)
            }}
          />
        </Box>
      )}

      {/* Modals */}
      <ModalForm open={openAddModal} onClose={() => { setOpenAddModal(false) }}>
        <DialogTitle>Create New Contact List</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the name of the new contact list:</DialogContentText>
          <TextField
            fullWidth
            value={newContactListName}
            onChange={e => { setNewContactListName(e.target.value) }}
            label="Contact List Name"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenAddModal(false) }}>Cancel</Button>
          <Button onClick={() => { void handleCreateContactList() }}>Create</Button>
        </DialogActions>
      </ModalForm>

      <ModalForm open={openUpdateModal} onClose={() => { setOpenUpdateModal(false) }}>
        <DialogTitle>Update Contact List</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the new name for the contact list:</DialogContentText>
          <TextField
            fullWidth
            value={updatedListName}
            onChange={e => { setUpdatedListName(e.target.value) }}
            label="New List Name"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenUpdateModal(false) }}>Cancel</Button>
          <Button onClick={(): void => { void handleUpdateContactList() }}>Update</Button>
        </DialogActions>
      </ModalForm>
    </Box>
    </ContactManagementLayout>
  )
}

export default ContactGroup
