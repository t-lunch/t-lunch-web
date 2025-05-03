import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import lunchReducer from "./slices/lunchesSlice";
import { userApi } from '../api/userApi';

interface Preloaded {
  auth?: AuthState;
}

const authFromLs = JSON.parse(
  localStorage.getItem("auth") || "null"
) as AuthState | null;

const preloaded: Preloaded = authFromLs
  ? { auth: authFromLs }
  : {};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lunches: lunchReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
  preloadedState: preloaded,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
