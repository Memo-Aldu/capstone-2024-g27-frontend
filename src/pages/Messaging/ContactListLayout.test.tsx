import { render, screen, fireEvent } from '@testing-library/react';
import ContactListLayout from './ContactListLayout';
import { Contact } from '../../types/Contact.type';

// Créer un mock de la fonction onSelectContact
const mockOnSelectContact = jest.fn();

// Créer un exemple de contacts avec toutes les propriétés requises
const contacts: Contact[] = [
  {
    id: '1',
    contactListId: 'list1',
    firstName: 'Jean',
    lastName: 'Dupont',
    preferredName: 'Jean D.',
    email: 'jean.dupont@example.com',
    phone: '123-456-7890',
    fax: '123-456-7891',
    addressId: 'address1',
    doNotContact: false,
  },
  {
    id: '2',
    contactListId: 'list2',
    firstName: 'Marie',
    lastName: 'Martin',
    preferredName: 'Marie M.',
    email: 'marie.martin@example.com',
    phone: '987-654-3210',
    fax: '987-654-3211',
    addressId: 'address2',
    doNotContact: false,
  },
];

// Exemple de contact sélectionné avec toutes les propriétés requises
const selectedContact: Contact = {
  id: '1',
  contactListId: 'list1',
  firstName: 'Jean',
  lastName: 'Dupont',
  preferredName: 'Jean D.',
  email: 'jean.dupont@example.com',
  phone: '123-456-7890',
  fax: '123-456-7891',
  addressId: 'address1',
  doNotContact: false,
};

describe('ContactListLayout', () => {
  it('rende correctement la liste des contacts', () => {
    render(
      <ContactListLayout
        contacts={contacts}
        onSelectContact={mockOnSelectContact}
        selectedContact={null}
      />
    );

    // Vérifier que les deux contacts sont rendus
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('Marie Martin')).toBeInTheDocument();
  });

  it('affiche le contact sélectionné avec le style "selected"', () => {
    render(
      <ContactListLayout
        contacts={contacts}
        onSelectContact={mockOnSelectContact}
        selectedContact={selectedContact}
      />
    );

    // Vérifier que le contact sélectionné est bien mis en surbrillance
    const selectedContactElement = screen.getByText('Jean Dupont').closest('li');
    expect(selectedContactElement).toHaveClass('Mui-selected');
  });

  it('appelle la fonction onSelectContact lors de la sélection d\'un contact', () => {
    render(
      <ContactListLayout
        contacts={contacts}
        onSelectContact={mockOnSelectContact}
        selectedContact={null}
      />
    );

    // Simuler un clic sur un contact
    fireEvent.click(screen.getByText('Marie Martin'));

    // Vérifier que la fonction onSelectContact a été appelée avec le contact correct
    expect(mockOnSelectContact).toHaveBeenCalledWith({
      id: '2',
      contactListId: 'list2',
      firstName: 'Marie',
      lastName: 'Martin',
      preferredName: 'Marie M.',
      email: 'marie.martin@example.com',
      phone: '987-654-3210',
      fax: '987-654-3211',
      addressId: 'address2',
      doNotContact: false,
    });
  });

  it('ne sélectionne pas un contact si celui-ci est déjà sélectionné', () => {
    render(
      <ContactListLayout
        contacts={contacts}
        onSelectContact={mockOnSelectContact}
        selectedContact={selectedContact}
      />
    );

    // Simuler un clic sur le contact déjà sélectionné
    fireEvent.click(screen.getByText('Jean Dupont'));

    // Vérifier que la fonction onSelectContact n'a pas été appelée
    expect(mockOnSelectContact).not.toHaveBeenCalled();
  });
});
