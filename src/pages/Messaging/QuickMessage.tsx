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
import { validatePhoneNumber } from '../../features/message/SmsHelper'
import { useGetAllContactsQuery } from '../../features/contact/ContactApiSlice'
import ContactAutoComplete from 'src/components/ContactAutoComplete'
import { type Contact } from 'src/types/Contact.type'

interface FormErrors {
  recipientError: string
  fromError: string
  messageError: string
}

function QuickMessage (): JSX.Element {
  const [sender, setSender] = useState('')
  const [to, setTo] = useState('')
  const [recipients, setRecipients] = useState<Contact[]>([])
  const [messageContent, setMessageContent] = useState('')
  const [errors, setErrors] = useState<FormErrors>({
    recipientError: '',
    fromError: '',
    messageError: ''
  })

  const [sendSMS] = useSendMessageMutation()
  const { data: contacts } = useGetAllContactsQuery()

  const validateSMSRequest = (): MessageRequest | undefined => {
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
    const smsRequest = validateSMSRequest()
    if (smsRequest !== undefined) {
      handleSmsRequest(smsRequest).then((response) => {
        // eslint-disable-next-line no-console
        console.log(response)
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
    } else {
      // eslint-disable-next-line no-console
      console.error('Invalid SMS Request')
    }
  }

  const handleSmsRequest = async (request: MessageRequest): Promise<MessageResponse> => {
    const result = await sendSMS(request).unwrap()
    return result
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
    </MessagingLayout>
  )
}

export default QuickMessage
