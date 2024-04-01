export interface BaseSMSRequest {
  recipients: string[]
  sender: string
  messageContent: string
  scheduled: boolean
  scheduleTime: Date | null

}

export interface SMSSendRequest {
  recipient: string
  sender: string
  content: string
}

export interface SMSScheduleRequest extends SMSSendRequest {
  scheduleTime: Date | null
}

export interface SMSBulkSendRequest {
  recipients: string[]
  sender: string
  content: string
}

export interface SMSBulkScheduleRequest extends SMSBulkSendRequest {
  scheduleTime: Date | null
}
