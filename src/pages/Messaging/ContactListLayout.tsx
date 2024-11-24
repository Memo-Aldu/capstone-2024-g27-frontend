import React from 'react'
import { List, ListItem, ListItemText } from '@mui/material'
import type { Contact } from '../../types/Contact.type'

interface ContactListProps {
  contacts: Contact[] | undefined
  onSelectContact: (contact: Contact) => void
  selectedContact: Contact | null
}

const ContactListLayout: React.FC<ContactListProps> = ({ contacts, onSelectContact, selectedContact }) => {
  return (
      <List>
           {contacts?.map((contact) => (
                <ListItem
                    key={contact.id}
                    button
                    selected={selectedContact?.id === contact.id}
                    onClick={() => {
                      onSelectContact(contact)
                    }}
                >
                    <ListItemText primary={`${contact.firstName} ${contact.lastName}`} />
                </ListItem>
           ))}
        </List>
  )
}

export default ContactListLayout
