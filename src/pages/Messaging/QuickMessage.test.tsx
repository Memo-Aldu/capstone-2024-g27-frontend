import { screen, fireEvent, type RenderResult } from '@testing-library/react'
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
  currency: {
    currencyCode: 'USD',
    displayName: 'US Dollar',
    symbol: '$',
    defaultFractionDigits: 2,
    numericCode: 840,
    numericCodeAsString: '840'
  },
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
    const addButton = screen.getByText(/Add/i)

    // Simulate entering a valid phone number
    fireEvent.change(toField, { target: { value: '1234567890' } })
    fireEvent.click(addButton)

    // Check that the recipient was added to the list
    expect(screen.getByText(/1234567890/i)).toBeInTheDocument()
    expect(toField).toHaveValue('')
    expect(screen.queryByText(/Invalid Phone Number/i)).not.toBeInTheDocument()
  })

  it('shows an error when adding an invalid recipient', async () => {
    renderQuickMessage()

    const toField = screen.getByLabelText(/To/i)
    const addButton = screen.getByText(/Add/i)

    // Simulate entering an invalid phone number
    fireEvent.change(toField, { target: { value: 'abcde12345' } })
    fireEvent.click(addButton)

    // Check that the error message is displayed
    expect(
      await screen.findByText(/Invalid Phone Number/i)
    ).toBeInTheDocument()
    expect(screen.queryByText(/abcde12345/i)).not.toBeInTheDocument()
  })

  it('displays an error when trying to add an empty recipient', async () => {
    renderQuickMessage()

    const addButton = screen.getByText(/Add/i)
    fireEvent.click(addButton)

    // Check that the error message is displayed
    expect(
      await screen.findByText(/Recipient cannot be empty/i)
    ).toBeInTheDocument()
  })

  it('clears the To field after a recipient is added', async () => {
    renderQuickMessage()

    const toField = screen.getByLabelText(/To/i)
    const addButton = screen.getByText(/Add/i)

    // Enter a valid recipient and add them
    fireEvent.change(toField, { target: { value: '1234567890' } })
    fireEvent.click(addButton)

    // The To field should now be empty
    expect(toField).toHaveValue('')
  })

  it('removes a recipient from the list', async () => {
    renderQuickMessage()

    const toField = screen.getByLabelText(/To/i)
    const addButton = screen.getByText(/Add/i)

    // Add a recipient
    fireEvent.change(toField, { target: { value: '1234567890' } })
    fireEvent.click(addButton)
    expect(screen.getByText(/1234567890/i)).toBeInTheDocument()

    // Simulate removing the recipient (assume a remove button exists)
    const removeButton = screen.getByText(/Remove/i)
    fireEvent.click(removeButton)

    // Verify recipient is removed
    expect(screen.queryByText(/1234567890/i)).not.toBeInTheDocument()
  })
})
