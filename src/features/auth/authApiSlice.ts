import { apiSlice } from "../../app/api/apiSlice"
import { logOut, setCredentials } from "./authSlice"

interface LoginCredentials {
  username: string
  password: string
}

interface AuthResponse {
  accessToken: string
  refreshToken?: string
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth", // devient https://coorinmath-api.onrender.com/api/auth
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
          await queryFulfilled
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
          const { accessToken } = data
          dispatch(setCredentials({ accessToken }))
        } catch (err) {
          console.error("Refresh failed:", err)
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
} = authApiSlice
