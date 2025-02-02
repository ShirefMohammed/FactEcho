"use client";

import axios from "axios";
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import { IAuthor } from "shared/types/entitiesTypes";

import { useAuthorsAPIs } from "../../../../../api/client/useAuthorsAPIs";
import { useUsersAPIs } from "../../../../../api/client/useUsersAPIs";
import { useNotify } from "../../../../../hooks";
import { ROLES_LIST } from "../../../../../utils/rolesList";

const UpdateAuthor = ({
  setAuthors,
  willUpdatedAuthor,
  setOpenUpdateAuthor,
}: {
  setAuthors: any;
  willUpdatedAuthor: IAuthor;
  setOpenUpdateAuthor: (openUpdateAuthor: boolean) => void;
}) => {
  const [author, setAuthor] = useState<IAuthor>(willUpdatedAuthor);

  // Loading state for updating the author role
  const [updateAuthorRoleLoad, setUpdateAuthorRoleLoad] = useState<boolean>(false);
  const [updateAuthorPermissionsLoad, setUpdateAuthorPermissionsLoad] = useState<boolean>(false);

  const notify = useNotify(); // Hook for displaying notifications
  const usersAPIs = useUsersAPIs(); // Hook for interacting with users API
  const authorsAPIs = useAuthorsAPIs(); // Hook for interacting with authors API

  /**
   * Update the author's permissions in the database and update the UI accordingly.
   */
  const updateAuthorPermissions = async () => {
    try {
      setUpdateAuthorPermissionsLoad(true);

      // Call API to update the author permissions
      await authorsAPIs.updateAuthorPermissions(author.user_id, {
        permissions: author.permissions,
      });

      // Update the author in the local state
      setAuthors((prev: IAuthor[]) =>
        prev.map((au: IAuthor) => (au.user_id === author.user_id ? author : au)),
      );

      // Notify the author about the successful update
      notify("success", "Permissions updated successfully.");

      // Close the modal after successful update
      setOpenUpdateAuthor(false);
    } catch (err) {
      // Handle potential errors during the API call
      if (!axios.isAxiosError(err) || !err?.response) {
        notify("error", "No Server Response");
      } else {
        const message = err.response?.data?.message;
        notify("error", message || "Failed to update author permissions!");
      }
    } finally {
      // Reset loading state
      setUpdateAuthorPermissionsLoad(false);
    }
  };

  /**
   * Update the author's role to "User" in the database and update the UI accordingly.
   */
  const setAuthorToUser = async () => {
    try {
      setUpdateAuthorRoleLoad(true);

      // Define the new role to set for the user
      const newRole = ROLES_LIST.User;

      // Call API to update the author role
      await usersAPIs.updateUserRole(author.user_id, { role: newRole });

      // Update the author in the local state
      setAuthors((prev: IAuthor[]) => prev.filter((au: IAuthor) => au.user_id !== author.user_id));

      // Notify the author about the successful update
      notify("success", "Author has been set as an user.");

      // Close the modal after successful update
      setOpenUpdateAuthor(false);
    } catch (err) {
      // Handle potential errors during the API call
      if (!axios.isAxiosError(err) || !err?.response) {
        notify("error", "No Server Response");
      } else {
        const message = err.response?.data?.message;
        notify("error", message || "Failed to update author role!");
      }
    } finally {
      // Reset loading state
      setUpdateAuthorRoleLoad(false);
    }
  };

  return (
    <section className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto text-body bg-whiten dark:bg-boxdark-2 dark:text-bodydark relative top-2/4 -translate-y-1/2">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-fit sm:w-100">
        {/* Main title */}
        <header className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h2 className="font-bold text-black dark:text-white">Update Author</h2>
        </header>

        {/* Update author permissions */}
        <div className="p-6.5">
          {/* Title */}
          <h3 className="font-semibold text-black dark:text-white mb-3">Update Permissions</h3>

          {/* Permissions checkboxes */}
          <div className="p-2">
            <label className="flex items-center justify-between mb-4">
              <span>Create</span>
              <div
                className={`relative m-0 block h-7.5 w-14 rounded-full ${
                  author.permissions.create ? "bg-primary" : "bg-stroke"
                }`}
              >
                <input
                  type="checkbox"
                  onClick={() => {
                    setAuthor((prev: IAuthor) => ({
                      ...prev,
                      permissions: { ...prev.permissions, create: !prev.permissions.create },
                    }));
                  }}
                  className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
                />
                <span
                  className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
                    author.permissions.create && "!right-[3px] !translate-x-full"
                  }`}
                >
                  <span className="dark:hidden"></span>
                  <span className="hidden dark:inline-block"></span>
                </span>
              </div>
            </label>

            <label className="flex items-center justify-between mb-4">
              <span>Update</span>
              <div
                className={`relative m-0 block h-7.5 w-14 rounded-full ${
                  author.permissions.update ? "bg-primary" : "bg-stroke"
                }`}
              >
                <input
                  type="checkbox"
                  onClick={() => {
                    setAuthor((prev: IAuthor) => ({
                      ...prev,
                      permissions: { ...prev.permissions, update: !prev.permissions.update },
                    }));
                  }}
                  className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
                />
                <span
                  className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
                    author.permissions.update && "!right-[3px] !translate-x-full"
                  }`}
                >
                  <span className="dark:hidden"></span>
                  <span className="hidden dark:inline-block"></span>
                </span>
              </div>
            </label>

            <label className="flex items-center justify-between mb-4">
              <span>Delete</span>
              <div
                className={`relative m-0 block h-7.5 w-14 rounded-full ${
                  author.permissions.delete ? "bg-primary" : "bg-stroke"
                }`}
              >
                <input
                  type="checkbox"
                  onClick={() => {
                    setAuthor((prev: IAuthor) => ({
                      ...prev,
                      permissions: { ...prev.permissions, delete: !prev.permissions.delete },
                    }));
                  }}
                  className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
                />
                <span
                  className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
                    author.permissions.delete && "!right-[3px] !translate-x-full"
                  }`}
                >
                  <span className="dark:hidden"></span>
                  <span className="hidden dark:inline-block"></span>
                </span>
              </div>
            </label>
          </div>

          {/* Save selected author permissions */}
          <button
            type="button"
            className="flex w-full justify-center items-center gap-4 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            disabled={updateAuthorPermissionsLoad}
            style={updateAuthorPermissionsLoad ? { opacity: 0.5, cursor: "revert" } : {}}
            onClick={updateAuthorPermissions}
          >
            <span>Save</span>
            {updateAuthorPermissionsLoad && <MoonLoader color="#fff" size={15} />}
          </button>
        </div>

        {/* Set author as user */}
        <div className="p-6.5">
          <h3 className="font-semibold text-black dark:text-white mb-3">Update Role</h3>

          <button
            type="button"
            className="flex w-full justify-center items-center gap-4 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            disabled={updateAuthorRoleLoad}
            style={updateAuthorRoleLoad ? { opacity: 0.5, cursor: "revert" } : {}}
            onClick={setAuthorToUser}
          >
            <span>Set as User</span>
            {updateAuthorRoleLoad && <MoonLoader color="#fff" size={15} />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpdateAuthor;
