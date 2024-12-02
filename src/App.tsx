import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Layout from 'src/components/Layout'
import Home from 'src/pages/Home'
import MessagingLayout from 'src/components/MessagingLayout'
import QuickMessage from 'src/pages/Messaging/QuickMessage'
import ContactManagementLayout from 'src/components/ContactManagementLayout'
import Contacts from 'src/pages/contact/Contacts'
import ContactGroupe from 'src/pages/contact/ContactGroupe'
import Conversation from 'src/pages/Messaging/Conversation'
import Placeholder from 'src/pages/Placeholer'
import Account from 'src/pages/Account'
import { MsalAuthenticationTemplate } from '@azure/msal-react'
import { type AuthenticationResult, EventType, InteractionType } from '@azure/msal-browser'
import { useEffect } from 'react'
import { getMsalInstance } from 'src/msalConfig'
import { useDispatch } from 'react-redux'
import { setAuthState } from 'src/features/auth/AuthApiSlice'
import Loading from 'src/components/Loading'

const LoadingComponent = (): JSX.Element => (
  <Loading />
)
const ErrorComponent = ({ error }: { error: any }): JSX.Element => (
  <div>
    <h1>Authentication Error</h1>
    <p>{error.errorMessage}</p>
  </div>
)

function App (): JSX.Element {
  const instance = getMsalInstance()
  const dispatch = useDispatch()

  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && (event.payload != null)) {
        const authResult = event.payload as AuthenticationResult
        const account = authResult.account
        const accessToken = authResult.accessToken

        if (account !== undefined && accessToken !== undefined) {
          const tenantProfiles =
            ((account?.tenantProfiles) != null)
              ? Object.entries(account.tenantProfiles).reduce<Record<string, TenantProfile>>(
                (profiles, [tenantId, profile]) => {
                  profiles[tenantId] = {
                    tenantId,
                    displayName: typeof profile.displayName === 'string' ? profile.displayName : 'Unknown Tenant',
                    roles: Array.isArray(profile.roles) ? profile.roles : []
                  }
                  return profiles
                },
                {}
              )
              : undefined
          const user: User = {
            username: account.name ?? '',
            homeAccountId: account.homeAccountId,
            localAccountId: account.localAccountId,
            environment: account.environment,
            email: account.username
          }
          dispatch(
            setAuthState({
              isAuthenticated: true,
              user,
              accessToken,
              tenantProfiles
            })
          )
        }
      }
    })
    return () => {
      if (callbackId != null) {
        instance.removeEventCallback(callbackId)
      }
    }
  }, [instance, dispatch])
  return (
    <Router>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={{
          scopes: ['openid', 'profile', `api://${process.env.REACT_APP_BACKEND_API_ID}/.default`]
        }}
        errorComponent={ErrorComponent}
        loadingComponent={LoadingComponent}
      >
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/messaging" element={<MessagingLayout />} />
            <Route path="/messaging/quickmessage" element={<QuickMessage />} />
            <Route path="/messaging/campaign" element={<Placeholder title="Campaign" />} />
            <Route path="/messaging/templates" element={<Placeholder title="Templates" />} />
            <Route path="/messaging/emailToSMS" element={<Placeholder title="Email to SMS" />} />
            <Route path="/messaging/history" element={<Placeholder title="History" />} />
            <Route path="/contact-management" element={<ContactManagementLayout />} />
            <Route path="/ContactManagement/contacts" element={<Contacts />} />
            <Route path="/ContactManagement/contactgroupe" element={<ContactGroupe/>} />
            <Route path="/messaging/conversation" element={<Conversation />} />
            <Route path="/my-account" element={<Account title={'Account Details'} />} />
          </Routes>
        </Layout>
      </MsalAuthenticationTemplate>
    </Router>
  )
}

export default App
