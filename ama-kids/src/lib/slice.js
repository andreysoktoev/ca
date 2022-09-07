import { createSlice } from '@reduxjs/toolkit'
import { random } from "./random"

const initialState = {
  choice: null,
  path: random(4, 10),
  solution: null,
  start: random(9)
}

export const slice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    pick: (state, action) => {
      state.choice ??= action.payload
    },
    reset: (state) => {
      state.choice = null,
      state.path = random(4, 10),
      state.solution = null,
      state.start = random(9)
    },
    solve: (state, action) => {
      state.solution = action.payload
    }
  },
})

export const { pick, reset, solve } = slice.actions

export default slice.reducer