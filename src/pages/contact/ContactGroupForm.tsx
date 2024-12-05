import React, { type FC, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem, type SelectChangeEvent
} from '@mui/material'
import { useUpdateContactMutation } from 'src/features/contact/ContactApiSlice'
import { useGetAllContactListsByUserIdQuery } from 'src/features/contact/ContactListApiSlice'
import { type Contact } from 'src/types/Contact.type'
import { useNotify } from 'src/utils/notify'
import { useSelector } from 'react-redux'
import type { RootState } from 'src/app/store'
import { type BaseContactList } from 'src/types/ContactList.type'
import Loading from 'src/components/Loading'

interface ContactGroupFormProps {
  contact: Contact
  onClose: () => void
}

const ContactGroupForm: FC<ContactGroupFormProps> = ({ contact, onClose }) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const userId = user?.localAccountId ?? ''
  const { data: contactLists, isLoading } = useGetAllContactListsByUserIdQuery(userId)
  const [updateContact] = useUpdateContactMutation()
  const notify = useNotify()

  const [selectedGroup, setSelectedGroup] = useState<string>('')

  const handleGroupChange = (event: SelectChangeEvent<unknown>): void => {
    console.log('event.target.value', event.target.value)
    setSelectedGroup(event.target.value as string)
  }

  const handleSave = async (): Promise<void> => {
    console.log('selectedGroup', selectedGroup)
    if (selectedGroup === '') {
      notify('Please select a group', 'warning')
      return
    }

    try {
      await updateContact({
        ...contact,
        contactListId: selectedGroup
      }).unwrap()
      notify('Contact added to group successfully!', 'success')
      onClose()
    } catch (error) {
      notify('Failed to add contact to group', 'error')
    }
  }

  const handleButtonClick = (): void => {
    void handleSave()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Typography variant='h6' gutterBottom>
        Add Contact to Group
      </Typography>

      {isLoading
        ? (
        <Loading message={'Loading Groups...'} />
          )
        : (
        <FormControl fullWidth margin='normal'>
          <InputLabel id='group-select-label'>Select Group</InputLabel>
          <Select
            labelId='group-select-label'
            value={selectedGroup}
            onChange={ (event) => { handleGroupChange(event) }}
          >
            {contactLists?.map((group: BaseContactList) => (
              <MenuItem key={group.id} value={group.id}>
                {group.listName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
          )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
        <Button variant='outlined' onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={ handleButtonClick }
          disabled={(Boolean(isLoading)) || (selectedGroup === '')}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default ContactGroupForm
