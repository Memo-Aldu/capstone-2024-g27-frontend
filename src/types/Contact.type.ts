export interface BaseContact {
  contactListId: string
  firstName: string
  lastName: string
  preferredName: string
  email: string
  phone: string
  fax: string
  addressId: string
  doNotContact: boolean
}

export interface Contact extends BaseContact {
  id: string
}

export type Recipient = Contact | string
