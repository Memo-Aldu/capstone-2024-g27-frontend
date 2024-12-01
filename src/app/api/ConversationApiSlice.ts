import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ConversationApiSlice = createApi({
  reducerPath: 'conversationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_CONVERSATION_MGMT_URL ?? 'http://localhost:8081/api/v1/conversation',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      headers.set('Accept', 'application/json')
      headers.set('Access-Control-Allow-Origin', '*')
      return headers
    }
  }),
  endpoints: (builder) => ({})
})
