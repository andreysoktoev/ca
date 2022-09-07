import { configureStore } from '@reduxjs/toolkit'
import Slice from './lib/slice'

export const store = configureStore({
  reducer: {
    point: Slice
  }
})