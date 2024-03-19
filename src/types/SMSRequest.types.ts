export interface SMSRequest {
  recipients: string
  sender: string
  messageContent: string
  scheduleTime: Date | null
}
