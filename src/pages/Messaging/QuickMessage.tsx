import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import MessagingLayout from '../../components/MessagingLayout'
import { useSendMessageMutation } from '../../features/message/MessageApiSlice'
import { type MessageRequest, type MessageResponse } from '../../types/Message.type'
import { validatePhoneNumber } from '../../features/message/SmsHelper'
import { useGetAllContactsQuery } from '../../features/contact/ContactApiSlice'

interface FormErrors {
  toError: string
  fromError: string
  messageError: string
}

function QuickMessage (): JSX.Element {
  const [sender, setSender] = useState('')
  const [to, setTo] = useState('')
  const [recipients, setRecipients] = useState<string[]>([])
  const [messageContent, setMessageContent] = useState('')
  const [errors, setErrors] = useState<FormErrors>({
    toError: '',
    fromError: '',
    messageError: ''
  })

  const [sendSMS] = useSendMessageMutation()
  const { data: contacts } = useGetAllContactsQuery()

  const handleAddRecipient = (): { newToError: string, newRecipients: string[] } => {
    const newRecipients = [...recipients]
    let newToError = ''
    if (to === '') {
      newToError = 'Recipient cannot be empty'
    } else if (validatePhoneNumber(to)) {
      newRecipients.push(to)
      setTo('')
    } else {
      newToError = 'Invalid Phone Number'
    }
    setRecipients(newRecipients)
    setErrors({ ...errors, toError: newToError })
    return { newToError, newRecipients }
  }

  const validateSMSRequest = (): MessageRequest | undefined => {
    const newErrors: FormErrors = {
      toError: '',
      fromError: '',
      messageError: ''
    }
    let currentRecipients = recipients
    let newToError = ''
    if (to !== '') {
      ({ newToError, newRecipients: currentRecipients } = handleAddRecipient())
      newErrors.toError = newToError
    } else if (recipients.length === 0) {
      newErrors.toError = 'At least one recipient is required'
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
        messageItems: currentRecipients.map((recipient) => ({
          content: messageContent,
          contactId: recipient,
          to: recipient
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
          <Grid sx={{ display: 'flex', my: 2, alignItems: 'center' }} container>
            <Grid item xs={10}>
              <Autocomplete
                  disablePortal
                  id="to"
                  value={to}
                  onChange={(e, newValue) => {
                    setTo(newValue ?? '')
                  }}
                  options={contacts?.map((contact) => contact.phone) ?? []}
                  sx={{ my: 2 }}
                  renderInput={(params) => (
                      <TextField
                          {...params}
                          label="To"
                          required
                          fullWidth
                          error={errors.toError !== ''}
                          helperText={errors.toError}
                      />
                  )}
              />
            </Grid>
            <Grid item xs={2}>
              <Button onClick={handleAddRecipient}>Add</Button>
            </Grid>
          </Grid>
          {recipients.map((recipient) => (
              <Typography key={recipient} variant="body1" component="span">
                {recipient},
              </Typography>
          ))}
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
                endAdornment: <Typography>{messageContent.length}/160</Typography>
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
