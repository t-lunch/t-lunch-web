import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import lunchReducer from "./slices/lunchesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lunches: lunchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;