import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'src/app/store'; // Assurez-vous que votre store Redux est correctement exporté
import ContactForm from './ContactForm';
import { useCreateContactMutation } from 'src/features/contact/ContactApiSlice';

// Mock du hook `useCreateContactMutation`
jest.mock('src/features/contact/ContactApiSlice', () => ({
  useCreateContactMutation: jest.fn(),
}));

// Mock du showSnackbar
jest.mock('src/features/snackbar/snackbarSlice', () => ({
  showSnackbar: jest.fn(),
}));

describe('ContactForm', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
  });

  it('renders the form with initial state', () => {
    render(
      <Provider store={store}>
        <ContactForm onClose={onCloseMock} />
      </Provider>
    );

    // Vérification des champs de formulaire
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Preferred Name')).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('phone')).toBeInTheDocument();
    expect(screen.getByLabelText('fax')).toBeInTheDocument();
    expect(screen.getByText('Do Not Contact')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    // Mock de la mutation réussie
    const mockCreateContact = jest.fn().mockResolvedValue({});
    (useCreateContactMutation as jest.Mock).mockReturnValue([mockCreateContact, {}]);

    render(
      <Provider store={store}>
        <ContactForm onClose={onCloseMock} />
      </Provider>
    );

    // Remplissage du formulaire
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Preferred Name'), { target: { value: 'Johnny' } });
    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('fax'), { target: { value: '0987654321' } });
    fireEvent.click(screen.getByLabelText('Do Not Contact'));

    // Soumission du formulaire
    fireEvent.click(screen.getByText('Add Contact'));

    // Attendre que l'appel API se termine et vérifier la fermeture du formulaire
    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));

    // Vérifier que la mutation a été appelée
    expect(mockCreateContact).toHaveBeenCalledWith({
      contactListId: '',
      firstName: 'John',
      lastName: 'Doe',
      preferredName: 'Johnny',
      phone: '1234567890',
      email: 'john@example.com',
      fax: '0987654321',
      addressId: '',
      doNotContact: true,
    });
  });

  it('shows a success snackbar when contact is created', async () => {
    const showSnackbar = require('src/features/snackbar/snackbarSlice').showSnackbar;
    
    // Mock de la mutation réussie
    const mockCreateContact = jest.fn().mockResolvedValue({});
    (useCreateContactMutation as jest.Mock).mockReturnValue([mockCreateContact, {}]);

    render(
      <Provider store={store}>
        <ContactForm onClose={onCloseMock} />
      </Provider>
    );

    // Remplissage du formulaire
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });

    // Soumission du formulaire
    fireEvent.click(screen.getByText('Add Contact'));

    // Vérifier que le snackbar a été appelé
    await waitFor(() => expect(showSnackbar).toHaveBeenCalledWith({
      message: 'Contact created',
      severity: 'success',
    }));
  });

  it('shows an error snackbar when contact creation fails', async () => {
    // Mock de la mutation échouée
    const mockCreateContact = jest.fn().mockRejectedValue(new Error('Error creating contact'));
    (useCreateContactMutation as jest.Mock).mockReturnValue([mockCreateContact, {}]);

    const showSnackbar = require('src/features/snackbar/snackbarSlice').showSnackbar;

    render(
      <Provider store={store}>
        <ContactForm onClose={onCloseMock} />
      </Provider>
    );

    // Remplissage du formulaire
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });

    // Soumission du formulaire
    fireEvent.click(screen.getByText('Add Contact'));

    // Vérifier que le snackbar d'erreur a été appelé
    await waitFor(() => expect(showSnackbar).toHaveBeenCalledWith({
      message: 'Error creating contact',
      severity: 'error',
    }));
  });
});
