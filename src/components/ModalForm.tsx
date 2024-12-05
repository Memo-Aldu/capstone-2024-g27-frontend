import React from 'react'
import { Modal, Box, Fade, Backdrop } from '@mui/material'

interface ModalFormProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const ModalForm: React.FC<ModalFormProps> = ({ open, onClose, children }) => (
  <Modal
    open={open}
    onClose={onClose}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{ timeout: 500 }}
  >
    <Fade in={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4
        }}
      >
        {children}
      </Box>
    </Fade>
  </Modal>
)

export default ModalForm
