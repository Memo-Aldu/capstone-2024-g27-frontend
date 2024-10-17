import {
  Autocomplete,
  Box,
  Button,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { useState } from 'react'
import ContactAutoComplete from 'src/components/contact/ContactAutoComplete'
import MessagingLayout from 'src/components/sms/MessagingLayout'
import SmsConfirmationModal from 'src/components/sms/SmsConfirmationModal'
import { useGetAllContactsQuery } from 'src/features/contact/ContactApiSlice'
import {
  useScheduleBulkSMSMutation,
  useScheduleSMSMutation,
  useSendBulkSMSMutation,
  useSendSMSMutation
} from 'src/features/sms/SmsApiSlice'
import { validatePhoneNumber } from 'src/features/sms/SmsHelper'
import { type Recipient } from 'src/types/Contact.type'
import { type BaseSMSRequest } from 'src/types/SMSRequest.types'
import { type AnySMSResponse } from 'src/types/SMSResponse.type'

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
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [smsRequest, setSmsRequest] = useState<BaseSMSRequest | undefined>(undefined)
  const [sendSMS] = useSendSMSMutation()
  const [scheduleSMS] = useScheduleSMSMutation()
  const [sendBulkSMS] = useSendBulkSMSMutation()
  const [scheduleBulkSMS] = useScheduleBulkSMSMutation()

  const { data: contacts } = useGetAllContactsQuery()

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
      setSmsRequest(smsRequest)
      setConfirmationModalOpen(true)
    } else {
      // eslint-disable-next-line no-console
      console.error('Invalid SMS Request')
    }
  }

  const handleConfirmSend = (): void => {
    setConfirmationModalOpen(false)
    handleSmsRequest(smsRequest).then((response) => {
      // eslint-disable-next-line no-console
      console.log(response)
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
    })
  }

  const handleSmsRequest = async (request?: BaseSMSRequest): Promise<AnySMSResponse> => {
    if (request !== undefined) {
      const { recipients, sender, messageContent, scheduled, scheduleTime } = request
      const bulk = recipients.length > 1
      let result: Promise<AnySMSResponse>
      if (scheduled) {
        // Send Scheduled SMS
        if (bulk) {
          // Send Bulk Scheduled SMS
          result = scheduleBulkSMS({
            recipients,
            sender,
            content: messageContent,
            scheduleTime
          }).unwrap()
        } else {
          // Send Scheduled SMS
          result = scheduleSMS({
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
          result = sendBulkSMS({
            recipients,
            sender,
            content: messageContent
          }).unwrap()
        } else {
          // Send Immediate SMS
          result = sendSMS({
            recipient: recipients[0],
            sender,
            content: messageContent
          }).unwrap()
        }
      }
      return await result
    } else {
      throw new Error('Invalid SMS Request')
    }
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
        <ContactAutoComplete contacts={contacts} recipients={recipients} setRecipients={setRecipients} recipientInput={recipientInput} setRecipientInput={setRecipientInput} errors={errors} setErrors={setErrors} />
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
            endAdornment: <Typography data-testid='char-count'>{messageContent.length}/{(Math.floor(messageContent.length / 160) + 1) * 160}</Typography>
          }}
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
        <Button sx={{ my: 2 }} type="submit" variant="contained" color={messageContent.length > 160 ? 'warning' : 'primary'}>
          Send
        </Button>
      </Box>
      <SmsConfirmationModal
        open={confirmationModalOpen}
        setOpen={setConfirmationModalOpen}
        smsRequest={smsRequest}
        handleConfirmSend={handleConfirmSend} />
    </MessagingLayout>
  )
}

export default QuickSMS
