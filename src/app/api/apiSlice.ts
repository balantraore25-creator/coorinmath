import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import type { RootState } from '../../app/store'
import { setCredentials } from '../../features/auth/authSlice'

// Typage du token de l'auth
interface AuthResponse {
  accessToken: string
}

// Base query avec typage strict
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://coorinmath-api.onrender.com/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Wrapper avec reauth
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // result est automatiquement typé : { data?: unknown; error?: FetchBaseQueryError }
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 403) {
    console.log('sending refresh token')

    // refreshResult est aussi typé automatiquement
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    if (refreshResult.data) {
      // On sait que refreshResult.data est AuthResponse
      api.dispatch(setCredentials(refreshResult.data as AuthResponse))

      // Retry de la requête initiale
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult.error?.status === 403) {
        ;(refreshResult.error.data as { message?: string }).message =
          'Your login has expired.'
      }
      return refreshResult
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Course', 'User'],
  endpoints: () => ({}),
})





