import { screen, fireEvent, type RenderResult, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import QuickMessage from './QuickMessage'
import { renderWithProviders } from 'src/utils/test-utils/RenderWithProviders'
import { BrowserRouter } from 'react-router-dom'
import { type Contact } from 'src/types/Contact.type'
import { type MessageResponse } from 'src/types/Message.type'

const mockResponse: MessageResponse = {
  id: '1',
  conversationId: '1',
  to: '1234567890',
  from: '1234567890',
  messageSegmentCount: 0,
  price: 0,
  contactId: '1',
  userId: '1',
  country: 'US',
  carrier: 'AT&T',
  status: 'sent',
  content: 'Test message content',
  media: [],
  currency: 'USD',
  direction: 'outbound',
  type: 'sms',
  scheduledDate: '2022-01-01T00:00:00.000Z',
  createdDate: '2022-01-01T00:00:00.000Z',
  deliveredTime: '2022-01-01T00:00:00.000Z'
} satisfies MessageResponse

jest.mock('../../features/message/MessageApiSlice.ts', () => ({
  useSendMessageMutation: () => [jest.fn().mockResolvedValue(mockResponse)],
  useGetMessageByIdQuery: () => [jest.fn().mockResolvedValue(mockResponse)],
  useGetMessagesQuery: () => ({
    data: [mockResponse],
    isLoading: false,
    isError: false
  })
}))

jest.mock('../../features/contact/ContactApiSlice.ts', () => ({
  useGetAllContactsQuery: () => ({
    data: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        email: 'johndoe@mail',
        contactListId: '1',
        addressId: '1',
        doNotContact: false,
        preferredName: 'John Doe'
      }
    ] as Contact[],
    isLoading: false,
    isError: false
  })
}))

const renderQuickMessage = (): RenderResult => {
  return renderWithProviders(
    <BrowserRouter>
      <QuickMessage />
    </BrowserRouter>
  )
}

