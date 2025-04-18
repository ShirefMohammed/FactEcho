"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { IUser } from "@shared/types/entitiesTypes";

import { useUsersAPIs } from "../../../../../../api/client/useUsersAPIs";
import defaultAvatar from "../../../../../../assets/defaultAvatar.png";
import profileCover from "../../../../../../assets/profileCover.png";
import NotFound from "../../../../../../components/NotFound";
import { useHandleErrors } from "../../../../../../hooks";
import { ROLES_LIST } from "../../../../../../utils/constants";

const UserProfileOverview = () => {
  const { userId } = useParams<{ userId: string }>();

  const [userData, setUserData] = useState<IUser>();
  const [fetchUserDataLoad, setFetchUserDataLoad] = useState<boolean>(false);

  const handleErrors = useHandleErrors();
  const usersAPIs = useUsersAPIs();

  /**
   * Fetch the details of the user.
   * Uses the `getUserById` API to retrieve data.
   */
  const fetchUserData = async () => {
    if (!userId) return; // Ensure userId is available before making the API request
    try {
      setFetchUserDataLoad(true);
      const resBody = await usersAPIs.getUserById(userId); // Fetch user data based on the userId
      setUserData(resBody.data?.user);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setFetchUserDataLoad(false);
    }
  };

  /**
   * Trigger fetching user data whenever the `userId` changes.
   */
  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId]);

  return (
    <section className="mx-auto max-w-270">
      {userData ? (
        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default">
          {/* Profile Cover */}
          <div className="relative z-20 h-35 md:h-65">
            <Image
              src={profileCover}
              alt=""
              className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
            />
          </div>

          {/* Profile Info */}
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <div className="relative drop-shadow-2">
                <Image src={defaultAvatar} alt="" className="rounded-full" />
              </div>
            </div>

            <div className="mt-4">
              <h2 className="mb-1.5 text-2xl font-semibold text-black">{userData.name}</h2>

              <p className="font-medium mb-1.5">{userData.email}</p>

              <p className="font-bold">
                {userData.role === ROLES_LIST.Admin
                  ? "Admin"
                  : userData.role === ROLES_LIST.Author
                    ? "Author"
                    : userData.role === ROLES_LIST.User
                      ? "User"
                      : "Not known"}
              </p>
            </div>
          </div>
        </div>
      ) : fetchUserDataLoad ? (
        <div className="text-gray-500">جاري التحميل...</div>
      ) : (
        <NotFound resourceName="المستخدم" />
      )}
    </section>
  );
};

export default UserProfileOverview;
