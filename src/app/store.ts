// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { MessageApiSlice } from 'src/app/api/MessageApiSlice'
import { ContactApiSlice } from 'src/app/api/ContactApiSlice'
import { ConversationApiSlice } from 'src/app/api/ConversationApiSlice'
import snackbarReducer from 'src/features/snackbar/snackbarSlice'
import authReducer from 'src/features/auth/AuthApiSlice'
import { ContactListApiSlice } from 'src/app/api/ContactListApiSlice'

const authPersistConfig = {
  key: 'auth_v2',
  storage
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

const rootReducer = combineReducers({
  [MessageApiSlice.reducerPath]: MessageApiSlice.reducer,
  [ContactApiSlice.reducerPath]: ContactApiSlice.reducer,
  [ContactListApiSlice.reducerPath]: ContactListApiSlice.reducer,
  [ConversationApiSlice.reducerPath]: ConversationApiSlice.reducer,
  snackbar: snackbarReducer,
  auth: persistedAuthReducer
})

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }).concat(
      MessageApiSlice.middleware,
      ContactApiSlice.middleware,
      ContactListApiSlice.middleware,
      ConversationApiSlice.middleware
    )
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
