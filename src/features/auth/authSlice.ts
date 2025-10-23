import { createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "../../app/store"; // Ajuste le chemin selon ton projet

// ✅ Définition du type de l’état
interface AuthState {
  token: string | null
}

// ✅ État initial typé
const initialState: AuthState = {
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.token = action.payload.accessToken
    },
    logOut: (state) => {
      state.token = null
    },
  },
})

// ✅ Export des actions
export const { setCredentials, logOut } = authSlice.actions

// ✅ Export du reducer
export default authSlice.reducer

// ✅ Sélecteur typé
export const selectCurrentToken = (state: RootState): string | null => state.auth.token
