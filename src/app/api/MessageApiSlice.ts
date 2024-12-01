import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const MessageApiSlice = createApi({
  reducerPath: 'messageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SMS_MGMT_URL ?? 'http://localhost:8081/api/v1/messages',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      headers.set('Accept', 'application/json')
      return headers
    }
  }),
  endpoints: (builder) => ({})
})
