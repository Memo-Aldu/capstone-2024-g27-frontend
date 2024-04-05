import {
  Box,
  Button,
  Grid,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { useState } from 'react'
import MessagingLayout from '../../components/MessagingLayout'
import { useScheduleBulkSMSMutation, useScheduleSMSMutation, useSendBulkSMSMutation, useSendSMSMutation } from '../../features/sms/SmsApiSlice'
import { type BaseSMSRequest } from '../../types/SMSRequest.types'
import { type AnySMSResponse } from '../../types/SMSResponse.type'
import { validatePhoneNumber } from '../../features/sms/SmsHelper'

interface FormErrors {
  toError: string
  fromError: string
  messageError: string
  scheduleError: string
  bulkError: string
}

function QuickSMS (): JSX.Element {
  const [sender, setSender] = useState('')
  const [to, setTo] = useState('')
  const [recipients, setRecipients] = useState<string[]>([])
  const [messageContent, setMessageContent] = useState('')
  const [scheduled, setScheduled] = useState(false)
  const [scheduleTime, setScheduledTime] = useState<Date | null>(null)
  const [errors, setErrors] = useState<FormErrors>({
    toError: '',
    fromError: '',
    messageError: '',
    scheduleError: '',
    bulkError: ''
  })

  const [sendSMS] = useSendSMSMutation()
  const [scheduleSMS] = useScheduleSMSMutation()
  const [sendBulkSMS] = useSendBulkSMSMutation()
  const [scheduleBulkSMS] = useScheduleBulkSMSMutation()

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

  const validateSMSRequest = (): BaseSMSRequest | undefined => {
    const newErrors: FormErrors = {
      toError: '',
      fromError: '',
      messageError: '',
      scheduleError: '',
      bulkError: ''
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

    if (scheduled && scheduleTime == null) {
      newErrors.scheduleError = 'Scheduled time is required'
    } else if (scheduleTime != null) {
      // We want to check Time before sending and not on scheduledTime change
      const now = dayjs()
      const minimumScheduleTime = now.add(15, 'minute').toDate()
      const maximumScheduleTime = now.add(35, 'day').toDate()
      if (scheduleTime < minimumScheduleTime) {
        newErrors.scheduleError = 'Scheduled time is too soon'
      } else if (scheduleTime > maximumScheduleTime) {
        newErrors.scheduleError = 'Scheduled time is too far in the future'
      }
    }
    setErrors(newErrors)
    if (Object.values(newErrors).every((error) => error === '')) {
      return {
        recipients: currentRecipients,
        sender,
        messageContent,
        scheduled,
        scheduleTime
      }
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const smsRequest = validateSMSRequest()
    // eslint-disable-next-line no-console
    console.log(smsRequest)
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

  const handleSmsRequest = async (request: BaseSMSRequest): Promise<AnySMSResponse> => {
    const { recipients, sender, messageContent, scheduled, scheduleTime } = request
    const bulk = recipients.length > 1
    let result: AnySMSResponse
    if (scheduled) {
    // Send Scheduled SMS
      if (bulk) {
      // Send Bulk Scheduled SMS
        result = await scheduleBulkSMS({
          recipients,
          sender,
          content: messageContent,
          scheduleTime
        }).unwrap()
      } else {
      // Send Scheduled SMS
        result = await scheduleSMS({
          recipient: recipients[0],
          sender,
          content: messageContent,
          scheduleTime
        }).unwrap()
      }
    } else {
    // Send Immediate SMS
      if (bulk) {
      // Send Bulk Immediate SMS
        result = await sendBulkSMS({
          recipients,
          sender,
          content: messageContent
        }).unwrap()
      } else {
      // Send Immediate SMS
        result = await sendSMS({
          recipient: recipients[0],
          sender,
          content: messageContent
        }).unwrap()
      }
    }
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
          <Grid item xs={4}>
            <TextField
              label="To"
              required
              fullWidth
              value={to}
              onChange={(e) => {
                setTo(e.target.value)
              }}
              error={errors.toError !== ''}
              helperText={errors.toError}
            />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={handleAddRecipient}>Add</Button>
          </Grid>
          <Grid item xs={6}>
            {recipients.map((recipient) => (
              <Typography key={recipient} variant="body1" component="span">
                {recipient},
              </Typography>
            ))}
          </Grid>
        </Grid>
        <TextField
          sx={{ my: 2 }}
          label="From"
          required
          fullWidth
          value={sender}
          onChange={(e) => {
            setSender(e.target.value)
          }}
          error={errors.fromError !== ''}
          helperText={errors.fromError}
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
          InputProps={{ endAdornment: <Typography>{messageContent.length}/160</Typography> }}
          // TODO: Change Color of the text based on the length of the message + add a warning if the message is too long
        />
        <Box sx={{ display: 'flex', my: 2, alignItems: 'center' }}>
          <Typography variant="body1" component="span">
            Schedule
          </Typography>
          <Switch
            id="schedule"
            name="schedule"
            onChange={(e) => { setScheduled(e.target.checked) }}
          />
          {scheduled && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                sx={{ ml: 'auto' }}
                label="Schedule for"
                value={scheduleTime}
                onChange={(newVal) => {
                  setScheduledTime(newVal)
                }}
                slotProps={{
                  textField: {
                    error: errors.scheduleError !== '',
                    helperText: errors.scheduleError
                  }
                }}
              />
            </LocalizationProvider>
          )}
        </Box>
        <Button sx={{ my: 2 }} type="submit" variant="contained">
          Send
        </Button>
      </Box>
    </MessagingLayout>
  )
}

export default QuickSMS
