import { configureStore, type EnhancedStore } from '@reduxjs/toolkit'
import { ContactApiSlice } from 'src/features/api/ContactApiSlice'
import { SmsApiSlice } from 'src/features/api/SmsApiSlice'

export const setupStore = (preloadedState = {}): EnhancedStore =>
  configureStore({
    reducer: {
      [SmsApiSlice.reducerPath]: SmsApiSlice.reducer,
      [ContactApiSlice.reducerPath]: ContactApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(SmsApiSlice.middleware, ContactApiSlice.middleware),
    preloadedState
  })

export const store = setupStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
