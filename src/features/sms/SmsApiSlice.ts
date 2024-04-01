import { apiSlice } from '../../app/api/ApiSlice'
import { type SMSSendRequest, type SMSScheduleRequest, type SMSBulkSendRequest, type SMSBulkScheduleRequest } from '../../types/SMSRequest.types'

const smsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendSMS: builder.mutation({
      query: (sms: SMSSendRequest) => ({
        url: '/send',
        method: 'POST',
        body: sms
      })
    }),
    scheduleSMS: builder.mutation({
      query: (sms: SMSScheduleRequest) => ({
        url: '/schedule',
        method: 'POST',
        body: sms
      })
    }),
    sendBulkSMS: builder.mutation({
      query: (sms: SMSBulkSendRequest) => ({
        url: '/bulk/send',
        method: 'POST',
        body: sms
      })
    }),
    scheduleBulkSMS: builder.mutation({
      query: (sms: SMSBulkScheduleRequest) => ({
        url: '/bulk/schedule',
        method: 'POST',
        body: sms
      })
    })
  })
})

export const {
  useSendSMSMutation,
  useScheduleSMSMutation,
  useSendBulkSMSMutation,
  useScheduleBulkSMSMutation
} = smsApiSlice
