import React, { type FC, useState, useEffect } from 'react'
import {
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { useGetAllContactListsByUserIdQuery, useCreateContactListMutation, useUpdateContactListMutation, useDeleteContactListMutation } from '../../features/contact/ContactListApiSlice'
import { useGetAllContactsByContactListIDQuery, useGetAllContactsByUserIdQuery } from '../../features/contact/ContactApiSlice'
import type { Contact } from '../../types/Contact.type'
import type { BaseContactList } from '../../types/ContactList.type'
import { v4 as uuidv4 } from 'uuid'
import ContactManagementLayout from 'src/components/ContactManagementLayout'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { showSnackbar } from 'src/features/snackbar/snackbarSlice'

const ContactGroupe: FC = () => {
  const dispatch = useDispatch()
  const notify = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info'
  ): void => {
    dispatch(showSnackbar({ message, severity }))
  }

  const userId = '300999fb-0ae5-40d5-b4a2-d3f7dc936277'
  const [contactLists, setContactLists] = useState<BaseContactList[]>([])
  const [selectedContactListId, setSelectedContactListId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [newContactListName, setNewContactListName] = useState('')
  const [updatedListName, setUpdatedListName] = useState('')
  const [showAllContacts, setShowAllContacts] = useState(false)

  const { data: contactListsResponse, isLoading: isLoadingContactLists, refetch: refetchContactLists } = useGetAllContactListsByUserIdQuery(userId)

  const { data: contactsInList, refetch: refetchContacts } = useGetAllContactsByContactListIDQuery(
    selectedContactListId,
    { skip: selectedContactListId === '' || showAllContacts }
  )

  const { data: allUserContacts, refetch: refetchAllContacts } = useGetAllContactsByUserIdQuery(
    userId,
    { skip: !showAllContacts }
  )

  const [createContactList] = useCreateContactListMutation()
  const [updateContactList] = useUpdateContactListMutation()
  const [deleteContactList] = useDeleteContactListMutation()

  useEffect(() => {
    if (contactListsResponse != null) {
      setContactLists(contactListsResponse)
    }
  }, [contactListsResponse])

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8081/ws')

    socket.onmessage = (event) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const message = JSON.parse(event.data)
        if (message.contactListId !== undefined || message.listName !== undefined) {
          void refetchContactLists()
        }
        if (showAllContacts || (message.contactListId === selectedContactListId)) {
          void refetchContacts()
          if (showAllContacts) {
            void refetchAllContacts()
          }
        }
        if (typeof message === 'object' && message.deleted === true) {
          void refetchContactLists()
          if (message.id === selectedContactListId) {
            setSelectedContactListId('')
            setShowAllContacts(true)
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error processing WebSocket message:', error)
      }
    }

    return () => {
      socket.close()
    }
  }, [selectedContactListId, showAllContacts, refetchContacts, refetchAllContacts, refetchContactLists])

  const handleListSelection = (listId: string): void => {
    setSelectedContactListId(listId)
    setShowAllContacts(false)
  }

  const handleShowAllContacts = (): void => {
    setSelectedContactListId('')
    setShowAllContacts(true)
  }

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const handleUpdateDialogOpen = (event: React.MouseEvent<HTMLButtonElement>, listName: string): void => {
    setUpdatedListName(listName)
    setUpdateOpen(true)
  }

  const handleUpdateDialogClose = (): void => {
    setUpdateOpen(false)
    setUpdatedListName('')
  }

  const handleCreateContactList = async (): Promise<void> => {
    try {
      const newContactList: BaseContactList = {
        id: uuidv4(),
        listName: newContactListName,
        userId
      }
      await createContactList(newContactList).unwrap()
      notify('Contact list created successfully', 'success')
      setOpen(false)
      setNewContactListName('')
      // Refetch will be handled by WebSocket
    } catch (error) {
      notify('Error creating contact list', 'error')
    }
  }

  const handleUpdateContactList = async (): Promise<void> => {
    try {
      if (selectedContactListId === '') {
        notify('Please select a contact list', 'warning')
        return
      }
      await updateContactList({
        id: selectedContactListId,
        listName: updatedListName,
        userId
      }).unwrap()
      notify('Contact list updated successfully', 'success')
      setUpdateOpen(false)
      // Refetch will be handled by WebSocket
    } catch (error) {
      notify('Error updating contact list', 'error')
    }
  }

  const handleDeleteContactList = async (): Promise<void> => {
    try {
      if (selectedContactListId === '') {
        notify('Please select a contact list', 'warning')
        return
      }
      await deleteContactList(selectedContactListId).unwrap()
      notify('Contact list deleted successfully', 'success')
      // Refetch and state updates will be handled by WebSocket
    } catch (error) {
      notify('Error deleting contact list', 'error')
    }
  }

  const handleEditContact = (contact: Contact): void => {
    // eslint-disable-next-line no-console
    console.log('Edit contact:', contact)
  }

  const handleDeleteContact = (contact: Contact): void => {
    // eslint-disable-next-line no-console
    console.log('Delete contact:', contact)
  }

  if (isLoadingContactLists) {
    return <CircularProgress />
  }

  const displayedContacts = showAllContacts ? allUserContacts : contactsInList

  return (
      <ContactManagementLayout>
        <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
          {/* Contact Lists Sidebar */}
          <Box sx={{
            width: 250,
            borderRight: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Typography variant="h6">Contact Lists</Typography>
              <IconButton onClick={handleClickOpen} color="primary" size="small">
                <GroupAddIcon />
              </IconButton>
            </Box>

            <List sx={{ flex: 1, overflowY: 'auto' }}>
              <ListItem
                  button
                  selected={showAllContacts}
                  onClick={handleShowAllContacts}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#e3f2fd',
                      '&:hover': {
                        backgroundColor: '#e3f2fd'
                      }
                    }
                  }}
              >
                <ListItemText primary="All Contacts" />
              </ListItem>
              {contactLists.map((list) => (
                  <ListItem
                      key={list.id}
                      button
                      selected={selectedContactListId === list.id}
                      onClick={() => { handleListSelection(list.id) }}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: '#e3f2fd',
                          '&:hover': {
                            backgroundColor: '#e3f2fd'
                          }
                        }
                      }}
                  >
                    <ListItemText primary={list.listName} />
                  </ListItem>
              ))}
            </List>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
            {(selectedContactListId !== '' || showAllContacts) && displayedContacts != null
              ? (
                    <>
                      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4">
                          {showAllContacts
                            ? 'All Contacts'
                            : contactLists.find(list => list.id === selectedContactListId)?.listName}
                        </Typography>
                        {!showAllContacts && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                  variant="contained"
                                  onClick={(event) => {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    handleUpdateDialogOpen(event, ((contactLists.find(list => list.id === selectedContactListId)?.listName) != null) || '')
                                  }
                              }
                              >
                                Update List Name
                              </Button>
                              <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => { void handleDeleteContactList() }}
                              >
                                Delete List
                              </Button>
                            </Box>
                        )}
                      </Box>

                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="contacts table">
                          <TableHead>
                            <TableRow>
                              <TableCell>First Name</TableCell>
                              <TableCell>Last Name</TableCell>
                              <TableCell>Email Address</TableCell>
                              <TableCell>Phone Number</TableCell>
                              <TableCell>Edit</TableCell>
                              <TableCell>Delete</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {displayedContacts.map((contact: Contact) => (
                                <TableRow key={contact.id}>
                                  <TableCell>{contact.firstName}</TableCell>
                                  <TableCell>{contact.lastName}</TableCell>
                                  <TableCell>{contact.email}</TableCell>
                                  <TableCell>{contact.phone}</TableCell>
                                  <TableCell>
                                    <AiFillEdit
                                        size={20}
                                        className="icon"
                                        onClick={() => { handleEditContact(contact) }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <AiFillDelete
                                        size={20}
                                        className="icon"
                                        onClick={() => { handleDeleteContact(contact) }}
                                    />
                                  </TableCell>
                                </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                )
              : (
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%'
                    }}>
                      <Typography color="textSecondary">
                        Select a contact list or create a new one
                      </Typography>
                    </Box>
                )}
          </Box>
        </Box>

        {/* Dialogs */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create New Contact List</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the name of the new contact list.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="Contact List Name"
                fullWidth
                variant="outlined"
                value={newContactListName}
                onChange={(e) => { setNewContactListName(e.target.value) }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => { void handleCreateContactList() }}>Create</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={updateOpen} onClose={handleUpdateDialogClose}>
          <DialogTitle>Update Contact List Name</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the new name for the contact list.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="New List Name"
                fullWidth
                variant="outlined"
                value={updatedListName}
                onChange={(e) => { setUpdatedListName(e.target.value) }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateDialogClose}>Cancel</Button>
            <Button onClick={() => { void handleUpdateContactList() }}>Update</Button>
          </DialogActions>
        </Dialog>
      </ContactManagementLayout>
  )
}

export default ContactGroupe
