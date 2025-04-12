"use client";

import { usersAPIs } from "@/axios/apis/usersAPIs";
import { useNotify } from "@/hooks";
import { IUser } from "@/types/entitiesTypes";
import axios from "axios";
import React, { useState } from "react";
import { MoonLoader } from "react-spinners";

const UpdateUserPassword = ({ fullUserData }: { fullUserData: IUser }) => {
  const [oldPassword, setOldPassword] = useState<IUser["password"]>("");
  const [newPassword, setNewPassword] = useState<IUser["password"]>("");
  const [confirmedNewPassword, setConfirmedNewPassword] = useState<IUser["password"]>("");
  const [updatePasswordLoad, setUpdatePasswordLoad] = useState<boolean>(false);

  const notify = useNotify();

  // Function to handle password update logic
  const updateUserPassword = async () => {
    try {
      setUpdatePasswordLoad(true);

      // Validation: All fields are required
      if (!oldPassword || !newPassword || !confirmedNewPassword) {
        return notify("info", "كلمة المرور القديمة والجديدة وموافقة كلمة المرور مطلوبة");
      }

      // Validation: New password and confirmation must match
      if (newPassword !== confirmedNewPassword) {
        return notify("info", "يجب أن تكون كلمة المرور الجديدة مساوية لتأكيد كلمة المرور");
      }

      // Call the API to update the password
      await usersAPIs.updateUserPassword(fullUserData.user_id, {
        oldPassword,
        newPassword,
      });

      notify("success", "تم تحديث كلمة المرور");
    } catch (err) {
      if (!axios.isAxiosError(err) || !err?.response) {
        notify("error", "لا يوجد استجابة من الخادم. حاول مرة أخرى لاحقاً.");
      } else {
        const message = err?.response?.data?.message || "فشل في تحديث كلمة المرور!";

        notify("error", message);
      }
    } finally {
      setUpdatePasswordLoad(false);
    }
  };

  return (
    <div className="rounded-md border border-slate-200">
      {/* Header Section */}
      <header className="border-b border-slate-200 py-4 px-7">
        <h3 className="font-medium text-black">تغيير كلمة المرور</h3>
      </header>

      {/* Form Section */}
      <div className="p-7">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUserPassword();
          }}
        >
          {/* Old Password Input */}
          <div className="mb-5.5">
            <label className="mb-3 block text-sm font-medium text-black" htmlFor="oldPassword">
              كلمة المرور القديمة
            </label>
            <div className="relative">
              <input
                className="w-full rounded border border-slate-200 bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primaryColor focus-visible:outline-none"
                type="password"
                id="oldPassword"
                placeholder="أدخل كلمة المرور القديمة"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
          </div>

          {/* New Password Input */}
          <div className="mb-5.5">
            <label className="mb-3 block text-sm font-medium text-black" htmlFor="newPassword">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                className="w-full rounded border border-slate-200 bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primaryColor focus-visible:outline-none"
                type="password"
                id="newPassword"
                placeholder="أدخل كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm New Password Input */}
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black"
              htmlFor="confirmedNewPassword"
            >
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                className="w-full rounded border border-slate-200 bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primaryColor focus-visible:outline-none"
                type="password"
                id="confirmedNewPassword"
                placeholder="أدخل تأكيد كلمة المرور الجديدة"
                value={confirmedNewPassword}
                onChange={(e) => setConfirmedNewPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end gap-4.5">
            <button
              type="submit"
              disabled={updatePasswordLoad}
              className="flex items-center gap-2 rounded bg-primaryColor py-2 px-6 font-medium text-gray hover:bg-opacity-90"
            >
              <span>حفظ</span>
              {updatePasswordLoad && <MoonLoader color="#fff" size={15} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserPassword;
