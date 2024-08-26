import React, { type FC, useState } from 'react'
import { Button, TextField, Box, Typography, Switch } from '@mui/material'
import { type BaseContact } from 'src/types/Contact.type'
import { useCreateContactMutation } from 'src/features/contact/ContactApiSlice'

interface ContactFormProps {
  onClose: () => void
}

const ContactForm: FC<ContactFormProps> = ({ onClose }) => {
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
  const [createContact] = useCreateContactMutation()

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setContact((prevState) => ({
      ...prevState,
      [name]: value
    }))
    // eslint-disable-next-line no-console
    console.log(contact)
  }

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    createContact(contact).unwrap().then((response) => {
      // eslint-disable-next-line no-console
      console.log(response)
      onClose()
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
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
          Add a contact
        </Typography>
          <TextField
            fullWidth
            label="First Name"
            value={contact.firstName}
            onChange={handleOnChange}
            margin="normal"
            name="firstName"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={contact.lastName}
            onChange={handleOnChange}
            margin="normal"
            name = "lastName"
          />
          <TextField
            fullWidth
            label="Preferred Name"
            value={contact.preferredName}
            onChange={handleOnChange}
            margin="normal"
            name = "preferredName"
          />
          <TextField
            fullWidth
            label="email"
            value={contact.email}
            onChange={handleOnChange}
            margin="normal"
            name = "email"
          />
          <TextField
            fullWidth
            label="phone"
            value={contact.phone}
            onChange={handleOnChange}
            margin="normal"
            name = "phone"
          />
          <TextField
            fullWidth
            label="fax"
            value={contact.fax}
            onChange={handleOnChange}
            margin="normal"
            name = "fax"
          />
          <Box>
            <Typography variant='body1'>Do Not Contact</Typography>
            <Switch
              checked={contact.doNotContact}
              onChange={(e) => {
                setContact((prevState) => ({
                  ...prevState,
                  doNotContact: e.target.checked
                }))
              }}
            />
          </Box>
          <Button variant='contained' type='submit' className='submit-btn'>
            Add Contact
          </Button>
      </Box>
    </Box>
  )
}

export default ContactForm
