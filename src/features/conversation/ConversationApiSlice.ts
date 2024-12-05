import { ConversationApiSlice } from 'src/app/api/ConversationApiSlice'
import { type Conversations, type BaseConversation, type ConversationResponse } from 'src/types/Conversation.type'

const conversationApiSlice = ConversationApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversations, void>({
      query: () => ''
    }),
    getConversationById: builder.query<BaseConversation, string>({
      query: (id) => `${id}`
    }),
    getConversationsByParticipant: builder.query<Conversations, { participantId: string, page: number, size: number, sortBy?: string, order?: string }
    >({
      query: ({ participantId, page, size, sortBy = 'updatedTime', order = 'desc' }) => ({
        url: `user/${participantId}`,
        method: 'GET',
        params: { page, size, sortBy, order }
      })
    }),
    createConversation: builder.mutation<ConversationResponse, Partial<BaseConversation>>({
      query: (conversation) => ({
        url: '',
        method: 'POST',
        body: conversation
      })
    }),
    updateConversation: builder.mutation<ConversationResponse, { id: string, conversation: Partial<BaseConversation> }>({
      query: ({ id, conversation }) => ({
        url: `${id}`,
        method: 'PATCH',
        body: conversation
      })
    }),
    deleteConversation: builder.mutation<void, string>({
      query: (id) => ({
        url: `${id}`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useGetConversationsQuery,
  useGetConversationByIdQuery,
  useGetConversationsByParticipantQuery,
  useCreateConversationMutation,
  useUpdateConversationMutation,
  useDeleteConversationMutation
} = conversationApiSlice
