import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

const Loading = (): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        textAlign: 'center'
      }}
    >
      <CircularProgress
        size={60}
        thickness={4.5}
        sx={{ color: '#1976d2', marginBottom: '16px' }}
      />
      <h1 style={{ fontSize: '1.5rem', color: '#555' }}>Authenticating...</h1>
      <p style={{ fontSize: '1rem', color: '#888' }}>
        Please wait while we verify your credentials.
      </p>
    </Box>
  )
}

export default Loading
