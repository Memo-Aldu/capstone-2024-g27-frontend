import { Autocomplete, Checkbox, TextField } from '@mui/material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { type Contact } from 'src/types/Contact.type'
import { type BaseContactList } from 'src/types/ContactList.type'
import { useEffect, useState } from 'react'

interface ContactAutoCompleteProps {
  contacts?: Contact[]
  recipients: Array<Contact | BaseContactList>
  contactGroups?: BaseContactList[]
  setRecipients: (recipients: Array<Contact | BaseContactList>) => void
  recipientInput: string
  setRecipientInput: (recipientInput: string) => void
  errors: { recipientError: string }
  setErrors: (errors: any) => void
}

function getRecipientLabel (option: Contact | BaseContactList): string {
  if ('phone' in option) {
    return `${option.firstName} ${option.lastName} - ${option.phone}`
  }
  return `Group: ${option.listName}`
}

const ContactAutoComplete = ({
  contacts = [],
  contactGroups = [],
  recipients,
  setRecipients,
  recipientInput,
  setRecipientInput,
  errors,
  setErrors
}: ContactAutoCompleteProps): JSX.Element => {
  const [filteredOptions, setFilteredOptions] = useState([...contacts, ...contactGroups])

  useEffect(() => {
    setFilteredOptions([...contacts, ...contactGroups])
  }, [contacts, contactGroups])

  const handleInputChange = (event: any, value: string): void => {
    setRecipientInput(value)
    const searchTerm = value.toLowerCase()
    if (searchTerm === '') {
      setFilteredOptions([...contacts, ...contactGroups])
    }
    setFilteredOptions(
      [...contacts, ...contactGroups].filter((option) => {
        if ('phone' in option) {
          return (
            option.firstName.toLowerCase().includes(searchTerm) ||
            option.lastName.toLowerCase().includes(searchTerm) ||
            option.phone.includes(searchTerm)
          )
        }
        return option.listName.toLowerCase().includes(searchTerm)
      })
    )
  }
  return (
    <Autocomplete
      id="recipients"
      options={filteredOptions}
      value={recipients}
      getOptionLabel={(option) => getRecipientLabel(option)}
      multiple
      filterSelectedOptions
      disableCloseOnSelect
      isOptionEqualToValue={(option, value) => {
        if ('phone' in option && 'phone' in value) {
          return option.id === value.id
        }
        if ('listName' in option && 'listName' in value) {
          return option.id === value.id
        }
        return false
      }}
      onInputChange={handleInputChange}
      onChange={(event, newRecipients) => {
        setRecipients(newRecipients as Array<Contact | BaseContactList>)
        setErrors({ recipientError: '' })
      }}
      ListboxProps={{
        style: {
          maxHeight: 200,
          overflow: 'auto'
        }
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id}>
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
          placeholder="Start typing to search for contacts or groups"
          fullWidth
          error={!(errors.recipientError === '')}
          helperText={errors.recipientError}
        />
      )}
      sx={{ my: 2 }}
    />
  )
}

export default ContactAutoComplete
