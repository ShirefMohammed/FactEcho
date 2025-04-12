"use client";

import defaultAvatar from "@/assets/defaultAvatar.png";
import { usersAPIs } from "@/axios/apis/usersAPIs";
import { useNotify } from "@/hooks";
import { uploadFileToCloudinary } from "@/services/uploadFileToCloudinary";
import { NextAuthUserSession } from "@/types/apiTypes";
import { IUser } from "@/types/entitiesTypes";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

/**
 * `UpdateUserAvatar` component allows users to upload and update their profile photo.
 */
const UpdateUserAvatar = ({ fullUserData }: { fullUserData: IUser }) => {
  const { data: session, update: updateSession } = useSession();
  const currentUser = session?.user as NextAuthUserSession;
  const [newAvatarBlob, setNewAvatarBlob] = useState<Blob | null>(null);
  const [updateAvatarLoad, setUpdateAvatarLoad] = useState<boolean>(false);

  const notify = useNotify();

  const updateUserAvatar = async () => {
    try {
      setUpdateAvatarLoad(true);

      if (!newAvatarBlob) {
        return notify("info", "يجب اختيار صورة");
      }

      const newAvatarUrl = await uploadFileToCloudinary(newAvatarBlob);
      await usersAPIs.updateUserAvatar(fullUserData.user_id, { avatar: newAvatarUrl });
      await updateSession({ avatar: newAvatarUrl });

      notify("success", "تم تحديث الصورة بنجاح!");
    } catch (err) {
      if (!axios.isAxiosError(err) || !err?.response) {
        notify("error", "لا يوجد استجابة من الخادم. حاول مرة أخرى لاحقاً.");
      } else {
        const message = err?.response?.data?.message || "فشل في تحديث صورة الملف الشخصى!";
        notify("error", message);
      }
    } finally {
      setUpdateAvatarLoad(false);
    }
  };

  return (
    <div className="rounded-md border border-slate-200">
      <header className="border-b border-slate-200 py-4 px-7">
        <h3 className="font-medium text-black">صورة الملف الشخصى</h3>
      </header>

      <div className="p-7">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUserAvatar();
          }}
        >
          {/* Display user's current avatar */}
          <div className="mb-4 flex items-center gap-3">
            <Image
              src={
                newAvatarBlob
                  ? URL.createObjectURL(newAvatarBlob)
                  : currentUser?.avatar && currentUser?.avatar !== ""
                    ? currentUser?.avatar
                    : defaultAvatar
              }
              alt="user avatar"
              className="h-14 w-14 rounded-full"
              width={56}
              height={56}
            />
            <span className="text-black">تحديث صورة الملف الشخصى</span>
          </div>

          {/* File input for avatar upload */}
          <div
            id="FileUpload"
            className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 sm:py-7.5"
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) setNewAvatarBlob(e.target.files[0]);
              }}
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                    fill="#3C50E0"
                  />
                </svg>
              </span>
              <p>
                <span className="text-primaryColor">انقر للتحميل</span> أو اسحب وأفلت
              </p>
              <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
              <p>(max, 800 X 800px)</p>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end gap-4.5">
            <button
              type="submit"
              disabled={updateAvatarLoad}
              className="flex items-center gap-2 rounded bg-primaryColor py-2 px-6 font-medium text-gray hover:bg-opacity-90"
            >
              <span>حفظ</span>
              {updateAvatarLoad && <MoonLoader color="#fff" size={15} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserAvatar;
