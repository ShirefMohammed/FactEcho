"use client";

import axios from "axios";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

import { IUser } from "@shared/types/entitiesTypes";

import { useUsersAPIs } from "../../../../../api/client/useUsersAPIs";
import { useNotify } from "../../../../../hooks";
import { ROLES_LIST } from "../../../../../utils/constants";

const UpdateUser = ({
  setUsers,
  willUpdatedUser,
  setOpenUpdateUser,
}: {
  setUsers: any;
  willUpdatedUser: IUser;
  setOpenUpdateUser: (openUpdateUser: boolean) => void;
}) => {
  // Loading state for updating the user role
  const [updateUserRoleLoad, setUpdateUserRoleLoad] = useState<boolean>(false);

  const notify = useNotify(); // Hook for displaying notifications
  const usersAPIs = useUsersAPIs(); // Hook for interacting with users API

  /**
   * Update the user's role to "Author" in the database and update the UI accordingly.
   */
  const setUserToAuthor = async () => {
    try {
      setUpdateUserRoleLoad(true);

      // Confirm
      const confirmResult = confirm("Are you sure?");
      if (!confirmResult) return;

      // Define the new role to set for the user
      const newRole = ROLES_LIST.Author;

      // Call API to update the user role
      await usersAPIs.updateUserRole(willUpdatedUser.user_id, { role: newRole });

      // Update the user in the local state
      setUsers((prev: IUser[]) =>
        prev.map((user: IUser) =>
          user.user_id === willUpdatedUser.user_id ? { ...user, role: newRole } : user,
        ),
      );

      // Notify the user about the successful update
      notify("success", "User has been set as an author.");

      // Close the modal after successful update
      setOpenUpdateUser(false);
    } catch (err) {
      // Handle potential errors during the API call
      if (!axios.isAxiosError(err) || !err?.response) {
        notify("error", "No Server Response");
      } else {
        const message = err.response?.data?.message;
        notify("error", message || "Failed to update user role!");
      }
    } finally {
      // Reset loading state
      setUpdateUserRoleLoad(false);
    }
  };

  return (
    <section className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto text-body bg-whiten dark:bg-boxdark-2 dark:text-bodydark relative top-2/4 -translate-y-1/2">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-fit sm:w-100">
        <header className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h2 className="font-bold text-black dark:text-white">Update User</h2>
        </header>

        {/* Set user as author */}
        <div className="p-6.5">
          <h3 className="font-semibold text-black dark:text-white mb-3">Update Role</h3>

          <button
            type="button"
            className="flex w-full justify-center items-center gap-4 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            disabled={updateUserRoleLoad}
            style={updateUserRoleLoad ? { opacity: 0.5, cursor: "revert" } : {}}
            onClick={setUserToAuthor}
          >
            <span>Set as Author</span>
            {updateUserRoleLoad && <MoonLoader color="#fff" size={15} />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpdateUser;
