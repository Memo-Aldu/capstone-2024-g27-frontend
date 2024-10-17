import { screen, fireEvent, type RenderResult } from '@testing-library/react'
import '@testing-library/jest-dom'
import QuickSMS from './QuickSMS'
import { renderWithProviders } from 'src/utils/test-utils/RenderWithProviders'
import { BrowserRouter } from 'react-router-dom'
import { type Contact } from 'src/types/Contact.type'

// Mock API requests
jest.mock('../../features/sms/SmsApiSlice', () => ({
  useSendSMSMutation: () => [jest.fn().mockResolvedValue({ success: true })],
  useScheduleSMSMutation: () => [
    jest.fn().mockResolvedValue({ success: true })
  ],
  useSendBulkSMSMutation: () => [
    jest.fn().mockResolvedValue({ success: true })
  ],
  useScheduleBulkSMSMutation: () => [
    jest.fn().mockResolvedValue({ success: true })
  ]
}))

jest.mock('../../features/contact/ContactApiSlice', () => ({
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

const renderQuickSMS = (): RenderResult => {
  return renderWithProviders(
    <BrowserRouter>
      <QuickSMS />
    </BrowserRouter>
  )
}

describe('QuickSMS', () => {
  let consoleErrorMock: jest.SpyInstance
  beforeAll(() => {
    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
  })
  afterAll(() => {
    consoleErrorMock.mockRestore()
  })

  it('renders QuickSMS component with basic fields', async () => {
    renderQuickSMS()
    expect(screen.getByLabelText(/From/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
    expect(screen.getByText(/Send/i)).toBeInTheDocument()
  })

  it('displays an error if sender is empty and form is submitted', async () => {
    renderQuickSMS()
    const sendButton = screen.getByText(/Send/i)
    fireEvent.click(sendButton)
    expect(
      await screen.findByText(/Sender cannot be empty/i)
    ).toBeInTheDocument()
  })

  it('displays an error if no recipients are added', async () => {
    renderQuickSMS()
    const sendButton = screen.getByText(/Send/i)
    fireEvent.click(sendButton)
    expect(
      await screen.findByText(/At least one recipient is required/i)
    ).toBeInTheDocument()
  })

  it('shows an error when the message is empty', async () => {
    renderQuickSMS()
    const sendButton = screen.getByText(/Send/i)
    fireEvent.click(sendButton)
    expect(
      await screen.findByText(/Message cannot be empty/i)
    ).toBeInTheDocument()
  })

  it('allows message content to be entered and counted correctly', async () => {
    renderQuickSMS()
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
})
