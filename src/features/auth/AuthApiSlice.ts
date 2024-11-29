import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: '',
  tenantProfiles: undefined
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (
      state,
      action: PayloadAction<{
        isAuthenticated: boolean
        user: User | null
        accessToken: string
        tenantProfiles?: Record<string, TenantProfile> | undefined
      }>
    ) => {
      return { ...state, ...action.payload }
    },
    clearAuthState: () => initialState
  }
})

export const { setAuthState, clearAuthState } = authSlice.actions
export default authSlice.reducer
