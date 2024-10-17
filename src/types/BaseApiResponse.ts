export interface ErrorAPIResponse {
  code: number
  message: string
  errors: string[]
  callerURL: string
  headers: BaseHeaders
}

export interface BaseHeaders {
  'Content-Type': string
  Location: string
  'Content-Length': number
  Date: Date
  'Keep-Alive': string
  Connection: string
}

export interface BaseAPIResponse {
  body: any
  headers: BaseHeaders
}
