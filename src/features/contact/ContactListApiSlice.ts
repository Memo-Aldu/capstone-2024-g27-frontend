import { ContactApiSlice } from '../../app/api/ContactApiSlice'
import { type ContactList } from '../../types/ContactList.type'

const contactApiListSlice = ContactApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContactListById: builder.query<ContactList, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'GET'
      }),
      providesTags: ['ContactList']
    }),
    getAllContactLists: builder.query<ContactList[], void>({
      query: () => ({
        url: '',
        method: 'GET'
      }),
      providesTags: ['ContactList']
    }),
    createContactList: builder.mutation<ContactList, ContactList>({
      query: (contactList: ContactList) => ({
        url: '',
        method: 'POST',
        body: contactList
      }),
      invalidatesTags: ['ContactList']
    }),
    updateContactList: builder.mutation<ContactList, ContactList>({
      query: (contactList: ContactList) => ({
        url: `/${contactList.id}`,
        method: 'PATCH',
        body: contactList
      }),
      invalidatesTags: ['ContactList']
    }),
    deleteContactList: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['ContactList']
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
