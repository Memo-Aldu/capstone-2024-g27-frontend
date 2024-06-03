import { Box, Button, Modal, Typography } from '@mui/material'
import { type BaseSMSRequest } from '../types/SMSRequest.types'

interface SmsConfirmationModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  smsRequest?: BaseSMSRequest
  handleConfirmSend: () => void
}

const SmsConfirmationModal = ({ open, setOpen, smsRequest, handleConfirmSend }: SmsConfirmationModalProps): JSX.Element => {
  return (
    <Modal open={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4
        }}
      >
        <Typography variant="h4">Confirm SMS</Typography>
        <Typography variant="body1">
          Recipient: {smsRequest?.recipients}
        </Typography>
        <Typography variant="body1">From: {smsRequest?.sender}</Typography>
        <Typography variant="body1">
          Message: {smsRequest?.messageContent}
        </Typography>
        <Button
          variant="contained"
          color="warning"
          sx={{ mr: 2 }}
          onClick={() => {
            setOpen(false)
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" color='primary' onClick={handleConfirmSend}>
          Send
        </Button>
      </Box>
    </Modal>
  )
}

export default SmsConfirmationModal
