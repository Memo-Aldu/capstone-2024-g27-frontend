export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phoneNumber)
}
