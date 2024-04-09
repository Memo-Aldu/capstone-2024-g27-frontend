import { apiSlice } from '../../app/api/ApiSlice'
import { type SMSSendRequest, type SMSScheduleRequest, type SMSBulkSendRequest, type SMSBulkScheduleRequest } from '../../types/SMSRequest.types'
import { type SMSBulkScheduleResponse, type SMSBulkSendResponse, type SMSScheduleResponse, type SMSSendResponse } from '../../types/SMSResponse.type'

const smsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendSMS: builder.mutation<SMSSendResponse, SMSSendRequest>({
      query: (sms: SMSSendRequest) => ({
        url: '/send',
        method: 'POST',
        body: sms
      })
    }),
    scheduleSMS: builder.mutation<SMSScheduleResponse, SMSScheduleRequest>({
      query: (sms: SMSScheduleRequest) => ({
        url: '/schedule',
        method: 'POST',
        body: sms
      })
    }),
    sendBulkSMS: builder.mutation<SMSBulkSendResponse, SMSBulkSendRequest>({
      query: (sms: SMSBulkSendRequest) => ({
        url: '/bulk/send',
        method: 'POST',
        body: sms
      })
    }),
    scheduleBulkSMS: builder.mutation<SMSBulkScheduleResponse, SMSBulkScheduleRequest>({
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
