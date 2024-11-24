import { render, screen, fireEvent } from '@testing-library/react'
import ContactAutoComplete from './ContactAutoComplete'
import { type Contact } from 'src/types/Contact.type'

// Mock data
const contacts: Contact[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', phone: '123456789', email: 'john@doe.com', contactListId: '1', addressId: '1', doNotContact: false, preferredName: 'John Doe', fax: '123456789' },
  { id: '2', firstName: 'Jane', lastName: 'Doe', phone: '9876543210', email: 'jane@doe.com', contactListId: '1', addressId: '1', doNotContact: false, preferredName: 'Jane Doe', fax: '9876543210' }
]

const recipients = [contacts[0]]

const setRecipients = jest.fn()
const setRecipientInput = jest.fn()
const setErrors = jest.fn()

const errors = {
  recipientError: ''
}

describe('ContactAutoComplete Component', () => {
  it('renders input field with label "To"', () => {
    render(
      <ContactAutoComplete
        contacts={contacts}
        recipients={recipients}
        setRecipients={setRecipients}
        recipientInput=""
        setRecipientInput={setRecipientInput}
        errors={errors}
        setErrors={setErrors}
      />
    )

    const inputField = screen.getByLabelText(/to/i)
    expect(inputField).toBeInTheDocument()
  })

  it('displays recipients as selected options', () => {
    render(
      <ContactAutoComplete
        contacts={contacts}
        recipients={recipients}
        setRecipients={setRecipients}
        recipientInput=""
        setRecipientInput={setRecipientInput}
        errors={errors}
        setErrors={setErrors}
      />
    )

    const selectedRecipient = screen.getByText(/john doe - 123456789/i)
    expect(selectedRecipient).toBeInTheDocument()
  })

  it('calls setRecipientInput when typing in the input field', () => {
    render(
      <ContactAutoComplete
        contacts={contacts}
        recipients={recipients}
        setRecipients={setRecipients}
        recipientInput=""
        setRecipientInput={setRecipientInput}
        errors={errors}
        setErrors={setErrors}
      />
    )

    const inputField = screen.getByLabelText(/to/i)

    fireEvent.change(inputField, { target: { value: 'Jane' } })

    expect(setRecipientInput).toHaveBeenCalledWith('Jane')
  })

  it('calls setRecipients and clears errors when a new recipient is selected', () => {
    render(
      <ContactAutoComplete
        contacts={contacts}
        recipients={recipients}
        setRecipients={setRecipients}
        recipientInput=""
        setRecipientInput={setRecipientInput}
        errors={errors}
        setErrors={setErrors}
      />
    )

    const inputField = screen.getByLabelText(/to/i)

    fireEvent.change(inputField, { target: { value: 'Jane' } })
    fireEvent.click(screen.getByText(/jane doe - 987654321/i))

    expect(setRecipients).toHaveBeenCalledWith([recipients[0], contacts[1]])
    expect(setErrors).toHaveBeenCalledWith({
      ...errors,
      recipientError: ''
    })
  })

  it('shows recipientError when there is an error', () => {
    const errorState = {
      recipientError: 'This field is required'
    }

    render(
      <ContactAutoComplete
        contacts={contacts}
        recipients={recipients}
        setRecipients={setRecipients}
        recipientInput=""
        setRecipientInput={setRecipientInput}
        errors={errorState}
        setErrors={setErrors}
      />
    )

    const errorText = screen.getByText(/this field is required/i)
    expect(errorText).toBeInTheDocument()
  })

  it('displays a checkbox next to each contact', () => {
    render(
      <ContactAutoComplete
        contacts={contacts}
        recipients={recipients}
        setRecipients={setRecipients}
        recipientInput=""
        setRecipientInput={setRecipientInput}
        errors={errors}
        setErrors={setErrors}
      />
    )

    const inputField = screen.getByLabelText(/to/i)
    fireEvent.change(inputField, { target: { value: 'Doe' } })
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(2)
  })
})
