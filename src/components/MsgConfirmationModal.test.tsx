import { render, screen, fireEvent } from '@testing-library/react'
import MsgConfirmationModal from './MsgConfirmationModal'
import { type MessageRequest } from 'src/types/Message.type'

const msgRequest: MessageRequest = {
  userId: '1',
  from: 'Sender Name',
  messageItems: [
    {
      content: 'test message 1',
      contactId: '1',
      to: 'recipient1@example.com'
    },
    {
      content: 'test message 2',
      contactId: '2',
      to: 'recipient2@example.com'
    }
  ]
}

const setOpen = jest.fn()
const handleConfirmSend = jest.fn()

describe('MsgConfirmationModal Component', () => {
  it('renders modal with message details', () => {
    render(
      <MsgConfirmationModal
        open={true}
        setOpen={setOpen}
        msgRequest={msgRequest}
        handleConfirmSend={handleConfirmSend}
      />
    )

    expect(screen.getByText(/confirm message/i)).toBeInTheDocument()
    expect(
      screen.getByText(
        /recipient: recipient1@example.com, recipient2@example.com/i
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/from: sender name/i)).toBeInTheDocument()
    expect(screen.getByText(/message: test message 1/i)).toBeInTheDocument()
  })

  it('calls setOpen(false) when Cancel button is clicked', () => {
    render(
      <MsgConfirmationModal
        open={true}
        setOpen={setOpen}
        msgRequest={msgRequest}
        handleConfirmSend={handleConfirmSend}
      />
    )

    const cancelButton = screen.getByText(/cancel/i)
    fireEvent.click(cancelButton)

    expect(setOpen).toHaveBeenCalledWith(false)
  })

  it('calls handleConfirmSend when Confirm Send button is clicked', () => {
    render(
      <MsgConfirmationModal
        open={true}
        setOpen={setOpen}
        msgRequest={msgRequest}
        handleConfirmSend={handleConfirmSend}
      />
    )

    const confirmButton = screen.getByTestId('confirm-send-btn')
    fireEvent.click(confirmButton)

    expect(handleConfirmSend).toHaveBeenCalledTimes(1)
  })

  it('does not display modal content when open is false', () => {
    render(
      <MsgConfirmationModal
        open={false}
        setOpen={setOpen}
        msgRequest={msgRequest}
        handleConfirmSend={handleConfirmSend}
      />
    )

    expect(screen.queryByText(/confirm message/i)).not.toBeInTheDocument()
  })
})
