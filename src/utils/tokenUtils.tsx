import { setAuthState, clearAuthState } from 'src/features/auth/AuthApiSlice'
import type { RootState, AppDispatch } from 'src/app/store'
import { getMsalInstance } from 'src/msalConfig'
/**
 * Retrieves a valid access token, refreshing it if necessary.
 * @returns {Promise<string | null>} The access token or null if retrieval fails.
 */
export const getValidAccessToken = async (
  getState: () => RootState,
  dispatch: AppDispatch
): Promise<string | null> => {
  const state = getState()
  const isAuthenticated: boolean = state.auth.isAuthenticated
  const accessToken: string = state.auth.accessToken

  try {
    const msalInstance = getMsalInstance()
    const accounts = msalInstance.getAllAccounts()

    if (isAuthenticated && accounts.length > 0) {
      const account = accounts[0]

      // Try to acquire a new token silently
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ['openid', 'profile', `api://${process.env.REACT_APP_BACKEND_API_ID}/.default`],
        account
      })
      dispatch(
        setAuthState({
          isAuthenticated: true,
          user: state.auth.user,
          accessToken: tokenResponse.accessToken,
          tenantProfiles: state.auth.tenantProfiles
        })
      )

      return tokenResponse.accessToken
    } else if (accessToken !== '') {
      return accessToken
    }
  } catch (error) {
    dispatch(clearAuthState())
  }

  return null
}
