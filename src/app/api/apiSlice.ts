import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import type { RootState } from '../../app/store'
import { setCredentials, logOut } from '../../features/auth/authSlice'

// ✅ Typage du token de l'auth
interface AuthResponse {
  accessToken: string
  refreshToken?: string
}

// ✅ Base query avec typage strict
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://siramath.onrender.com',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// ✅ Wrapper avec reauth
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 403) {
    console.log('🔄 Access token expired, trying refresh...')

    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as AuthResponse
      api.dispatch(setCredentials({ accessToken }))

      // Retry de la requête initiale
      result = await baseQuery(args, api, extraOptions)
    } else {
      console.warn('❌ Refresh token invalid, logging out...')
      api.dispatch(logOut())
      return refreshResult
    }
  }

  return result
}

// ✅ Création de l’API
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Course', 'User'],
  endpoints: () => ({}),
})
