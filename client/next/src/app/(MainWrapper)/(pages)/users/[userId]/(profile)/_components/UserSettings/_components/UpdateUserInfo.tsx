"use client";

import axios from "axios";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

import { IUser } from "@shared/types/entitiesTypes";

import { useUsersAPIs } from "../../../../../../../../../api/client/useUsersAPIs";
import { useNotify } from "../../../../../../../../../hooks";

/**
 * `UpdateUserInfo` component allows users to update their personal information.
 */
const UpdateUserInfo = ({ fullUserData }: { fullUserData: IUser }) => {
  const [name, setName] = useState<IUser["name"]>(fullUserData.name); // State for managing the user's name
  const [updateUserInfoLoad, setUpdateUserInfoLoad] = useState<boolean>(false); // State for handling loading state of the update button

  const notify = useNotify(); // Hook for sending notifications to the user
  const usersAPIs = useUsersAPIs(); // Hook for calling user-related APIs

  /**
   * Function to handle updating the user's information.
   */
  const updateUserInfo = async () => {
    try {
      setUpdateUserInfoLoad(true);

      if (!name) {
        return notify("info", "اسم الحساب مطلوب");
      }

      await usersAPIs.updateUserDetails(fullUserData.user_id, { name });

      notify("success", "تم تحديث البيانات بنجاح!");
    } catch (err) {
      if (!axios.isAxiosError(err) || !err?.response) {
        notify("error", "لا يوجد استجابة من الخادم. حاول مرة أخرى لاحقاً.");
      } else {
        const message = err?.response?.data?.message || "فشل في تحديث الحساب!";
        notify("error", message);
      }
    } finally {
      setUpdateUserInfoLoad(false);
    }
  };

  return (
    <div className="rounded-md border border-slate-200">
      <header className="border-b border-slate-200 py-4 px-7">
        <h3 className="font-medium text-black">المعلومات الشخصية</h3>
      </header>

      <div className="p-7">
        {/* Form to update user information */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUserInfo();
          }}
        >
          {/* Input for the user's full name */}
          <div className="mb-5.5">
            <label className="mb-3 block text-sm font-medium text-black" htmlFor="fullName">
              الاسم الكامل
            </label>
            <div className="relative">
              <span className="absolute left-4.5 top-4">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
              <input
                className="w-full rounded border border-slate-200 bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primaryColor focus-visible:outline-none"
                type="text"
                name="fullName"
                id="fullName"
                placeholder="أدخل اسمك"
                value={name}
                onChange={(e) => setName(e.target.value)} // Update name state on input change
              />
            </div>
          </div>

          {/* Display for the user's email address */}
          <div className="mb-5.5">
            <label className="mb-3 block text-sm font-medium text-black" htmlFor="emailAddress">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <span className="absolute left-4.5 top-4">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
              <input
                className="w-full rounded border border-slate-200 bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primaryColor focus-visible:outline-none disabled:bg-whiter"
                type="email"
                id="emailAddress"
                placeholder="أدخل بريدك الإلكتروني"
                value={fullUserData.email}
                disabled // Email field is disabled as it is not editable
              />
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end gap-4.5">
            <button
              type="submit"
              disabled={updateUserInfoLoad}
              className="flex justify-center gap-2 rounded bg-primaryColor py-2 px-6 font-medium text-gray hover:bg-opacity-90"
            >
              <span>حفظ</span>
              {updateUserInfoLoad && <MoonLoader color="#fff" size={15} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserInfo;
