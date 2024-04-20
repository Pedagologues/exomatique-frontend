import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { CredentialsSlice } from "./features/credentials/CredentialsStore";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

export const persistConfig = {
  key: "root",
  storage,
  safelist: "Credentials",
};

export const store = configureStore({
  reducer: persistReducer(
    persistConfig,
    combineReducers({
      credentials: CredentialsSlice.reducer,
    })
  ),
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persist_store = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
