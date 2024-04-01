export interface SMSSendResponse {
  id: string
  status: string
}

export interface SMSScheduleResponse extends SMSSendResponse {
  scheduledTime: Date
}

export interface SMSBulkSendResponse {
  messages: SMSSendResponse[]
}

export interface SMSBulkScheduleResponse extends SMSBulkSendResponse {
  scheduledTime: Date
}

export type AnySMSResponse = SMSSendResponse | SMSScheduleResponse | SMSBulkSendResponse | SMSBulkScheduleResponse
