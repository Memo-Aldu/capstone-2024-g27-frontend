import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { AiFillEdit, AiFillDelete, AiFillCloseCircle } from 'react-icons/ai'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface ContactTableProps {
  contacts: Contact[]
  onEdit?: (contact: Contact) => void
  onDelete?: (id: string) => void
  onRemove?: (id: string) => void
}

const ContactTable: React.FC<ContactTableProps> = ({ contacts, onEdit, onDelete, onRemove }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">First Name</TableCell>
          <TableCell align="center">Last Name</TableCell>
          <TableCell align="center">Email Address</TableCell>
          <TableCell align="center">Phone Number</TableCell>
          {(onEdit != null) && <TableCell align="center">Edit</TableCell>}
          {(onDelete != null) && <TableCell align="center">Delete</TableCell>}
          {(onRemove != null) && <TableCell align="center">Remove</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {contacts.map(contact => (
          <TableRow key={contact.id}>
            <TableCell align="center">{contact.firstName}</TableCell>
            <TableCell align="center">{contact.lastName}</TableCell>
            <TableCell align="center">{contact.email}</TableCell>
            <TableCell align="center">{contact.phone}</TableCell>
            {(onEdit != null) && (
              <TableCell align="center">
                <AiFillEdit
                  size={20}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    onEdit(contact)
                  }}
                />
              </TableCell>
            )}
            {(onDelete != null) && (
              <TableCell align="center">
                <AiFillDelete
                  size={20}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    onDelete(contact.id)
                  }}
                />
              </TableCell>
            )}
            {(onRemove != null) && (
              <TableCell align="center">
                <AiFillCloseCircle
                  size={20}
                  style={{ cursor: 'pointer' }}
                  onClick={() => { onRemove(contact.id) }}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export default ContactTable
