import React, { type FC, useState } from 'react'
import { Button, TextField, Box, Typography, Switch } from '@mui/material'
import { type Contact } from 'src/types/Contact.type'
import { useUpdateContactMutation } from 'src/features/contact/ContactApiSlice'
import { showSnackbar } from 'src/features/snackbar/snackbarSlice'
import { useDispatch } from 'react-redux'

interface ContactFormProps {
  onClose: () => void
  contact: Contact
}

const ContactUpdateForm: FC<ContactFormProps> = ({ onClose, contact }) => {
  const dispatch = useDispatch()
  const notify = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info'
  ): void => {
    dispatch(showSnackbar({ message, severity }))
  }

  const [updatedContact, setUpdatedContact] = useState<Contact>(contact)
  const [updateContact] = useUpdateContactMutation()

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setUpdatedContact((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const newContact: Contact = { ...updatedContact, id: contact.id }
    updateContact(newContact).unwrap().then((response) => {
      notify('Contact Updated', 'success')
      onClose()
    }).catch((error) => {
      notify('Error Updating contact', 'error')
      throw error
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box component={'form'}
           onSubmit={handleOnSubmit}
           sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
        <Typography variant="h4" align="center" mb={2}>
          Update Contact
        </Typography>
        <TextField
          fullWidth
          label="First Name"
          value={updatedContact.firstName}
          onChange={handleOnChange}
          margin="normal"
          name="firstName"
        />
        <TextField
          fullWidth
          label="Last Name"
          value={updatedContact.lastName}
          onChange={handleOnChange}
          margin="normal"
          name = "lastName"
        />
        <TextField
          fullWidth
          label="Preferred Name"
          value={updatedContact.preferredName}
          onChange={handleOnChange}
          margin="normal"
          name = "preferredName"
        />
        <TextField
          fullWidth
          label="email"
          value={updatedContact.email}
          onChange={handleOnChange}
          margin="normal"
          name = "email"
        />
        <TextField
          fullWidth
          label="phone"
          value={updatedContact.phone}
          onChange={handleOnChange}
          margin="normal"
          name = "phone"
        />
        <TextField
          fullWidth
          label="fax"
          value={updatedContact.fax}
          onChange={handleOnChange}
          margin="normal"
          name = "fax"
        />
        <Box>
          <Typography variant='body1'>Do Not Contact</Typography>
          <Switch
            checked={updatedContact.doNotContact}
            onChange={(e) => {
              setUpdatedContact((prevState) => ({
                ...prevState,
                doNotContact: e.target.checked
              }))
            }}
          />
        </Box>
        <Button variant='contained' type='submit' className='submit-btn'>
          Update Contact
        </Button>
      </Box>
    </Box>
  )
}

export default ContactUpdateForm
