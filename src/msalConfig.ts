import { PublicClientApplication, type Configuration } from '@azure/msal-browser'

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_AD_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_REDIRECT_URI ?? 'http://localhost:3000/app/auth/callback'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
}

let msalInstance: PublicClientApplication | null = null

export const getMsalInstance = (): PublicClientApplication => {
  if (msalInstance === null) {
    msalInstance = new PublicClientApplication(msalConfig)
  }
  return msalInstance
}
