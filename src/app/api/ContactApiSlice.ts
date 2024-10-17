import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ContactApiSlice = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_CONTACT_MGMT_URL ?? 'http://localhost:8081/api/v1/contacts',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      headers.set('Accept', 'application/json')
      headers.set('Access-Control-Allow-Origin', '*')
      return headers
    }
  }),
  tagTypes: ['Contact', 'ContactList'],
  endpoints: (builder) => ({})
})
