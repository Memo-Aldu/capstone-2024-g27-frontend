import React, { type FC, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import { TableHead, Button, Modal, Fade } from '@mui/material'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { type Contact } from 'src/types/Contact.type'
import { useDeleteContactMutation } from 'src/features/contact/ContactApiSlice'
import ContactUpdateForm from 'src/pages/contact/ContactUpdateForm'
import { useNotify } from 'src/utils/notify'
import ContactGroupForm from 'src/pages/contact/ContactGroupForm'

interface ContactListProps {
  contacts?: Contact[]
}

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

// fonction pour s'occuper de la pagination
function TablePaginationActions (props: TablePaginationActionsProps): JSX.Element {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5, align: 'center' }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

const ContactList: FC<ContactListProps> = ({ contacts }) => {
  const notify = useNotify()

  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openGroupModal, setOpenGroupModal] = useState(false)
  const [updateContact, setUpdateContact] = useState<Contact | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [deleteContact] = useDeleteContactMutation()

  const handleDeleteContact = (id: string): void => {
    deleteContact(id)
      .unwrap()
      .then(() => { notify('Contact deleted', 'success') })
      .catch((error) => {
        notify('Error deleting contact', 'error')
        throw error
      })
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleUpdateContact = (contact: Contact): void => {
    setUpdateContact(contact)
    setOpenUpdateModal(true)
  }

  const handleAddToGroup = (contact: Contact): void => {
    setUpdateContact(contact)
    setOpenGroupModal(true)
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (contacts?.length ?? 0)) : 0

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label='contacts table'>
          <TableHead>
            <TableRow>
              <TableCell align="center">First Name</TableCell>
              <TableCell align="center">Last Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Edit</TableCell>
              <TableCell align="center">Delete</TableCell>
              <TableCell align="center">Add to Group</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? contacts?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : contacts
            )?.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell align="center">{contact.firstName}</TableCell>
                <TableCell align="center">{contact.lastName}</TableCell>
                <TableCell align="center">{contact.email}</TableCell>
                <TableCell align="center">{contact.phone}</TableCell>
                <TableCell align="center">
                  <AiFillEdit
                    size={20}
                    onClick={() => { handleUpdateContact(contact) }}
                    style={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <AiFillDelete
                    size={20}
                    onClick={() => { handleDeleteContact(contact.id) }}
                    style={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant='contained'
                    size='small'
                    onClick={() => { handleAddToGroup(contact) }}
                  >
                    Add to Group
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter sx={{ align: 'center' }}>
            <TableRow sx={{ align: 'center' }}>
              <TableCell colSpan={7} align="center">
                <TablePagination
                  rowsPerPageOptions={[5, 15, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={contacts?.length ?? 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: {
                        'aria-label': 'rows per page'
                      },
                      native: true
                    }
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Update Contact Modal */}
      <Modal
        open={openUpdateModal}
        onClose={() => { setOpenUpdateModal(false) }}
        closeAfterTransition
      >
        <Fade in={openUpdateModal}>
          <Box sx={modalStyle}>
            {(updateContact != null) && (
              <ContactUpdateForm
                contact={updateContact}
                onClose={() => { setOpenUpdateModal(false) }}
              />
            )}
          </Box>
        </Fade>
      </Modal>

      {/* Add to Group Modal */}
      <Modal
        open={openGroupModal}
        onClose={() => { setOpenGroupModal(false) }}
        closeAfterTransition
      >
        <Fade in={openGroupModal}>
          <Box sx={modalStyle}>
            {(updateContact != null) && (
              <ContactGroupForm contact={updateContact} onClose={() => { setOpenGroupModal(false) }} />
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}

export default ContactList
