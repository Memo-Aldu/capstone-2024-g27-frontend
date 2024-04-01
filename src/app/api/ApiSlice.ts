import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SMS_MGMT_URL ?? 'http://localhost:8080/api/v1/sms',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      headers.set('Accept', 'application/json')
      headers.set('Access-Control-Allow-Origin', '*')
      return headers
    }
  }),
  endpoints: (builder) => ({})
})
