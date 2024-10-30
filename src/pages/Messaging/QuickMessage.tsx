import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useState } from 'react'
import MessagingLayout from '../../components/MessagingLayout'
import { useSendMessageMutation } from '../../features/message/MessageApiSlice'
import { type MessageRequest, type MessageResponse } from '../../types/Message.type'
import { validatePhoneNumber } from '../../features/message/SmsHelper'
import { useGetAllContactsQuery } from '../../features/contact/ContactApiSlice'
import ContactAutoComplete from 'src/components/ContactAutoComplete'
import { type Contact } from 'src/types/Contact.type'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

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
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
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

    recipients.forEach((recipient, index) => {
      if (!validatePhoneNumber(recipient.phone)) {
        newErrors.recipientError = `Invalid phone number for recipient ${index + 1}`
      }
    })

    setErrors(newErrors)
    if (Object.values(newErrors).every((error) => error === '')) {
      return {
        userId: '12345', // Replace with actual userId
        from: sender,
        messageItems: recipients.map((recipient) => ({
          content: messageContent,
          contactId: recipient.id,
          to: recipient.phone
        })),
        scheduledDate: (scheduledDate != null) ? dayjs(scheduledDate).utc().format() : undefined
      }
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const smsRequest = validateSMSRequest()
    if (smsRequest !== undefined) {
      handleSmsRequest(smsRequest).then((response) => {
        // eslint-disable-next-line
        console.log(response)
      }).catch((error) => {
        // eslint-disable-next-line
        console.error(error)
      })
    } else {
      // eslint-disable-next-line
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Schedule Date & Time"
            value={scheduledDate}
            onChange={(date) => { setScheduledDate(date) }}
            slotProps={{
              textField: { fullWidth: true, sx: { my: 2 } }
            }}
          />
        </LocalizationProvider>
        <Button sx={{ my: 2 }} type="submit" variant="contained">
          Send
        </Button>
      </Box>
    </MessagingLayout>
  )
}

export default QuickMessage
