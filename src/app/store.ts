import { configureStore, type EnhancedStore } from '@reduxjs/toolkit'
import { MessageApiSlice } from './api/MessageApiSlice'
import { ContactApiSlice } from './api/ContactApiSlice'
import { ConversationApiSlice } from './api/ConversationApiSlice'

export const setupStore = (preloadedState = {}): EnhancedStore =>
  configureStore({
    reducer: {
      [MessageApiSlice.reducerPath]: MessageApiSlice.reducer,
      [ContactApiSlice.reducerPath]: ContactApiSlice.reducer,
      [ConversationApiSlice.reducerPath]: ConversationApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(MessageApiSlice.middleware, ContactApiSlice.middleware, ConversationApiSlice.middleware),
    preloadedState
  })

export const store = setupStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
