import React, { type FC } from 'react'
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
import { TableHead } from '@mui/material'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { type Contact } from 'src/types/Contact.type'
import { useDeleteContactMutation } from 'src/features/contact/ContactApiSlice'
import { useDispatch } from 'react-redux'
import { showSnackbar } from 'src/features/snackbar/snackbarSlice'

interface ContactListProps {
  contacts?: Contact[]
}

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void
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
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
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
// fin fonction pour s'occuper de la pagination

// debut fonction principale List de contact
const ContactList: FC<ContactListProps> = ({ contacts }) => {
  const dispatch = useDispatch()
  const notify = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info'
  ): void => {
    dispatch(showSnackbar({ message, severity }))
  }

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (contacts?.length ?? 0)) : 0

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const [deleteContact] = useDeleteContactMutation()

  const handleDeleteContact = (id: string): void => {
    deleteContact(id).unwrap().then(() => {
      notify('Contact deleted', 'success')
    }).catch((error) => {
      notify('Error deleting contact', 'error')
      throw error
    })
  }

  const handleUpdateContact = (contact: Contact): void => {
    // eslint-disable-next-line no-console
    console.log('Update contact', contact)
    // TODO
  }

  return (
    <div className='contacts-list'>
      <h3 className='contacts-list-title'>List of Contacts</h3>
      <div className='contacts-list-table-container'>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">

            <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email Adress</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>edit</TableCell>
                  <TableCell>delete</TableCell>
                </TableRow>
              </TableHead>

            {contacts !== undefined && (
              <TableBody>
              {(rowsPerPage > 0
                ? contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : contacts
              ).map((contact, index) => (
                <TableRow key={index}>
                  <TableCell component="th">
                      {contact.firstName}
                  </TableCell>
                  <TableCell component="th">
                      {contact.lastName}
                  </TableCell>
                  <TableCell>
                      {contact.email}
                  </TableCell>
                  <TableCell>
                      {contact.phone}
                  </TableCell>
                  <TableCell>
                    <AiFillEdit size={20} className='icon' onClick={() => { handleUpdateContact(contact) } } />
                  </TableCell>
                  <TableCell>
                    <AiFillDelete size={20} className='icon' onClick={() => { handleDeleteContact(contact.id) }} />
                  </TableCell>
              </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>)
            }

            <TableFooter>
              <TableRow>
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
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

      </div>
    </div>
  )
}
export default ContactList
