import { Typography } from '@mui/material'
import MessagingLayout from 'src/components/sms/MessagingLayout'

function History (): JSX.Element {
  return (
    <MessagingLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          History
        </Typography>
    </MessagingLayout>
  )
}

export default History
