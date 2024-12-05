import React, { type FC, useState } from 'react'
import { Button, TextField, Box, Typography, Switch, Grid } from '@mui/material'
import { useNotify } from 'src/utils/notify'
import { useCreateContactMutation } from 'src/features/contact/ContactApiSlice'
import { type BaseContact } from 'src/types/Contact.type'

interface ContactFormProps {
  onClose: () => void
}

const ContactForm: FC<ContactFormProps> = ({ onClose }) => {
  const notify = useNotify()
  const [createContact] = useCreateContactMutation()
  const [contact, setContact] = useState<BaseContact>({
    contactListId: '',
    firstName: '',
    lastName: '',
    preferredName: '',
    phone: '',
    email: '',
    fax: '',
    addressId: '',
    doNotContact: false
  })

  // Handles input changes for all text fields
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setContact((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  // Handles changes for the switch toggle
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.target
    setContact((prevState) => ({
      ...prevState,
      doNotContact: checked
    }))
  }

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    void submitContact()
  }

  // Submits the contact asynchronously
  const submitContact = async (): Promise<void> => {
    try {
      await createContact(contact).unwrap()
      notify('Contact created successfully!', 'success')
      onClose()
    } catch (error) {
      notify('Error creating contact', 'error')
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box
        component="form"
        onSubmit={ handleOnSubmit }
        sx={{
          maxWidth: 600,
          width: '100%',
          backgroundColor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
          p: 3
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Add a Contact
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              value={contact.firstName}
              onChange={handleOnChange}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              value={contact.lastName}
              onChange={handleOnChange}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="preferredName"
              label="Preferred Name"
              value={contact.preferredName}
              onChange={handleOnChange}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={contact.email}
              onChange={handleOnChange}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="phone"
              label="Phone"
              value={contact.phone}
              onChange={handleOnChange}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="fax"
              label="Fax"
              value={contact.fax}
              onChange={handleOnChange}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body1">Do Not Contact</Typography>
              <Switch
                checked={contact.doNotContact}
                onChange={handleSwitchChange}
                name="doNotContact"
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" type="submit">
              Add Contact
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default ContactForm
