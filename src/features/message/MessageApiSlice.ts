import { MessageApiSlice } from '../../app/api/MessageApiSlice'
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
    })
  })
})
export const {
  useSendMessageMutation,
  useGetMessageByIdQuery,
  useGetMessagesQuery
} = messageApiSlice
