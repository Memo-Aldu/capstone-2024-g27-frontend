import { Typography } from '@mui/material'
import ContactManagementLayout from 'src/components/ContactManagementLayout'

function AddContact (): JSX.Element {
  return (
    <ContactManagementLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          Adding contact
        </Typography>
    </ContactManagementLayout>
  )
}

export default AddContact
