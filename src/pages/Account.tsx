import { Typography, Card, CardContent, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { type RootState } from 'src/app/store'

function Account ({ title }: { title: string }): JSX.Element {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        minWidth: '100vw'
      }}
    >
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>

      {/* User Info Card */}
      <Card sx={{ mb: 3, boxShadow: 3, maxWidth: '30%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Welcome, {user?.username ?? 'Guest'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Email:</strong> {user?.email ?? 'Not provided'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>ID:</strong> {user?.localAccountId ?? 'Not available'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Account
