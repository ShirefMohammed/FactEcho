import { faEye, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";

import { ApiBodyResponse, GetUsersResponse, SearchUsersResponse } from "@shared/types/apiTypes";
import { IUser } from "@shared/types/entitiesTypes";

import { useUsersAPIs } from "../../api/hooks/useUsersAPIs";
import { AdminBreadcrumb, GlassWrapper } from "../../components";
import { useHandleErrors, useNotify, useQuery } from "../../hooks";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { ROLES_LIST } from "../../utils/rolesList";
import UpdateUser from "./components/UpdateUser";

const AdminUsers = () => {
  // Extract query parameters for default states
  const query = useQuery();

  // State for users data
  const [users, setUsers] = useState<IUser[]>([]); // Stores fetched or searched users
  const [usersLength, setUsersLength] = useState<number>(0); // Tracks the number of users for pagination

  // Toggle update user
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
  const [willUpdatedUser, setWillUpdatedUser] = useState<IUser | null>(null);

  // Query-related states
  const [limit, setLimit] = useState<number>(query.limit && +query.limit >= 1 ? +query.limit : 5); // Number of users per page
  const [usersPage, setUsersPage] = useState<number>(
    !query.searchKey && query.page && +query.page >= 1 ? +query.page : 1,
  ); // Current page for default user fetch
  const [searchUsersPage, setSearchUsersPage] = useState<number>(
    query.searchKey && query.page && +query.page >= 1 ? +query.page : 1,
  ); // Current page for searched users
  const [searchKey, setSearchKey] = useState<string>(query.searchKey || ""); // Search query

  // Loading states
  const [fetchUsersLoad, setFetchUsersLoad] = useState<boolean>(false); // Loading state for fetching users
  const [searchUsersLoad, setSearchUsersLoad] = useState<boolean>(false); // Loading state for searching users

  // Utility hooks
  const handleErrors = useHandleErrors();
  const navigate = useNavigate();
  const usersAPIs = useUsersAPIs();

  // Fetch users based on the current page and limit
  const fetchUsers = async () => {
    try {
      setFetchUsersLoad(true);
      const resBody: ApiBodyResponse<GetUsersResponse> = await usersAPIs.getUsers(usersPage, limit);
      setUsers(resBody.data!.users);
    } catch (err) {
      handleErrors(err);
    } finally {
      setFetchUsersLoad(false);
    }
  };

  // Search users based on the search key, page, and limit
  const searchUsers = async () => {
    try {
      setSearchUsersLoad(true);
      const resBody: ApiBodyResponse<SearchUsersResponse> = await usersAPIs.searchUsers(
        searchKey,
        searchUsersPage,
        limit,
      );
      setUsers(resBody.data!.users);
    } catch (err) {
      handleErrors(err);
    } finally {
      setSearchUsersLoad(false);
    }
  };

  // Synchronize query parameters with state on component mount
  useEffect(() => {
    setLimit(query.limit && +query.limit >= 1 ? +query.limit : 5);
    setUsersPage(!query.searchKey && query.page && +query.page >= 1 ? +query.page : 1);
    setSearchUsersPage(query.searchKey && query.page && +query.page >= 1 ? +query.page : 1);
    setSearchKey(query.searchKey || "");
  }, []);

  // Update usersLength when users state changes
  useEffect(() => {
    setUsersLength(users.length);
  }, [users]);

  // Fetch users when usersPage changes
  useEffect(() => {
    fetchUsers();
  }, [usersPage]);

  // Search users when searchUsersPage changes
  useEffect(() => {
    if (searchKey) searchUsers();
  }, [searchUsersPage]);

  // Fetch or search users when limit changes
  useEffect(() => {
    searchKey ? searchUsers() : fetchUsers();
  }, [limit]);

  // Fetch or search users when searchKey changes
  useEffect(() => {
    if (!searchKey) fetchUsers();
  }, [searchKey]);

  // Update the URL query parameters when pagination or search changes
  useEffect(() => {
    searchKey
      ? navigate(`/admin/users?searchKey=${searchKey}&page=${searchUsersPage}&limit=${limit}`)
      : navigate(`/admin/users?page=${usersPage}&limit=${limit}`);
  }, [usersPage, searchUsersPage, searchKey, limit]);

  return (
    <>
      {/* Breadcrumb for admin panel */}
      <AdminBreadcrumb pageName="Users" />

      {/* Search Form */}
      <header className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            searchKey ? searchUsers() : fetchUsers();
          }}
        >
          <button
            type="submit"
            title="search"
            className="absolute inset-y-0 ltr:inset-r-0 flex items-center justify-center text-white bg-blue-500 rounded-md w-8 h-8 top-[3px] end-1"
          >
            {/* Search Icon */}
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
          <input
            type="text"
            id="table-search-users"
            className="block p-2 pe-10 text-sm text-gray-900 border border-slate-300 rounded-lg w-80 bg-gray-50 outline-none"
            placeholder="Search for users"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </form>
      </header>

      {/* Users Table */}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left shadow-lg border border-slate-300 dark:border-slate-700">
          <thead>
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">user_id</th>
              <th className="px-6 py-3 whitespace-nowrap">name</th>
              <th className="px-6 py-3 whitespace-nowrap">email</th>
              <th className="px-6 py-3 whitespace-nowrap">is_verified</th>
              <th className="px-6 py-3 whitespace-nowrap">role</th>
              <th className="px-6 py-3 whitespace-nowrap">created_at</th>
              <th className="px-6 py-3 whitespace-nowrap">updated_at</th>
              <th className="px-6 py-3 whitespace-nowrap">provider</th>
              <th className="px-6 py-3 whitespace-nowrap">provider_user_id</th>
              <th className="px-6 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetchUsersLoad || searchUsersLoad ? (
              <tr>
                <td className="w-full p-4">loading ...</td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user: IUser) => (
                <UserRow
                  key={user.user_id}
                  user={user}
                  searchKey={searchKey}
                  fetchUsers={fetchUsers}
                  searchUsers={searchUsers}
                  setWillUpdatedUser={setWillUpdatedUser}
                  setOpenUpdateUser={setOpenUpdateUser}
                />
              ))
            ) : (
              <tr>
                <td className="w-full p-4 whitespace-nowrap">No results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        usersLength={usersLength}
        limit={limit}
        setLimit={setLimit}
        searchKey={searchKey}
        usersPage={usersPage}
        setUsersPage={setUsersPage}
        searchUsersPage={searchUsersPage}
        setSearchUsersPage={setSearchUsersPage}
      />

      {/* Update User */}
      {openUpdateUser && (
        <GlassWrapper setOpenGlassWrapper={setOpenUpdateUser}>
          <UpdateUser
            setUsers={setUsers}
            willUpdatedUser={willUpdatedUser!}
            setOpenUpdateUser={setOpenUpdateUser}
          />
        </GlassWrapper>
      )}
    </>
  );
};

