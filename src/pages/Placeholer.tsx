import { Typography } from '@mui/material'
import ContactManagementLayout from 'src/components/ContactManagementLayout'

function Placeholder ({ title }: { title: string }): JSX.Element {
  return (
    <ContactManagementLayout>
      <Typography variant="h4" component="h1" gutterBottom>

      </Typography>
    </ContactManagementLayout>
  )
}

export default Placeholder
