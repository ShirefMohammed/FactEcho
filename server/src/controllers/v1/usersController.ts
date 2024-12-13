import {
  cleanupUnverifiedUsers as commonCleanupUnverifiedUsers,
  deleteUser as commonDeleteUser,
  getTotalUsersCount as commonGetTotalUsersCount,
  getUser as commonGetUser,
  getUsers as commonGetUsers,
  searchUsers as commonSearchUsers,
  updateUserAvatar as commonUpdateUserAvatar,
  updateUserDetails as commonUpdateUserDetails,
  updateUserPassword as commonUpdateUserPassword,
  updateUserRole as commonUpdateUserRole,
} from "../common/usersController";

export const getUsers = commonGetUsers;
export const searchUsers = commonSearchUsers;
export const getTotalUsersCount = commonGetTotalUsersCount;
export const cleanupUnverifiedUsers = commonCleanupUnverifiedUsers;
export const getUser = commonGetUser;
export const deleteUser = commonDeleteUser;
export const updateUserDetails = commonUpdateUserDetails;
export const updateUserRole = commonUpdateUserRole;
export const updateUserPassword = commonUpdateUserPassword;
export const updateUserAvatar = commonUpdateUserAvatar;
