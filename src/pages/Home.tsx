import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import MessageIcon from '@mui/icons-material/Message'
import { Card, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate } from 'react-router-dom'

function Home (): JSX.Element {
  const navigate = useNavigate()
  return (
    <Box>
      <Typography variant='h5' component='h1'>Homepage</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={1}>
            <CardHeader title='Account Info'
              action={
                <IconButton onClick={() => { navigate('/my-account') }}>
                  <AccountCircleIcon />
                </IconButton>}
            />
            <CardContent>
              <Typography variant='body1'>
                AuthID: 12345
              </Typography>
              <Typography variant='body1'>
                AuthToken: 67890
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={1}>
            <CardHeader title='Payment'
              action={
                <IconButton onClick={() => { navigate('/payment') }}>
                  <CreditCardIcon />
                </IconButton>}
             />
            <CardContent>
              <Typography variant='body1'>
                Credits: 100.00 CAD
              </Typography>
              <Typography variant='body1'>
                Payment Method: Paypal (monthly)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={1}>
            <CardHeader title='Incoming Text Messages'
              action={
                <IconButton onClick={() => { navigate('/messaging') }}>
                  <MessageIcon />
                </IconButton>}
             />
            <CardContent>
              <Typography variant='body1'>
                Chris Humphries Thank you for your time. Would it be possible to ...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={1}>
            <CardHeader title='Message delivery tracking'
              action={
                <IconButton onClick={() => { navigate('/messaging') }}>
                  <MessageIcon />
                </IconButton>}
             />
            <CardContent>
              <Typography variant='body1'>
                There are no deliveries to track
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          {/* Activity in the past 24hrs */}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home
