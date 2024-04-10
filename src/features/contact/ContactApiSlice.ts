import { ContactApiSlice } from '../../app/api/ContactApiSlice'
import { type Contact } from '../../types/Contact.type'

const contactApiSlice = ContactApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContactById: builder.query<Contact, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'GET'
      })
    }),
    getAllContacts: builder.query<Contact[], void>({
      query: () => ({
        url: '/',
        method: 'GET'
      })
    }),
    createContact: builder.mutation<Contact, Contact>({
      query: (contact: Contact) => ({
        url: '/',
        method: 'POST',
        body: contact
      })
    }),
    updateContact: builder.mutation<Contact, Contact>({
      query: (contact: Contact) => ({
        url: `/${contact.id}`,
        method: 'PATCH',
        body: contact
      })
    }),
    deleteContact: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'DELETE'
      })
    }),
    searchContactsByName: builder.query<Contact[], string>({
      query: (name: string) => ({
        url: `/search/${name}`,
        method: 'GET'
      })
    })
  })
})

export const {
  useGetContactByIdQuery,
  useGetAllContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useSearchContactsByNameQuery
} = contactApiSlice
