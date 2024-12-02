import { ContactApiSlice } from '../../app/api/ContactApiSlice'
import { type BaseContact, type Contact } from '../../types/Contact.type'

const contactApiSlice = ContactApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContactById: builder.query<Contact, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'GET'
      }),
      providesTags: ['Contact']
    }),
    getAllContacts: builder.query<Contact[], void>({
      query: () => ({
        url: '',
        method: 'GET'
      }),
      providesTags: ['Contact']
    }),
    createContact: builder.mutation<Contact, BaseContact>({
      query: (contact: BaseContact) => ({
        url: '',
        method: 'POST',
        body: contact
      }),
      invalidatesTags: ['Contact']
    }),
    updateContact: builder.mutation<Contact, Contact>({
      query: (contact: Contact) => ({
        url: `/${contact.id}`,
        method: 'PATCH',
        body: contact
      }),
      invalidatesTags: ['Contact']
    }),
    deleteContact: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Contact']
    }),
    searchContactsByName: builder.query<Contact[], string>({
      query: (name: string) => ({
        url: `/search/${name}`,
        method: 'GET'
      }),
      providesTags: ['Contact']
    }),
    getAllContactsByContactListID: builder.query<Contact[], string>({
      query: (id: string) => ({
        url: `/contact-list/${id}`,
        method: 'GET'
      }),
      providesTags: ['Contact']
    }),
    getAllContactsByUserId: builder.query<Contact[], string>({
      query: (userId: string) => ({
        url: `/user/${userId}`,
        method: 'GET'
      }),
      providesTags: ['Contact']
    })
  })
})

export const {
  useGetContactByIdQuery,
  useGetAllContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useGetAllContactsByUserIdQuery,
  useGetAllContactsByContactListIDQuery,
  useSearchContactsByNameQuery
} = contactApiSlice
