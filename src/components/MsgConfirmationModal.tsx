import { Box, Button, Modal, Typography, Divider } from '@mui/material'
import { type MessageRequest } from 'src/types/Message.type'

interface MsgConfirmationModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  msgRequest?: MessageRequest
  handleConfirmSend: () => void
}

const MsgConfirmationModal = ({ open, setOpen, msgRequest, handleConfirmSend }: MsgConfirmationModalProps): JSX.Element => {
  return (
    <Modal open={open} onClose={() => { setOpen(false) }}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '400px' },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Confirm Message
        </Typography>
        <Divider />

        <Box>
          <Typography variant="subtitle1" color="text.secondary">
            Recipient:
          </Typography>
          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
            {msgRequest?.messageItems.map((item) => item.to).join(', ')}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" color="text.secondary">
            From:
          </Typography>
          <Typography variant="body1">{msgRequest?.from}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" color="text.secondary">
            Message:
          </Typography>
          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
            {msgRequest?.messageItems[0].content}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => { setOpen(false) }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmSend}
            data-testid="confirm-send-btn"
          >
            Confirm Send
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default MsgConfirmationModal
