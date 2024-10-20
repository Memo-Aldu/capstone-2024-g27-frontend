import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import MessagingLayout from '../../components/MessagingLayout'
import { useSendMessageMutation } from '../../features/message/MessageApiSlice'
import { type MessageRequest, type MessageResponse } from '../../types/Message.type'
import { validatePhoneNumber } from '../../features/message/MsgHelper'
import { useGetAllContactsQuery } from '../../features/contact/ContactApiSlice'
import ContactAutoComplete from 'src/components/ContactAutoComplete'
import { type Contact } from 'src/types/Contact.type'
import MsgConfirmationModal from 'src/components/MsgConfirmationModal'
import { useDispatch } from 'react-redux'
import { showSnackbar } from 'src/features/snackbar/snackbarSlice'

interface FormErrors {
  recipientError: string
  fromError: string
  messageError: string
}

function QuickMessage (): JSX.Element {
  const dispatch = useDispatch()
  const notify = (message: string, severity: 'success' | 'error' | 'warning' | 'info'): void => {
    dispatch(
      showSnackbar({ message, severity })
    )
  }

  const [sender, setSender] = useState('')
  const [to, setTo] = useState('')
  const [recipients, setRecipients] = useState<Contact[]>([])
  const [messageContent, setMessageContent] = useState('')
  const [errors, setErrors] = useState<FormErrors>({
    recipientError: '',
    fromError: '',
    messageError: ''
  })
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [msgRequest, setMsgRequest] = useState<MessageRequest | undefined>(
    undefined
  )

  const [sendSMS] = useSendMessageMutation()
  const { data: contacts } = useGetAllContactsQuery()

  const validateMsgRequest = (): MessageRequest | undefined => {
    const newErrors: FormErrors = {
      recipientError: '',
      fromError: '',
      messageError: ''
    }
    if (recipients.length === 0) {
      newErrors.recipientError = 'At least one recipient is required'
    }
    if (sender === '') {
      newErrors.fromError = 'Sender cannot be empty'
    } else if (!validatePhoneNumber(sender)) {
      newErrors.fromError = 'Invalid Phone Number'
    }

    if (messageContent === '') {
      newErrors.messageError = 'Message cannot be empty'
    }

    setErrors(newErrors)
    if (Object.values(newErrors).every((error) => error === '')) {
      return {
        userId: '12345', // Replace with actual userId
        from: sender,
        messageItems: recipients.map((recipient) => ({
          content: messageContent,
          contactId: recipient.id,
          to: recipient.phone
        }))
      }
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const tmpMsgRequest = validateMsgRequest()
    if (tmpMsgRequest != null) {
      setMsgRequest(tmpMsgRequest)
      setConfirmationModalOpen(true)
    }
  }

  const handleConfirmSend = (): void => {
    setConfirmationModalOpen(false)
    handleMsgRequest(msgRequest)
      .then((response) => {
        notify(`Message sent to ${recipients.length} recipients`, 'success')
      })
      .catch((error) => {
        notify('Error sending message', 'error')
        throw error
      })
  }

  const handleMsgRequest = async (request?: MessageRequest): Promise<MessageResponse> => {
    if (request != null) {
      const result = await sendSMS(request).unwrap()
      return result
    } else throw new Error('Invalid request')
  }

  return (
    <MessagingLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        Quick SMS
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <ContactAutoComplete
          contacts={contacts}
          recipients={recipients}
          setRecipients={setRecipients}
          recipientInput={to}
          setRecipientInput={setTo}
          errors={errors}
          setErrors={setErrors}
        />
        <Autocomplete
          disablePortal
          id="sender"
          options={[process.env.REACT_APP_TWILIO_NUMBER ?? '']}
          sx={{ my: 2 }}
          value={sender}
          onChange={(e, newValue) => {
            setSender(newValue ?? '')
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="From"
              required
              fullWidth
              error={errors.fromError !== ''}
              helperText={errors.fromError}
            />
          )}
        />
        <TextField
          sx={{ my: 2 }}
          label="Message"
          required
          fullWidth
          multiline
          rows={4}
          value={messageContent}
          onChange={(e) => {
            setMessageContent(e.target.value)
          }}
          error={errors.messageError !== ''}
          helperText={errors.messageError}
          InputProps={{
            endAdornment: (
              <Typography data-testid="char-count">
                {messageContent.length}/160
              </Typography>
            )
          }}
        />
        <Button sx={{ my: 2 }} type="submit" variant="contained">
          Send
        </Button>
      </Box>
      <MsgConfirmationModal
        open={confirmationModalOpen}
        setOpen={setConfirmationModalOpen}
        msgRequest={msgRequest}
        handleConfirmSend={handleConfirmSend}
      />
    </MessagingLayout>
  )
}

export default QuickMessage
