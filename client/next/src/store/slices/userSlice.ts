import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IUser } from "@shared/types/entitiesTypes";

type UserSliceStateType = Partial<IUser>;

const initialState: UserSliceStateType = {};

const userSlice = createSlice({
  name: "userSlice",
  initialState: initialState as UserSliceStateType,
  reducers: {
    setUser: (_, action: PayloadAction<UserSliceStateType>): UserSliceStateType => {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
