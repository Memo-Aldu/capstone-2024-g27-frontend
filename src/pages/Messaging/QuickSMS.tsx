import { Typography } from '@mui/material'
import MessagingLayout from './MessagingLayout'

function QuickSMS (): JSX.Element {
  return (
    <MessagingLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          Quick SMS
        </Typography>
    </MessagingLayout>
  )
}

export default QuickSMS
