import { createApi } from '@reduxjs/toolkit/query/react'
import { customFetchBaseQuery } from 'src/app/api/CustomFetchBaseQuery'

export const ContactListApiSlice = createApi({
  reducerPath: 'contactListApi',
  baseQuery: customFetchBaseQuery(process.env.REACT_APP_CONTACTLIST_MGMT_URL ?? 'http://localhost:8082/api/v1/contact_lists'
  ),
  endpoints: (builder) => ({})
})
