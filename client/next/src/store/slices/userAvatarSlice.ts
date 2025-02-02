import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type StateType = string;

const initialState: StateType = "";

const userAvatarSlice = createSlice({
  name: "userAvatarSlice",
  initialState: initialState as StateType,
  reducers: {
    setUserAvatar: (_, action: PayloadAction<StateType>): StateType => {
      return action.payload;
    },
  },
});

export const { setUserAvatar } = userAvatarSlice.actions;
export default userAvatarSlice.reducer;
