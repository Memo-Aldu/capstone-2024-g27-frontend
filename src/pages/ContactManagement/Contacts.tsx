import { Box, Button, Grid, Typography } from '@mui/material'
import ContactManagementLayout from './ContactManagementLayout'
import { useState } from 'react';
import ContactForm from './ContactForm';
import { contactsReducer, State } from './ContactReducer';
import { useReducer } from 'react';
import ContactList from './ContactList';

const initialState: State = {
  contacts: []
};
function Contacts (): JSX.Element {
  const [state, dispatch] = useReducer(contactsReducer, initialState);

  const [isPopupOpen, setIsPopupOpen] = useState(false); // État pour contrôler l'ouverture/fermeture de la popup

  // Fonction pour basculer l'état de la popup entre visible et invisible
  function togglePopup() {
    setIsPopupOpen(!isPopupOpen);
  }


  return (
    
      <ContactManagementLayout>
        <Grid container spacing={2}>
          <Grid item xs={8}>
              <Typography variant="h4" component="h1" gutterBottom>
              Contact list
              </Typography>
          </Grid>
          <Grid item xs={4}>
              <Button variant="contained" color="primary" onClick={togglePopup} style={{ float: 'right' }}>
              {isPopupOpen ? 'Close' : 'Add Contact'}
              </Button>
          </Grid>
          <Grid item xs={12}>
            {/* Affichage du formulaire de contact uniquement si la popup est ouverte */}
            {isPopupOpen && <ContactForm dispatch={dispatch} onClose={togglePopup} />}
          </Grid>
          <Grid item xs={12}>
          {state.contacts.length > 0 && <ContactList contacts={state.contacts} />}
          </Grid>
        </Grid>    

          
      </ContactManagementLayout>

  )
}

export default Contacts
