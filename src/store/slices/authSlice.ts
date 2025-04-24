import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  userName: string | null;
} 

const initialState: AuthState = {
  accessToken: null,
  userId: null,
  userName: null,
};    

const authSlice = createSlice({
  name: "auth", 
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ accessToken: string; userId: string; userName: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
    },
    logout(state) {
      state.accessToken = null;
      state.userId = null;
      state.userName = null;
    },
  }
}); 

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
