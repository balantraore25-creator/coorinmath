import { createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CoursesState {
  selectedCourseId: string | null
}

const initialState: CoursesState = {
  selectedCourseId: null,
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    selectCourse: (state, action: PayloadAction<string>) => {
      state.selectedCourseId = action.payload
    },
    clearSelectedCourse: (state) => {
      state.selectedCourseId = null
    },
  },
})

export const { selectCourse, clearSelectedCourse } = coursesSlice.actions
export default coursesSlice.reducer
