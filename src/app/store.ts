import { configureStore } from '@reduxjs/toolkit'
import { MessageApiSlice } from './api/MessageApiSlice'
import { ContactApiSlice } from './api/ContactApiSlice'
import { ConversationApiSlice } from './api/ConversationApiSlice'

export const store = configureStore({
  reducer: {
    [MessageApiSlice.reducerPath]: MessageApiSlice.reducer,
    [ContactApiSlice.reducerPath]: ContactApiSlice.reducer,
    [ConversationApiSlice.reducerPath]: ConversationApiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(MessageApiSlice.middleware, ContactApiSlice.middleware, ConversationApiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
