import { Typography } from '@mui/material'
import MessagingLayout from 'src/components/sms/MessagingLayout'

function Campaign (): JSX.Element {
  return (
    <MessagingLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          Campaign
        </Typography>
    </MessagingLayout>
  )
}

export default Campaign
