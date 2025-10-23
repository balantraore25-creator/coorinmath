import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '../features/auth/authSlice'

// Configuration du store Redux
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Tu peux ajouter d'autres slices ici, ex: userSlice, uiSlice, etc.
    auth:authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: false, // ← activé en dev, désactivable si besoin
})

setupListeners(store.dispatch)

// Typage global du store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
