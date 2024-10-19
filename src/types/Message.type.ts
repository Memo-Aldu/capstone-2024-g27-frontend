// src/types/Message.types.ts
export interface Messages {
  httpStatus: string
  responseStatus: string
  responseMessage: string
  data: MessageResponse[]
  currentPage: number
  totalPages: number
  totalElements: number
}
export interface MessageRequest {
  userId: string
  from: string
  scheduledDate?: string
  messageItems: Array<{
    content: string
    contactId: string
    to: string
  }>
  media?: string[]
}

export interface MessageResponse {
  id: string
  conversationId: string
  to: string
  from: string
  messageSegmentCount: number
  price: number
  contactId: string
  userId: string
  country: string
  carrier: string
  status: string
  content: string
  media: string[]
  currency: {
    currencyCode: string
    displayName: string
    symbol: string
    defaultFractionDigits: number
    numericCode: number
    numericCodeAsString: string
  }
  direction: string
  type: string
  scheduledDate: string
  createdDate: string
  deliveredTime: string
}
