import { createApi } from '@reduxjs/toolkit/query/react'
import { customFetchBaseQuery } from 'src/app/api/CustomFetchBaseQuery'

export const ContactApiSlice = createApi({
  reducerPath: 'contactApi',
  baseQuery: customFetchBaseQuery(process.env.REACT_APP_CONTACT_MGMT_URL ?? 'http://localhost:8081/api/v1/contacts'),
  tagTypes: ['Contact', 'ContactList'],
  endpoints: (builder) => ({})
})
