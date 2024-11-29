import { createApi } from '@reduxjs/toolkit/query/react'
import { customFetchBaseQuery } from 'src/app/api/CustomFetchBaseQuery'

export const ConversationApiSlice = createApi({
  reducerPath: 'conversationApi',
  baseQuery: customFetchBaseQuery(process.env.REACT_APP_CONVERSATION_MGMT_URL ?? 'http://localhost:8080/api/v1/conversation'),
  endpoints: (builder) => ({})
})
