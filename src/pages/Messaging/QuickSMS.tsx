import {
  Box,
  Button,
  Grid,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import MessagingLayout from '../../components/MessagingLayout'
import { DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useState } from 'react'
import dayjs from 'dayjs'

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

  const handleAddRecipient = (): void => {
    if (to === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        toError: 'Recipient cannot be empty'
      }))
      return
    }
    setRecipients((prevRecipients) => [...prevRecipients, to])
    setTo('')
  }

  const validateSMSRequest = (): void => {
    const newErrors: FormErrors = {
      toError: '',
      fromError: '',
      messageError: '',
      scheduleError: '',
      bulkError: ''
    }
    if (recipients.length === 0) {
      if (to !== '') {
        // Check if there is a recipient in the input field
        handleAddRecipient()
      } else {
        newErrors.toError = 'At least one recipient is required'
      }
    }
    if (sender === '') {
      newErrors.fromError = 'Sender cannot be empty'
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
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    validateSMSRequest()
    const smsRequest = {
      recipients: recipients.join(', '),
      sender,
      messageContent,
      scheduleTime
    }

    // eslint-disable-next-line no-console
    console.log(smsRequest)
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
