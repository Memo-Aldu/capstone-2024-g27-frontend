import React, { FC, useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { Action } from './ContactReducer';


interface ContactFormProps {dispatch: React.Dispatch<Action>;onClose: () => void;}

const ContactForm: FC<ContactFormProps> = ({ dispatch, onClose }) => {

  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email:'',
  });
  

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    setContact((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  dispatch({
    type: 'ADD_CONTACT',
    payload: {
      id: Date.now(), // returns current timestamp
    ...contact
    }
  });
  onClose(); // Close the form
};

  return (

    <>

    

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        
      }}
    >
      <Box component={'form'}
        onSubmit={handleOnSubmit}
        sx={{ maxWidth: 600, mx: "auto", p: 2 }}>

        <Typography variant="h4" align="center" mb={2}>
          Add a contact
        </Typography>

          <TextField
            fullWidth
            label="First Name"
            value={contact.firstName}
            onChange={handleOnChange}
            margin="normal"
            name="firstName"
            
          />
          <TextField
            fullWidth
            label="Last Name"
            value={contact.lastName}
            onChange={handleOnChange}
            margin="normal"
            name = "lastName"
          />
          <TextField
            fullWidth
            label="email"
            value={contact.email}
            onChange={handleOnChange}
            margin="normal"
            name = "email"
          />
          <TextField
            fullWidth
            label="phone"
            value={contact.phone}
            onChange={handleOnChange}
            margin="normal"
            name = "phone"
            
          />
          
          <Button variant="contained" type="submit" color="primary" sx={{ mt: 2 }}>
            Add
          </Button>  
      </Box>
    </Box>
    </>
  );
};

export default ContactForm;
