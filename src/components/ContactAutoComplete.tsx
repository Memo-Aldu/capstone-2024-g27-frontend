import { Autocomplete, Checkbox, TextField } from '@mui/material'
import { validatePhoneNumber } from '../features/sms/SmsHelper'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { type Recipient, type Contact } from '../types/Contact.type'

interface ContactAutoCompleteProps {
  contacts?: Contact[]
  recipients: Recipient[]
  setRecipients: (recipients: any[]) => void
  recipientInput: string
  setRecipientInput: (recipientInput: string) => void
  errors: any
  setErrors: (errors: any) => void
}

function getRecipientLabel (option: Recipient): string {
  if (typeof option === 'string') {
    return option
  }
  return `${option.firstName} ${option.lastName} - ${option.phone}`
}

const ContactAutoComplete = ({ contacts, recipients, setRecipients, recipientInput, setRecipientInput, errors, setErrors }: ContactAutoCompleteProps): JSX.Element => {
  return (
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
  )
}

export default ContactAutoComplete
