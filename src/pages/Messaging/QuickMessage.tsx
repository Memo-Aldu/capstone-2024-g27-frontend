import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React, { useEffect, useState } from 'react'
import MessagingLayout from '../../components/MessagingLayout'
import { useSendMessageMutation } from 'src/features/message/MessageApiSlice'
import { type MessageRequest, type MessageResponse } from 'src/types/Message.type'
import { validatePhoneNumber } from 'src/features/message/MsgHelper'
import { useGetAllContactsQuery } from 'src/features/contact/ContactApiSlice'
import ContactAutoComplete from 'src/components/ContactAutoComplete'
import { type Contact } from 'src/types/Contact.type'
import MsgConfirmationModal from 'src/components/MsgConfirmationModal'
import { useDispatch, useSelector } from 'react-redux'
import { showSnackbar } from 'src/features/snackbar/snackbarSlice'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import type { RootState } from 'src/app/store'
import { UploadZone } from 'src/components/UploadZone'
import { ExpandMoreOutlined } from '@mui/icons-material'
import { type Template } from 'src/types/Template.type.ts'
import { useGetAllContactListsByUserIdQuery } from 'src/features/contact/ContactListApiSlice'
import Loading from 'src/components/Loading'
import type { BaseContactList } from 'src/types/ContactList.type'

dayjs.extend(utc)

interface FormErrors {
  recipientError: string
  fromError: string
  messageError: string
}

