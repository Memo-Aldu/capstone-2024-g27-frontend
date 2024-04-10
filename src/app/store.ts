import { configureStore } from '@reduxjs/toolkit'
import { SmsApiSlice } from './api/SmsApiSlice'
import { ContactApiSlice } from './api/ContactApiSlice'

export const store = configureStore({
  reducer: {
    [SmsApiSlice.reducerPath]: SmsApiSlice.reducer,
    [ContactApiSlice.reducerPath]: ContactApiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SmsApiSlice.middleware, ContactApiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
