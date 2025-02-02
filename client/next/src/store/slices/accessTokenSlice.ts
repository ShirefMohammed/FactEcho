import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type StateType = string;

const initialState: StateType = "";

const accessTokenSlice = createSlice({
  name: "accessTokenSlice",
  initialState: initialState as StateType,
  reducers: {
    setAccessToken: (_, action: PayloadAction<StateType>): StateType => {
      return action.payload;
    },
  },
});

export const { setAccessToken } = accessTokenSlice.actions;
export default accessTokenSlice.reducer;
