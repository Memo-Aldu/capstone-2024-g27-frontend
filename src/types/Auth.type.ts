interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string
  tenantProfiles: Record<string, TenantProfile> | undefined
}

interface User {
  username: string
  homeAccountId: string
  localAccountId: string
  environment: string
  email?: string
  id?: string
  tenantProfiles?: Record<string, TenantProfile>
}

interface TenantProfile {
  displayName?: string
  id?: string
  [key: string]: any
}
