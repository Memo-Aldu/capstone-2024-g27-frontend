import { screen, fireEvent, waitFor, type RenderResult } from '@testing-library/react'
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
  it('renders QuickSMS component with basic fields', async () => {
    renderQuickSMS()
    const elem = await waitFor(() => screen.getByText('From'))
    fireEvent.click(screen.getByText('From'))
    expect(elem).toBeInTheDocument()
  })
})
