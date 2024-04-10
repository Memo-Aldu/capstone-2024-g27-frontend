import { ContactApiSlice } from '../../app/api/ContactApiSlice'
import { type ContactList } from '../../types/ContactList.type'

const contactApiListSlice = ContactApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContactListById: builder.query<ContactList, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'GET'
      })
    }),
    getAllContactLists: builder.query<ContactList[], void>({
      query: () => ({
        url: '/',
        method: 'GET'
      })
    }),
    createContactList: builder.mutation<ContactList, ContactList>({
      query: (contactList: ContactList) => ({
        url: '/',
        method: 'POST',
        body: contactList
      })
    }),
    updateContactList: builder.mutation<ContactList, ContactList>({
      query: (contactList: ContactList) => ({
        url: `/${contactList.id}`,
        method: 'PATCH',
        body: contactList
      })
    }),
    deleteContactList: builder.mutation<void, string>({
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
