import { MessageApiSlice } from 'src/app/api/MessageApiSlice'
import { type MessageRequest, type MessageResponse, type Messages } from '../../types/Message.type'

const messageApiSlice = MessageApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<MessageResponse, MessageRequest>({
      query: (message: MessageRequest) => ({
        url: '',
        method: 'POST',
        body: message
      })
    }),
    getMessageById: builder.query<MessageResponse, string>({
      query: (id: string) => ({
        url: `${id}`,
        method: 'GET'
      })
    }),
    getMessages: builder.query<Messages, { userId: string, contactId: string, page?: number, size?: number, sortBy?: string, order?: string }>({
      query: ({ userId, contactId, page = 0, size = 10, sortBy = 'createdTime', order = 'desc' }) => ({
        url: '',
        method: 'GET',
        params: { userId, contactId, page, size, sortBy, order }
      })
    }),
    patchMessageById: builder.mutation<MessageResponse, string>({
      query: (id: string) => ({
        url: `${id}`,
        method: 'PATCH'
      })
    }),
    getMessagesByUserId: builder.query<Messages, { userId: string, page?: number, size?: number, sortBy?: string, order?: string }>({
      query: ({ userId, page = 0, size = 10, sortBy = 'createdTime', order = 'desc' }) => ({
        url: `/user/${userId}`,
        method: 'GET',
        params: { page, size, sortBy, order }
      })
    })
  })
})
export const {
  useSendMessageMutation,
  usePatchMessageByIdMutation,
  useGetMessageByIdQuery,
  useGetMessagesQuery,
  useGetMessagesByUserIdQuery
} = messageApiSlice
