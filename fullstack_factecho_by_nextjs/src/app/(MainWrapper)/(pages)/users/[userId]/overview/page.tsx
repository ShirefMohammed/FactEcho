"use client";

import defaultAvatar from "@/assets/defaultAvatar.png";
import profileCover from "@/assets/profileCover.png";
import { usersAPIs } from "@/axios/apis/usersAPIs";
import NotFound from "@/components/NotFound";
import { useHandleErrors } from "@/hooks";
import { IUser } from "@/types/entitiesTypes";
import { ROLES_LIST } from "@/utils/constants";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const UserProfileOverview = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<IUser | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleErrors = useHandleErrors();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const resBody = await usersAPIs.getUserById(userId);
        setUser(resBody.data?.user || null);
      } catch (err) {
        handleErrors(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (isLoading) {
    return <div className="text-gray-500">جاري التحميل...</div>;
  }

  if (!user) {
    return <NotFound resourceName="المستخدم" />;
  }

  return (
    <section className="mx-auto max-w-270">
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
            <h2 className="mb-1.5 text-2xl font-semibold text-black">{user.name}</h2>

            <p className="font-medium mb-1.5">{user.email}</p>

            <p className="font-bold">
              {user.role === ROLES_LIST.Admin
                ? "Admin"
                : user.role === ROLES_LIST.Author
                  ? "Author"
                  : user.role === ROLES_LIST.User
                    ? "User"
                    : "Not known"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfileOverview;
