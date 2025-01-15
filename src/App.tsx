import React, { useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { MsalAuthenticationTemplate } from '@azure/msal-react'
import { EventType, InteractionType } from '@azure/msal-browser'
import type { AuthenticationResult, AuthError } from '@azure/msal-browser'
import { useDispatch } from 'react-redux'

import Layout from 'src/components/Layout'
import Home from 'src/pages/Home'
import MessagingLayout from 'src/components/MessagingLayout'
import QuickMessage from 'src/pages/Messaging/QuickMessage'
import ContactManagementLayout from 'src/components/ContactManagementLayout'
import Contacts from 'src/pages/contact/Contacts'
import ContactGroup from 'src/pages/contact/ContactGroup'
import Conversation from 'src/pages/Messaging/Conversation'
import Placeholder from 'src/pages/Placeholer'
import Account from 'src/pages/Account'
import Templates from 'src/pages/Messaging/Templates'
import HistoryPage from 'src/pages/Messaging/History'
import AuthCallback from 'src/pages/AuthCallback'
import LandingPage from 'src/pages/LandingPage'

import { getMsalInstance } from 'src/msalConfig'
import { setAuthState } from 'src/features/auth/AuthApiSlice'

import Loading from 'src/components/Loading'

const LoadingComponent = (): JSX.Element => (
  <Loading message={'Authenticating...'} description={'Please wait while we verify your credentials.'}/>
)

const ErrorComponent = ({ error }: { error: AuthError | null }): JSX.Element => (
  <div>
    <h1>Authentication Error</h1>
    <p>{error?.message ?? 'An unknown error occurred.'}</p>
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
      <Routes>
        {/*
          -------------------------------------------------------
          1. Public (Unauthenticated) Routes
          -------------------------------------------------------
        */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/*
          -------------------------------------------------------
          2. Protected Routes
             - Only logged-in users can access these. If not
               logged in, MSAL will redirect to sign in.
          -------------------------------------------------------
        */}
        <Route
          path="/"
          element={
            <MsalAuthenticationTemplate
              interactionType={InteractionType.Redirect}
              authenticationRequest={{
                scopes: [
                  'openid',
                  'profile',
                  `api://${process.env.REACT_APP_BACKEND_API_ID}/.default`
                ]
              }}
              errorComponent={ErrorComponent}
              loadingComponent={LoadingComponent}
            >
              <Layout />
            </MsalAuthenticationTemplate>
          }
        >
          { /*
            Nested protected routes inside Layout. These routes
            require login, since they're children of the
            MsalAuthenticationTemplate.
          */ }

          <Route path="dashboard" element={<Home />} />
          <Route path="messaging" element={<MessagingLayout />} />
          <Route path="messaging/quickmessage" element={<QuickMessage />} />
          <Route path="messaging/campaign" element={<Placeholder title="Campaign" />} />
          <Route path="messaging/templates" element={<Templates />} />
          <Route path="messaging/emailToSMS" element={<Placeholder title="Email to SMS" />} />
          <Route path="messaging/history" element={<HistoryPage />} />
          <Route path="contact-management" element={<ContactManagementLayout />} />
          <Route path="ContactManagement/contacts" element={<Contacts />} />
          <Route path="ContactManagement/ContactGroup" element={<ContactGroup />} />
          <Route path="messaging/conversation" element={<Conversation />} />
          <Route path="my-account" element={<Account title="Account Details" />} />
        </Route>

        {/*
          -------------------------------------------------------
          3. Fallback Route
             - If user goes to an unknown route, show landing page
          -------------------------------------------------------
        */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App
