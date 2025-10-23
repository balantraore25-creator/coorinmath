import { apiSlice } from "../../app/api/apiSlice"
import { logOut } from "./authSlice"
import { setCredentials } from './authSlice'

//import type { PayloadAction } from '@reduxjs/toolkit'
// ✅ Typage des credentials
interface LoginCredentials {
  username: string
  password: string
}

// ✅ Typage des réponses (à adapter selon ton backend)
interface AuthResponse {
  accessToken: string
  refreshToken?: string
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: credentials,
      }),
    }),

    sendLogout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const{ data} = await queryFulfilled
          console.log(data)
          dispatch(logOut())
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState())
          }, 1000)
        } catch (err) {
          console.error("Logout failed:", err)
        }
      },
    }),

    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
       async onQueryStarted(_, { dispatch, queryFulfilled }) {
                      try {
                          const { data } = await queryFulfilled
                          console.log(data)
                          const { accessToken } = data
                          dispatch(setCredentials({ accessToken }))
                      } catch (err) {
                          console.log(err)
                      }
                  }
    }),
  }),
})

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
} = authApiSlice