const UserRow = ({
  user,
  searchKey,
  fetchUsers,
  searchUsers,
  setWillUpdatedUser,
  setOpenUpdateUser,
}: {
  user: IUser;
  searchKey: string;
  fetchUsers: () => void;
  searchUsers: () => void;
  setWillUpdatedUser: (willUpdatedUser: IUser) => void;
  setOpenUpdateUser: (openUpdateUser: boolean) => void;
}) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false); // State to manage delete button loading
  const notify = useNotify(); // Custom hook for notifications
  const usersAPIs = useUsersAPIs(); // API abstraction for user-related actions

  /**
   * Deletes a user by user ID.
   * Asks for confirmation, calls the delete API, and refreshes the user list or search results.
   */
  const deleteUser = async (userId: string) => {
    try {
      setDeleteLoading(true);

      // Confirm deletion
      const confirmResult = confirm("Are you sure?");
      if (!confirmResult) return;

      // Call API to delete user
      await usersAPIs.deleteUser(userId, { password: "" });

      // Refresh the user list or search results
      searchKey ? searchUsers() : fetchUsers();
      notify("success", "User deleted successfully");
    } catch (err) {
      // Handle errors and notify the user
      if (!err?.response) {
        notify("error", "No Server Response");
      } else {
        const message = err.response?.data?.message;
        notify("error", message || "Delete user failed!");
      }
    } finally {
      setDeleteLoading(false); // Reset loading state
    }
  };

  return (
    <tr className="border-b border-slate-300 dark:border-slate-700 text-sm text-body bg-white dark:bg-boxdark dark:text-bodydark font-normal">
      {/* User Details */}
      <td className="px-6 py-4 whitespace-nowrap">{user.user_id || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{user.name || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{user.email || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{user.is_verified ? "Yes" : "No"}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {user.role === ROLES_LIST.Admin
          ? "Admin"
          : user.role === ROLES_LIST.Author
            ? "Author"
            : "User"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(user.created_at) || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(user.updated_at) || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{user.provider || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{user.provider_user_id || "---"}</td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4">
        <Link
          to={`/users/${user.user_id}/profile`}
          title="View user profile"
          className="text-blue-600 dark:text-blue-500"
        >
          <FontAwesomeIcon icon={faEye} />
        </Link>

        <button
          type="button"
          title="update this user"
          className="text-blue-600 dark:text-blue-500 mr-4"
          onClick={() => {
            setWillUpdatedUser(user);
            setOpenUpdateUser(true);
          }}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>

        <button
          type="button"
          title="Delete this user"
          className="text-red-500"
          onClick={() => deleteUser(user.user_id)}
          disabled={deleteLoading}
          style={deleteLoading ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          {deleteLoading ? (
            <PuffLoader color="#000" size={20} />
          ) : (
            <FontAwesomeIcon icon={faTrashCan} />
          )}
        </button>
      </td>
    </tr>
  );
};

const Pagination = ({
  usersLength,
  limit,
  setLimit,
  searchKey,
  usersPage,
  setUsersPage,
  searchUsersPage,
  setSearchUsersPage,
}: {
  usersLength: number;
  limit: number;
  setLimit: (limit: number) => void;
  searchKey: string;
  usersPage: number;
  setUsersPage: (limit: number) => void;
  searchUsersPage: number;
  setSearchUsersPage: (limit: number) => void;
}) => {
  /**
   * Navigate to the next page.
   * Updates either the searchUsersPage or usersPage based on the presence of a searchKey.
   */
  const handleNext = () => {
    if (searchKey) {
      setSearchUsersPage(searchUsersPage + 1);
    } else {
      setUsersPage(usersPage + 1);
    }
  };

  /**
   * Navigate to the previous page.
   * Ensures the page number does not drop below 1.
   */
  const handlePrev = () => {
    if (searchKey && searchUsersPage > 1) {
      setSearchUsersPage(searchUsersPage - 1);
    } else if (!searchKey && usersPage > 1) {
      setUsersPage(usersPage - 1);
    }
  };

  /**
   * Update the number of users displayed per page.
   * This affects both general users and search results.
   */
  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(event.target.value));
  };

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        <button
          className="px-4 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={handlePrev}
          disabled={searchKey ? searchUsersPage === 1 : usersPage === 1}
          title="Go to the previous page"
        >
          Previous
        </button>
        <button
          className="px-4 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={handleNext}
          disabled={usersLength < limit}
          title="Go to the next page"
        >
          Next
        </button>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="limit" className="text-sm">
          Users per page:
        </label>
        <select
          id="limit"
          className="h-8 border rounded border-slate-300 dark:border-slate-700
            bg-gray-50 dark:bg-transparent focus:border-slate-500 dark:focus:border-slate-500 
            dark:placeholder-gray-400 dark:text-white outline-none"
          value={limit}
          onChange={handleLimitChange}
          title="Select the number of users to display per page"
        >
          {[5, 10, 20].map((value) => (
            <option key={value} className="text-black" value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AdminUsers;
