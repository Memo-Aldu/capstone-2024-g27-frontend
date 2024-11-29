import { createApi } from '@reduxjs/toolkit/query/react'
import { customFetchBaseQuery } from 'src/app/api/CustomFetchBaseQuery'

export const MessageApiSlice = createApi({
  reducerPath: 'messageApi',
  baseQuery: customFetchBaseQuery(process.env.REACT_APP_SMS_MGMT_URL ?? 'http://localhost:8080/api/v1/messages'),
  endpoints: (builder) => ({})
})
