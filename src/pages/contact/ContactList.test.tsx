import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContactList from './ContactList'
import { type Contact } from 'src/types/Contact.type'
import { renderWithProviders } from 'src/utils/test-utils/RenderWithProviders'

const mockContacts: Contact[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', phone: '123456789', email: 'john@doe.com', contactListId: '1', addressId: '1', doNotContact: false, preferredName: 'John Doe', fax: '123456789' },
  { id: '2', firstName: 'Jane', lastName: 'Doe', phone: '9876543210', email: 'jane@doe.com', contactListId: '1', addressId: '1', doNotContact: false, preferredName: 'Jane Doe', fax: '9876543210' }
]

const generateMockContacts = (count: number): Contact[] => {
  const contacts: Contact[] = []

  for (let i = 0; i < count; i++) {
    contacts.push({
      id: `${i + 1}`,
      firstName: `FirstName${i + 1}`,
      lastName: `LastName${i + 1}`,
      phone: `${i + 1}`.padStart(10, '0'),
      email: `email${i + 1}@example.com`,
      contactListId: '1',
      addressId: '1',
      doNotContact: false,
      preferredName: `PrefName${i + 1}`,
      fax: `${i + 1}`.padStart(10, '0')
    })
  }

  return contacts
}

describe('ContactList Component', () => {
  it('renders contact list with data', () => {
    renderWithProviders(<ContactList contacts={mockContacts} />)

    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()

    expect(screen.getByText('123456789')).toBeInTheDocument()
    expect(screen.getByText('9876543210')).toBeInTheDocument()
    expect(screen.getByText('john@doe.com')).toBeInTheDocument()
    expect(screen.getByText('jane@doe.com')).toBeInTheDocument()
  })

  it('handles delete contact action', () => {
    renderWithProviders(<ContactList contacts={mockContacts} />)

    const deleteButton = screen.getByTestId('delete-1')
    fireEvent.click(deleteButton)

    // expect(mockDeleteContact).toHaveBeenCalledTimes(1)
  })

  it('renders empty state when no contacts are provided', () => {
    renderWithProviders(<ContactList contacts={[]} />)

    expect(screen.getByText('List of Contacts')).toBeInTheDocument()
    expect(screen.queryByText('John')).not.toBeInTheDocument()
    expect(screen.queryByText('Jane')).not.toBeInTheDocument()
  })

  it('handles pagination correctly', () => {
    const contacts = generateMockContacts(30)
    renderWithProviders(<ContactList contacts={contacts} />)

    expect(screen.getByLabelText('next page')).toBeInTheDocument()
    expect(screen.getByLabelText('previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('next page')).toBeEnabled()
    expect(screen.getByLabelText('previous page')).toBeDisabled()

    fireEvent.click(screen.getByLabelText('next page'))
    expect(screen.getByLabelText('previous page')).toBeEnabled()
  })
})
