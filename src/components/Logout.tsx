import React from 'react'
import { useMsal } from '@azure/msal-react'
import { useDispatch } from 'react-redux'
import { clearAuthState } from 'src/features/auth/AuthApiSlice'
import { showSnackbar } from 'src/features/snackbar/snackbarSlice'
import { Button } from '@mui/material'

const Logout: React.FC = () => {
  const { instance } = useMsal()
  const dispatch = useDispatch()

  // Notify function for displaying messages
  const notify = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info'
  ): void => {
    dispatch(showSnackbar({ message, severity }))
  }

  // Handle Logout Logic
  const handleLogout = async (): Promise<void> => {
    try {
      // Perform MSAL logout
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin
      })

      dispatch(clearAuthState())

      notify('Logout successful!', 'success')
    } catch (error) {
      notify('Error logging out, please try again!', 'error')
    }
  }
  const handleButtonClick = (): void => {
    void handleLogout()
  }

  return <Button variant="text" color='error' onClick={ handleButtonClick } data-testid="confirm-logout">
    Logout
  </Button>
}

export default Logout
