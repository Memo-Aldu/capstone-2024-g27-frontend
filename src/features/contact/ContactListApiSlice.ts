import { apiSlice } from '../../app/api/ApiSlice'
import { type ContactList } from '../../types/ContactList.type'

const contactApiListSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContactListById: builder.query({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'GET'
      })
    }),
    getAllContactLists: builder.query({
      query: () => ({
        url: '/',
        method: 'GET'
      })
    }),
    createContactList: builder.mutation({
      query: (contactList: ContactList) => ({
        url: '/',
        method: 'POST',
        body: contactList
      })
    }),
    updateContactList: builder.mutation({
      query: (contactList: ContactList) => ({
        url: `/${contactList.id}`,
        method: 'PATCH',
        body: contactList
      })
    }),
    deleteContactList: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'DELETE'
      })
    })

  })
})

export const {
  useGetContactListByIdQuery,
  useGetAllContactListsQuery,
  useCreateContactListMutation,
  useUpdateContactListMutation,
  useDeleteContactListMutation
} = contactApiListSlice