describe('QuickMessage', () => {
  let consoleErrorMock: jest.SpyInstance
  beforeAll(() => {
    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
  })
  afterAll(() => {
    consoleErrorMock.mockRestore()
  })

  it('renders QuickMessage component with basic fields', async () => {
    renderQuickMessage()
    expect(screen.getByLabelText(/From/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
    expect(screen.getByText(/Send/i)).toBeInTheDocument()
  })

  it('displays an error if sender is empty and form is submitted', async () => {
    renderQuickMessage()
    const sendButton = screen.getByText(/Send/i)
    fireEvent.click(sendButton)
    expect(
      await screen.findByText(/Sender cannot be empty/i)
    ).toBeInTheDocument()
  })

  it('displays an error if no recipients are added', async () => {
    renderQuickMessage()
    const sendButton = screen.getByText(/Send/i)
    fireEvent.click(sendButton)
    expect(
      await screen.findByText(/At least one recipient is required/i)
    ).toBeInTheDocument()
  })

  it('shows an error when the message is empty', async () => {
    renderQuickMessage()
    const sendButton = screen.getByText(/Send/i)
    fireEvent.click(sendButton)
    expect(
      await screen.findByText(/Message cannot be empty/i)
    ).toBeInTheDocument()
  })

  it('allows message content to be entered and counted correctly', async () => {
    renderQuickMessage()
    const messageField = screen.getByLabelText(/Message/i)

    const charCount = screen.getByTestId('char-count')
    expect(charCount).toBeInTheDocument()
    expect(charCount).toHaveTextContent('0/160')

    fireEvent.change(messageField, {
      target: { value: 'Test message content' }
    })
    expect(messageField).toHaveValue('Test message content')

    const newCharCount = screen.getByTestId('char-count')
    expect(newCharCount).toBeInTheDocument()
    expect(newCharCount).toHaveTextContent('20/160')
  })

  it('adds a valid recipient to the list', async () => {
    renderQuickMessage()

    const toField = screen.getByLabelText(/To/i)
    const recipientsAutocomplete = screen.getByTestId('contact-auto-complete')

    // Simulate entering a valid phone number
    fireEvent.change(toField, { target: { value: '1234567890' } })
    const contactCheckbox = await waitFor(() => screen.getByText(/John Doe - 1234567890/i))
    fireEvent.click(contactCheckbox)

    // Check that the recipient was added to the list
    expect(toField).toHaveValue('')
    expect(recipientsAutocomplete).toHaveTextContent('John Doe - 1234567890')
    expect(screen.queryByText(/Invalid Phone Number/i)).not.toBeInTheDocument()
  })

  it('shows an error when adding an invalid recipient', async () => {
    renderQuickMessage()

    const toField = screen.getByLabelText(/To/i)

    // Simulate entering an invalid phone number
    fireEvent.change(toField, { target: { value: 'abcde12345' } })
    fireEvent.click(screen.getByText(/Send/i))

    // Not applicable for now since we can only add contacts
    // expect(
    //   await screen.findByText(/Invalid Phone Number/i)
    // ).toBeInTheDocument()
    expect(screen.queryByText(/abcde12345/i)).not.toBeInTheDocument()
  })

  it('clears the To field after a recipient is added', async () => {
    renderQuickMessage()

    const toField = screen.getByLabelText(/To/i)

    // Enter a valid recipient and add them
    fireEvent.change(toField, { target: { value: '1234567890' } })
    const contactCheckbox = await waitFor(() => screen.getByText(/John Doe - 1234567890/i))
    fireEvent.click(contactCheckbox)

    // The To field should now be empty
    expect(toField).toHaveValue('')
  })

  it('removes a recipient from the list', async () => {
    renderQuickMessage()

    const toField = screen.getByLabelText(/To/i)

    // Add a recipient
    fireEvent.change(toField, { target: { value: '1234567890' } })
    const contactCheckbox = await waitFor(() => screen.getByText(/John Doe - 1234567890/i))
    fireEvent.click(contactCheckbox)

    const removeBtn = screen.getByTestId('CancelIcon')
    fireEvent.click(removeBtn)

    const contactsAutocomplete = screen.getByTestId('contact-auto-complete')

    expect(toField).toHaveValue('')
    expect(contactsAutocomplete).not.toHaveTextContent('John Doe - 1234567890')
  })

  it('opens the confirmation modal when message request is valid', async () => {
    renderQuickMessage()

    // Fill in valid data
    const fromField = screen.getByLabelText(/From/i)
    fireEvent.change(fromField, {
      target: { value: process.env.REACT_APP_TWILIO_NUMBER }
    })

    const messageField = screen.getByLabelText(/Message/i)
    fireEvent.change(messageField, {
      target: { value: 'Test message content' }
    })

    const toField = screen.getByLabelText(/To/i)
    fireEvent.change(toField, { target: { value: '1234567890' } })
    const contactCheckbox = await waitFor(() =>
      screen.getByText(/John Doe - 1234567890/i)
    )
    fireEvent.click(contactCheckbox)

    fireEvent.click(screen.getByText(/Send/i))

    expect(screen.getByText(/Confirm Message/i)).toBeInTheDocument()
    expect(screen.getByTestId('confirm-send-btn')).toBeInTheDocument()
  })

  it('displays snackbar when message sent', async () => {
    renderQuickMessage()

    // Fill in valid data
    const fromField = screen.getByLabelText(/From/i)
    fireEvent.change(fromField, {
      target: { value: process.env.REACT_APP_TWILIO_NUMBER }
    })

    const messageField = screen.getByLabelText(/Message/i)
    fireEvent.change(messageField, {
      target: { value: 'Test message content' }
    })

    const toField = screen.getByLabelText(/To/i)
    fireEvent.change(toField, { target: { value: '1234567890' } })
    const contactCheckbox = await waitFor(() =>
      screen.getByText(/John Doe - 1234567890/i)
    )
    fireEvent.click(contactCheckbox)

    fireEvent.click(screen.getByText(/Send/i))

    // Confirm the modal
    const confirmButton = screen.getByTestId('confirm-send-btn')
    fireEvent.click(confirmButton)

    expect(
      await screen.findByText(/Message sent to 1 recipients/i)
    ).toBeInTheDocument()
  })

  it('displays error snackbar when sending message fails', async () => {
    renderQuickMessage()

    jest.mock('../../features/message/MessageApiSlice.ts', () => ({
      useSendMessageMutation: () => [
        jest.fn().mockRejectedValue(new Error('Failed to send message'))
      ]
    }))

    // Fill in valid data
    const fromField = screen.getByLabelText(/From/i)
    fireEvent.change(fromField, {
      target: { value: process.env.REACT_APP_TWILIO_NUMBER }
    })

    const messageField = screen.getByLabelText(/Message/i)
    fireEvent.change(messageField, {
      target: { value: 'Test message content' }
    })

    const toField = screen.getByLabelText(/To/i)
    fireEvent.change(toField, { target: { value: '1234567890' } })
    const contactCheckbox = await waitFor(() =>
      screen.getByText(/John Doe - 1234567890/i)
    )
    fireEvent.click(contactCheckbox)

    fireEvent.click(screen.getByText(/Send/i))

    const confirmButton = screen.getByTestId('confirm-send-btn')
    fireEvent.click(confirmButton)

    expect(
      await screen.findByText(/Error sending message/i)
    ).toBeInTheDocument()
  })
})
