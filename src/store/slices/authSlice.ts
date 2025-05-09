import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login, LoginData, LoginResponse } from "../../api/authAPI";

export interface AuthState {
  accessToken: string | null;
  userId: string | null;
  userName: string | null;
  loading: boolean;
  error?: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  userId: null,
  userName: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginThunk = createAsyncThunk<
  LoginResponse,      // Type of successful answer
  LoginData,          // Data type for request
  { rejectValue: string } // error type
>(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await login(data);
      // We save in Localstorage
      localStorage.setItem("auth", JSON.stringify(response));
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Ошибка авторизации");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.userId = null;
      state.userName = null;
      state.error = null;
      localStorage.removeItem("auth");
      localStorage.removeItem("accessToken");
    },
    setCredentials(
      state,
      action: PayloadAction<{ accessToken: string; userId: string; userName: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.userId = action.payload.userId;
        state.userName = action.payload.userName;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка авторизации";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;
