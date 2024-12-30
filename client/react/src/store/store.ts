import { configureStore } from "@reduxjs/toolkit";

import { IUser } from "@shared/types/entitiesTypes";

import accessTokenReducer from "./slices/accessTokenSlice";
import userReducer from "./slices/userSlice";

export type StoreState = {
  currentUser: Partial<IUser>;
  accessToken: string;
};

const devToolsStatus = import.meta.env.VITE_NODE_ENV === "development";

export const store = configureStore({
  reducer: {
    currentUser: userReducer,
    accessToken: accessTokenReducer,
  },
  devTools: devToolsStatus,
});
