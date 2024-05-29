import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
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
import { useGetAllContactsQuery } from '../../features/contact/ContactApiSlice'
import { useScheduleBulkSMSMutation, useScheduleSMSMutation, useSendBulkSMSMutation, useSendSMSMutation } from '../../features/sms/SmsApiSlice'
import { validatePhoneNumber } from '../../features/sms/SmsHelper'
import { type BaseSMSRequest } from '../../types/SMSRequest.types'
import { type AnySMSResponse } from '../../types/SMSResponse.type'
import { type Recipient } from '../../types/Contact.type'

interface FormErrors {
  recipientError: string
  fromError: string
  messageError: string
  scheduleError: string
  bulkError: string
}

function QuickSMS (): JSX.Element {
  const [sender, setSender] = useState('')
  const [recipientInput, setRecipientInput] = useState('')
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [messageContent, setMessageContent] = useState('')
  const [scheduled, setScheduled] = useState(false)
  const [scheduleTime, setScheduledTime] = useState<Date | null>(null)
  const [errors, setErrors] = useState<FormErrors>({
    recipientError: '',
    fromError: '',
    messageError: '',
    scheduleError: '',
    bulkError: ''
  })

  const [sendSMS] = useSendSMSMutation()
  const [scheduleSMS] = useScheduleSMSMutation()
  const [sendBulkSMS] = useSendBulkSMSMutation()
  const [scheduleBulkSMS] = useScheduleBulkSMSMutation()
  const { data: contacts } = useGetAllContactsQuery()

  function getRecipientLabel (option: Recipient): string {
    if (typeof option === 'string') {
      return option
    }
    return `${option.firstName} ${option.lastName} - ${option.phone}`
  }

  const validateSMSRequest = (): BaseSMSRequest | undefined => {
    const newErrors: FormErrors = {
      recipientError: '',
      fromError: '',
      messageError: '',
      scheduleError: '',
      bulkError: ''
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
        recipients: recipients.map((r) => (typeof r === 'string' ? r : r.phone)),
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
        <Autocomplete
          disablePortal
          id="recipients"
          options={contacts ?? []}
          value={recipients}
          getOptionLabel={(option) => getRecipientLabel(option)}
          multiple
          freeSolo
          disableCloseOnSelect
          sx={{ my: 2 }}
          onInputChange={(e, value) => {
            setRecipientInput(value)
          }}
          onChange={(e, newRecipients, reason) => {
            if (reason === 'createOption') {
              if (validatePhoneNumber(recipientInput)) {
                setRecipients([...recipients, recipientInput])
                setRecipientInput('')
                setErrors({
                  ...errors,
                  recipientError: ''
                })
              } else {
                setErrors({
                  ...errors,
                  recipientError: 'Invalid Phone Number'
                })
              }
            } else {
              setRecipients(newRecipients)
              setErrors({
                ...errors,
                recipientError: ''
              })
            }
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {getRecipientLabel(option)}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="To"
              fullWidth
              error={errors.recipientError !== ''}
              helperText={errors.recipientError}
            />
          )}
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
            endAdornment: <Typography>{messageContent.length}/160</Typography>
          }}
          // TODO: Change Color of the text based on the length of the message + add a warning if the message is too long
        />
        <Box sx={{ display: 'flex', my: 2, alignItems: 'center' }}>
          <Typography variant="body1" component="span">
            Schedule
          </Typography>
          <Switch
            id="schedule"
            name="schedule"
            onChange={(e) => {
              setScheduled(e.target.checked)
            }}
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
