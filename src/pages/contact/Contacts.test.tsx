// src/components/Contacts.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'src/app/store'; // Assurez-vous d'importer le store correctement
import Contacts from './Contacts';

// Mock du hook useGetAllContactsQuery pour simuler une réponse de l'API
jest.mock('src/features/contact/ContactApiSlice', () => ({
  useGetAllContactsQuery: jest.fn(),
}));

describe('Composant Contacts', () => {
  it('affiche la liste des contacts récupérés', async () => {
    // Simuler la réponse de l'API
    const mockContacts = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' }
    ];

    // Remplacer le hook useGetAllContactsQuery par une version simulée
    require('src/features/contact/ContactApiSlice').useGetAllContactsQuery.mockReturnValue({
      data: mockContacts,
      isLoading: false,
      isError: false,
    });

    render(
      <Provider store={store}>
        <Contacts />
      </Provider>
    );

    // Vérifier que la liste des contacts est bien affichée
    await waitFor(() => {
      expect(screen.getByText('Contact list')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('ouvre et ferme la modale lors du clic sur le bouton "Open modal"', () => {
    render(
      <Provider store={store}>
        <Contacts />
      </Provider>
    );

    // Vérifier que la modale est fermée initialement
    expect(screen.queryByText('Text in a modal')).toBeNull();

    // Ouvrir la modale
    fireEvent.click(screen.getByRole('button')); // Clic sur le bouton pour ouvrir la modale

    // Vérifier que la modale est maintenant ouverte
    expect(screen.getByText('Text in a modal')).toBeInTheDocument();

    // Fermer la modale
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    // Vérifier que la modale est fermée après le clic sur le bouton de fermeture
    expect(screen.queryByText('Text in a modal')).toBeNull();
  });

  it('affiche le formulaire de contact dans la modale', async () => {
    render(
      <Provider store={store}>
        <Contacts />
      </Provider>
    );

    // Vérifier que la modale n'est pas affichée au départ
    expect(screen.queryByText('Add a contact')).toBeNull();

    // Ouvrir la modale
    fireEvent.click(screen.getByRole('button'));

    // Vérifier que le formulaire est bien affiché dans la modale
    expect(screen.getByText('Add a contact')).toBeInTheDocument();
  });
});
