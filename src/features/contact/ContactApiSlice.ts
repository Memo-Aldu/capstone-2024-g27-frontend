import { apiSlice } from '../../app/api/ApiSlice'
import { type Contact } from '../../types/Contact.type'

const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContactById: builder.query({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'GET'
      })
    }),
    getAllContacts: builder.query({
      query: () => ({
        url: '/',
        method: 'GET'
      })
    }),
    createContact: builder.mutation({
      query: (contact: Contact) => ({
        url: '/',
        method: 'POST',
        body: contact
      })
    }),
    updateContact: builder.mutation({
      query: (contact: Contact) => ({
        url: `/${contact.id}`,
        method: 'PATCH',
        body: contact
      })
    }),
    deleteContact: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'DELETE'
      })
    }),
    searchContactsByName: builder.query({
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
