import { Box, Button, Grid, Typography } from '@mui/material'
import ContactManagementLayout from './ContactManagementLayout'
import ContactForm from './ContactForm'
import ContactList from './ContactList'
import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { useGetAllContactsQuery } from '../../features/contact/ContactApiSlice'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export function TransitionsModal (): JSX.Element {
  const [open, setOpen] = React.useState(false)
  const handleOpen = (): void => { setOpen(true) }
  const handleClose = (): void => { setOpen(false) }

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

function Contacts (): JSX.Element {
  const { data: contacts } = useGetAllContactsQuery()
  const [open, setOpen] = React.useState(false)
  const handleOpen = (): void => { setOpen(true) }
  const handleClose = (): void => { setOpen(false) }

  return (

      <ContactManagementLayout>
        <Grid container spacing={2}>
          <Grid item xs={8}>
              <Typography variant="h4" component="h1" gutterBottom>
              Contact list
              </Typography>

          </Grid>
          <Grid item xs={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleOpen} >
              {/* icone d'ajout de person */}
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </Button>
          </Grid>
          <Grid item xs={12}>
            {/* Affichage du formulaire de contact uniquement si la popup est ouverte */}

          </Grid>
          <Grid item xs={12}>
          {(<ContactList contacts={contacts}/>)}
          </Grid>
        </Grid>

        {/* Ceci est une fenetre modal */}
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
          <ContactForm onClose={handleClose}/>
          </Box>
        </Fade>
      </Modal>

      </ContactManagementLayout>

  )
}

export default Contacts
