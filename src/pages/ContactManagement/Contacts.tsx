import { Typography } from '@mui/material'
import ContactManagementLayout from './ContactManagementLayout'

function Contacts (): JSX.Element {
  return (
    <ContactManagementLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          Contacts
        </Typography>
    </ContactManagementLayout>
  )
}

export default Contacts
