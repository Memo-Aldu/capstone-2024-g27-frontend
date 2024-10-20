import { Box, Button, Modal, Typography } from '@mui/material'
import { type MessageRequest } from 'src/types/Message.type'

interface MsgConfirmationModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  msgRequest?: MessageRequest
  handleConfirmSend: () => void
}

const MsgConfirmationModal = ({ open, setOpen, msgRequest, handleConfirmSend }: MsgConfirmationModalProps): JSX.Element => {
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
        <Typography variant="h4">Confirm Message</Typography>
        <Typography variant="body1">
          Recipient: {msgRequest?.messageItems.map((item) => item.to).join(', ')}
        </Typography>
        <Typography variant="body1">From: {msgRequest?.from}</Typography>
        <Typography variant="body1">
          Message: {msgRequest?.messageItems[0].content}
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

export default MsgConfirmationModal
