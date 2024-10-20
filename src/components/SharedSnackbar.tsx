import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Snackbar, Alert } from '@mui/material'
import { type RootState } from 'src/app/store'
import { closeSnackbar } from 'src/features/snackbar/snackbarSlice'

const SharedSnackbar: React.FC = () => {
  const dispatch = useDispatch()
  const snackbarState = useSelector((state: RootState) => state.snackbar)

  const handleClose = (): void => {
    dispatch(closeSnackbar())
  }

  return (
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={snackbarState.severity}>
        {snackbarState.message}
      </Alert>
    </Snackbar>
  )
}

export default SharedSnackbar
