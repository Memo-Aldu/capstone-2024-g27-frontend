import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ContactListApiSlice = createApi({
  reducerPath: 'contactListApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_CONTACTLIST_MGMT_URL ?? 'http://localhost:8081/api/v1/contact_lists',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      headers.set('Accept', 'application/json')
      headers.set('Access-Control-Allow-Origin', '*')
      return headers
    }
  }),
  endpoints: (builder) => ({})
})
