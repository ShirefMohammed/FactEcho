"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { IUser } from "@shared/types/entitiesTypes";

import { useUsersAPIs } from "../../../../../../../../api/client/useUsersAPIs";
import { useHandleErrors } from "../../../../../../../../hooks";
import { StoreState } from "../../../../../../../../store/store";
import { ROLES_LIST } from "../../../../../../../../utils/rolesList";
import DeleteUserAccount from "./_components/DeleteUserAccount";
import UpdateUserAvatar from "./_components/UpdateUserAvatar";
import UpdateUserInfo from "./_components/UpdateUserInfo";
import UpdateUserPassword from "./_components/UpdateUserPassword";

const UserSettings = () => {
  // Retrieve the current user from Redux store
  const currentUser = useSelector((state: StoreState) => state.currentUser);

  // State to store the full user data
  const [fullUserData, setFullUserData] = useState<IUser>();

  // State to track the loading status of fetching user data
  const [fetchFullUserDataLoad, setFetchFullUserDataLoad] = useState<boolean>(false);

  // Custom hooks for handling errors and API calls
  const handleErrors = useHandleErrors();
  const usersAPIs = useUsersAPIs();

  /**
   * Fetch the full details of the currently logged-in user.
   * Uses the `getUserById` API to retrieve data.
   */
  const fetchFullUserData = async () => {
    try {
      setFetchFullUserDataLoad(true);
      const resBody = await usersAPIs.getUserById(currentUser.user_id!);
      setFullUserData(resBody.data?.user);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setFetchFullUserDataLoad(false);
    }
  };

  /**
   * Trigger fetching user data whenever the `currentUser` changes.
   */
  useEffect(() => {
    if (currentUser.user_id) fetchFullUserData();
  }, [currentUser]);

  return (
    <div>
      {fetchFullUserDataLoad ? (
        <div className="text-gray-500">جاري التحميل...</div>
      ) : fullUserData ? (
        <div className="grid grid-cols-5 gap-8">
          {/* Update User Info */}
          <div className="col-span-5 xl:col-span-5">
            <UpdateUserInfo fullUserData={fullUserData} />
          </div>

          {/* Update User Avatar */}
          {fullUserData.role === ROLES_LIST.Admin || fullUserData.role === ROLES_LIST.Author ? (
            <div className="col-span-5 xl:col-span-5">
              <UpdateUserAvatar fullUserData={fullUserData} />
            </div>
          ) : (
            ""
          )}

          {/* Update User Password */}
          {!fullUserData.provider && !fullUserData.provider_user_id ? (
            <div className="col-span-5 xl:col-span-5">
              <UpdateUserPassword fullUserData={fullUserData} />
            </div>
          ) : (
            ""
          )}

          {/* Delete User Account */}
          <div className="col-span-5 xl:col-span-5">
            <DeleteUserAccount fullUserData={fullUserData} />
          </div>
        </div>
      ) : (
        <div className="text-red-500">لا توجد بيانات مستخدم للعرض.</div> // Fallback for no data
      )}
    </div>
  );
};

export default UserSettings;
