import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UsersState {
  selectedUserId: string | null
}

const initialState: UsersState = {
  selectedUserId: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    selectUser: (state, action: PayloadAction<string>) => {
      state.selectedUserId = action.payload
    },
    clearSelectedUser: (state) => {
      state.selectedUserId = null
    },
  },
})

export const { selectUser, clearSelectedUser } = usersSlice.actions
export default usersSlice.reducer
