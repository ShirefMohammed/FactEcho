import { configureStore } from "@reduxjs/toolkit";
import { IUser } from "shared/types/entitiesTypes";

import accessTokenReducer from "./slices/accessTokenSlice";
import userAvatarReducer from "./slices/userAvatarSlice";
import userReducer from "./slices/userSlice";

export type StoreState = {
  currentUser: Partial<IUser>;
  currentUserAvatar: string;
  accessToken: string;
};

const devToolsStatus = process.env.NEXT_PUBLIC_NODE_ENV === "development";

export const store = configureStore({
  reducer: {
    currentUser: userReducer,
    currentUserAvatar: userAvatarReducer,
    accessToken: accessTokenReducer,
  },
  devTools: devToolsStatus,
});
