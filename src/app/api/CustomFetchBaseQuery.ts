import { getValidAccessToken } from 'src/utils/tokenUtils'
import { type BaseQueryFn, type FetchArgs, fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { type AppDispatch, type RootState } from 'src/app/store'

/**
 * Creates a custom fetch base query with dynamic base URL and token handling.
 * @param baseUrl The base URL for the API.
 * @returns A fetchBaseQuery function with prepared headers.
 */
export const customFetchBaseQuery = (baseUrl: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQuery = fetchBaseQuery({ baseUrl })

  return async (args, api, extraOptions) => {
    const { dispatch, getState } = api

    // Retrieve the token
    const token = await getValidAccessToken(
      getState as () => RootState,
      dispatch as AppDispatch
    )

    // Check if args is a string and convert it to FetchArgs
    let modifiedArgs: FetchArgs
    if (typeof args === 'string') {
      modifiedArgs = { url: args }
    } else {
      modifiedArgs = { ...args }
    }

    // Ensure headers exist and are of type HeadersInit
    const originalHeaders = modifiedArgs.headers ?? {}
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const headers = new Headers(originalHeaders)

    // Set the headers
    if (token != null) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')

    // Assign the normalized headers back to modifiedArgs
    modifiedArgs.headers = headers

    // Proceed with the base query
    return await baseQuery(modifiedArgs, api, extraOptions)
  }
}