function QuickMessage (): JSX.Element {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const userId = user?.localAccountId ?? ''
  const notify = (message: string, severity: 'success' | 'error' | 'warning' | 'info'): void => {
    dispatch(
      showSnackbar({ message, severity })
    )
  }
  const [sender, setSender] = useState('')
  const [to, setTo] = useState('')
  const [recipients, setRecipients] = useState<Array<Contact | BaseContactList>>([])
  const [messageContent, setMessageContent] = useState('')
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const [errors, setErrors] = useState<FormErrors>({
    recipientError: '',
    fromError: '',
    messageError: ''
  })
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [msgRequest, setMsgRequest] = useState<MessageRequest | undefined>(
    undefined
  )

  const [sendMessage] = useSendMessageMutation()
  const { data: contacts, isLoading: isContactsLoading } = useGetAllContactsQuery()
  const { data: groups = [], isLoading: isContactListLoading } = useGetAllContactListsByUserIdQuery(userId)
  const [uploadStatus, setUploadStatus] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const validateMsgRequest = (): MessageRequest | undefined => {
    const newErrors: FormErrors = {
      recipientError: '',
      fromError: '',
      messageError: ''
    }
    if (recipients.length === 0) {
      newErrors.recipientError = 'At least one recipient (contact or group) is required'
    }
    if (sender === '') {
      newErrors.fromError = 'Sender cannot be empty'
    } else if (!validatePhoneNumber(sender)) {
      newErrors.fromError = 'Invalid Phone Number'
    }

    if (messageContent === '') {
      newErrors.messageError = 'Message cannot be empty'
    }

    if (recipients.length === 0) {
      newErrors.recipientError = 'At least one recipient (contact or group) is required'
    }

    const individualContacts = recipients.filter(
      (recipient) => 'phone' in recipient
    ) as Contact[]

    const groupContacts = recipients
      .filter((recipient) => 'listName' in recipient) // Only groups
      .flatMap((group) => {
        const groupId = (group as BaseContactList).id
        if (contacts == null) return []
        return contacts.filter((contact) => contact.contactListId === groupId)
      })

    // Deduplication logic
    const allRecipients = [...individualContacts, ...groupContacts].filter(
      (contact, index, self) =>
        index === self.findIndex((c) => c?.id === contact?.id)
    )

    allRecipients.forEach((recipient, index) => {
      if (recipient !== undefined && recipient.phone === '' && !validatePhoneNumber(recipient.phone)) {
        newErrors.recipientError = `Recipient ${index + 1} has an invalid phone number`
      }
    })

    setErrors(newErrors)
    if (Object.values(newErrors).every((error) => error === '')) {
      return {
        userId,
        from: sender,
        messageItems: allRecipients.map((recipient) => ({
          content: fillTemplatePlaceholders(messageContent, recipient),
          contactId: recipient.id,
          to: recipient.phone
        })),
        scheduledDate: (scheduledDate != null) ? dayjs(scheduledDate).utc().format() : undefined
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

  const handleConfirmSend = async (): Promise<void> => {
    setConfirmationModalOpen(false)

    const fileUrls = await uploadFiles().catch((error) => {
      notify('Error uploading files', 'error')
      throw error
    })

    if (fileUrls != null && fileUrls.length > 0 && msgRequest != null) {
      msgRequest.media = fileUrls
    }

    handleMsgRequest(msgRequest)
      .then((response) => {
        notify(`Message sent to ${recipients.length} recipients`, 'success')
      })
      .catch((error) => {
        notify('Error sending message', 'error')
        throw error
      })
  }

  const uploadToCloudinary = async (file: File): Promise<string | undefined> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'MMSAttachment')

    setUploadStatus('uploading')
    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dcf7wnrsh/upload',
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to upload: ${response.statusText}`)
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading file:', error)
    } finally {
      setUploadStatus('')
    }
  }

  const uploadFiles = async (): Promise<string[]> => {
    const urls = []
    for (const file of files) {
      const url = await uploadToCloudinary(file)
      if (url != null) {
        urls.push(url)
      }
    }
    return urls
  }

  const handleMsgRequest = async (request?: MessageRequest): Promise<MessageResponse> => {
    if (request != null) {
      const result = await sendMessage(request).unwrap()
      return result
    } else throw new Error('Invalid request')
  }

  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  useEffect(() => {
    const storedTemplates: Template[] = JSON.parse(
      localStorage.getItem('MessageTemplates') ?? '[]'
    )
    setTemplates(storedTemplates)
  }, [])

  useEffect(() => {
    if (selectedTemplate !== '') {
      const selected = templates.find(
        (template) => template.id === selectedTemplate
      )
      if (selected != null) {
        setMessageContent(selected.body)
      }
    }
  }, [selectedTemplate, templates])

  const handleTemplateChange = (event: SelectChangeEvent<string>): void => {
    setSelectedTemplate(event.target.value)
  }

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setMessageContent(event.target.value)
  }

  const fillTemplatePlaceholders = (template: string, recipient?: Contact): string => {
    const replaceInTemplate = (template: string, obj: Record<string, string | number> | Contact): string => {
      for (const [key, value] of Object.entries(obj)) {
        template = template.replace(`{{${key}}}`, String(value))
      }
      return template
    }

    const placeholders = {
      Date: new Date().toLocaleDateString(),
      Day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      Month: new Date().toLocaleDateString('en-US', { month: 'long' }),
      Year: new Date().getFullYear(),
      AppVersion: '1.0.0',
      SupportEmail: 'support@messagingapp.com',
      RandomNumber: Math.floor(Math.random() * 100)
    }
    template = replaceInTemplate(template, placeholders)

    if (recipient != null) {
      template = replaceInTemplate(template, recipient)
    }

    return template
  }

  if (isContactsLoading || isContactListLoading) {
    return (
      <Box sx={{
        mb: 2,
        textAlign: 'center',
        width: 'calc(90vw - 200px)'
      }}>
        <Loading message={'Getting Contacts...'} description={'Please wait 😊'}/>
      </Box>
    )
  }

  return (
    <MessagingLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        Quick Message
      </Typography>
      <Box
        width='50vw'
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Box>
          <ContactAutoComplete
            contacts={contacts}
            contactGroups={groups}
            recipients={recipients}
            setRecipients={setRecipients}
            recipientInput={to}
            setRecipientInput={setTo}
            errors={errors}
            setErrors={setErrors}
          />
        </Box>
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
          onChange={handleMessageChange}
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
        <Accordion sx={{ my: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
            <Typography>Templates</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth>
              <InputLabel>Select Template</InputLabel>
              <Select value={selectedTemplate} onChange={handleTemplateChange}>
                {templates.map((template: Template, index: number) => (
                  <MenuItem key={index} value={template.id}>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span>{template.name}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <UploadZone
          uploadStatus={uploadStatus}
          setUploadStatus={setUploadStatus}
          files={files}
          setFiles={setFiles}
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
