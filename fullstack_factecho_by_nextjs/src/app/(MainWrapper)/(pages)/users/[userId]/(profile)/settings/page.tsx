"use client";

import { usersAPIs } from "@/axios/apis/usersAPIs";
import { useHandleErrors } from "@/hooks";
import { NextAuthUserSession } from "@/types/apiTypes";
import { IUser } from "@/types/entitiesTypes";
import { ROLES_LIST } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import DeleteUserAccount from "./_components/DeleteUserAccount";
import UpdateUserAvatar from "./_components/UpdateUserAvatar";
import UpdateUserInfo from "./_components/UpdateUserInfo";
import UpdateUserPassword from "./_components/UpdateUserPassword";

export default function SettingsPage() {
  const { data: session } = useSession();
  const currentUser = session?.user as NextAuthUserSession;

  const [fullUserData, setFullUserData] = useState<IUser>();
  const [fetchFullUserDataLoad, setFetchFullUserDataLoad] = useState<boolean>(false);

  const handleErrors = useHandleErrors();

  /**
   * Fetch the full details of the currently logged-in user.
   * Uses the `getUserById` API to retrieve data.
   */
  const fetchFullUserData = async () => {
    try {
      setFetchFullUserDataLoad(true);
      const resBody = await usersAPIs.getUserById(currentUser?.user_id!);
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
    if (currentUser?.user_id) fetchFullUserData();
  }, [currentUser]);

  if (fetchFullUserDataLoad) {
    return <div className="text-gray-500">جاري التحميل...</div>;
  }

  if (!fullUserData) {
    return <div className="text-red-500">لا توجد بيانات مستخدم للعرض.</div>;
  }

  return (
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
  );
}
