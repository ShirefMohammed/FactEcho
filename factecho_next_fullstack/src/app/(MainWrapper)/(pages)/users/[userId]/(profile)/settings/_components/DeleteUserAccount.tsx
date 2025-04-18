"use client";

import { usersAPIs } from "@/axios/apis/usersAPIs";
import { useLogout, useNotify } from "@/hooks";
import { IUser } from "@/types/entitiesTypes";
import { ROLES_LIST } from "@/utils/constants";
import axios from "axios";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

const DeleteUserAccount = ({ fullUserData }: { fullUserData: IUser }) => {
  const [password, setPassword] = useState<IUser["password"]>("");
  const [deleteAccountLoad, setDeleteAccountLoad] = useState<boolean>(false);

  const notify = useNotify();
  const logout = useLogout();

  const isCurrentUserAdmin = fullUserData.role === ROLES_LIST.Admin;
  const isCurrentUserOAuth = fullUserData.provider || fullUserData.provider_user_id;

  /**
   * Function to handle account deletion
   */
  const deleteUserAccount = async () => {
    try {
      setDeleteAccountLoad(true);

      if (!isCurrentUserAdmin && !isCurrentUserOAuth && !password) {
        return notify("info", "كلمة المرور مطلوبة لحذف الحساب.");
      }

      // Confirm deletion with the user
      const confirmResult = confirm(
        "هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.",
      );
      if (!confirmResult) return;

      // Call the API to delete the account
      await usersAPIs.deleteUser(fullUserData.user_id, { password });

      notify("success", "تم حذف الحساب بنجاح.");

      logout();
    } catch (err) {
      // Handle errors during account deletion
      if (!axios.isAxiosError(err) || !err?.response) {
        notify("error", "لا يوجد استجابة من الخادم. حاول مرة أخرى لاحقاً.");
      } else {
        const message = err.response?.data?.message || "فشل في حذف الحساب.";
        notify("error", message);
      }
    } finally {
      setDeleteAccountLoad(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <header className="border-b border-stroke py-4 px-7">
        <h3 className="font-medium text-black">حذف الحساب</h3>
      </header>

      <div className="p-7">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            deleteUserAccount();
          }}
        >
          {/* Show password input for non-admin users */}
          {!isCurrentUserAdmin && !isCurrentUserOAuth ? (
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black" htmlFor="Password">
                  كلمة المرور
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none"
                  type="password"
                  name="Password"
                  id="Password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            ""
          )}

          {/* Delete button */}
          <div className="flex justify-end gap-4.5">
            <button
              type="submit"
              disabled={deleteAccountLoad}
              className="w-full flex items-center justify-center gap-2 rounded bg-red-500 py-2 px-6 font-medium text-gray hover:bg-opacity-90"
            >
              <span>حذف الحساب</span>
              {deleteAccountLoad && <MoonLoader color="#fff" size={15} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteUserAccount;
