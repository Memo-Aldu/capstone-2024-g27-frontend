import { showSnackbar } from 'src/features/snackbar/snackbarSlice'
import { useDispatch } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useNotify = () => {
  const dispatch = useDispatch()
  return (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    dispatch(showSnackbar({ message, severity }))
  }
}
