// src/types/Conversation.type.ts
// Define a type for the full API response
export interface Conversations {
  httpStatus: string
  responseStatus: string
  responseMessage: string
  data: BaseConversation[]
  currentPage: number
  totalPages: number
  totalElements: number
}

export interface BaseConversation {
  id: string
  userId: string
  contactId: string
  conversationName?: string | null
  status: string
  createdDate: string
  updatedDate?: string | null
}
