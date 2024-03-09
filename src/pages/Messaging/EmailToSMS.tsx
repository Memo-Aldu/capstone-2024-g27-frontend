import { Typography } from '@mui/material'
import MessagingLayout from './MessagingLayout'

function EmailToSMS (): JSX.Element {
  return (
    <MessagingLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          Email To SMS
        </Typography>
    </MessagingLayout>
  )
}

export default EmailToSMS
