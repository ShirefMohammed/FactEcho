import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AuthStateType {
  isAuthReady: boolean;
}

const initialState: AuthStateType = {
  isAuthReady: false,
};

const authStateSlice = createSlice({
  name: "authState",
  initialState: initialState as AuthStateType,
  reducers: {
    setAuthReady: (state, action: PayloadAction<AuthStateType["isAuthReady"]>): void => {
      state.isAuthReady = action.payload;
    },
  },
});

export const { setAuthReady } = authStateSlice.actions;
export default authStateSlice.reducer;
