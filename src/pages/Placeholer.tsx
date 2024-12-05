import { Typography } from '@mui/material'
import MessagingLayout from 'src/components/MessagingLayout'

function Placeholder ({ title }: { title: string }): JSX.Element {
  return (
    <MessagingLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
    </MessagingLayout>
  )
}

export default Placeholder
