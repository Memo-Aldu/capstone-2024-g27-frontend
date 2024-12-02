import { ContactListApiSlice } from '../../app/api/ContactListApiSlice'
import { type BaseContactList } from '../../types/ContactList.type'

const contactListApiSlice = ContactListApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContactListById: builder.query<BaseContactList, string>({
      query: (id: string) => ({
        url: `/${id}`,
        method: 'GET'
      })
    }),
    getAllContactLists: builder.query<BaseContactList[], void>({
      query: () => ({
        url: '',
        method: 'GET'
      })
    }),
    getAllContactListsByUserId: builder.query<BaseContactList[], string>({
      query: (userId: string) => ({
        url: `/user/${userId}`,
        method: 'GET'
      })
    }),
    createContactList: builder.mutation<BaseContactList, BaseContactList>({
      query: (contactList: BaseContactList) => ({
        url: '',
        method: 'POST',
        body: contactList
      })
    }),
    updateContactList: builder.mutation<BaseContactList, BaseContactList>({
      query: (contactList: BaseContactList) => ({
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
  useGetAllContactListsByUserIdQuery,
  useCreateContactListMutation,
  useUpdateContactListMutation,
  useDeleteContactListMutation
} = contactListApiSlice
