import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
} 

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
};    

const authSlice = createSlice({
  name: "auth", 
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ AuthState }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
    }
  }
}); 

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;