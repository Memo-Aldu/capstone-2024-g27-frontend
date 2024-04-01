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
  messageContent: string
}

export interface SMSScheduleRequest {
  recipient: string
  sender: string
  messageContent: string
  scheduleTime: Date | null
}

export interface SMSBulkSendRequest {
  recipients: string[]
  sender: string
  messageContent: string
}

export interface SMSBulkScheduleRequest {
  recipients: string[]
  sender: string
  messageContent: string
  scheduleTime: Date | null
}
