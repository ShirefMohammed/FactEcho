import { faEye, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";

import { ApiBodyResponse, GetAuthorsResponse, SearchAuthorsResponse } from "@shared/types/apiTypes";
import { IAuthor } from "@shared/types/entitiesTypes";

import { useAuthorsAPIs } from "../../api/hooks/useAuthorsAPIs";
import { useUsersAPIs } from "../../api/hooks/useUsersAPIs";
import defaultAvatar from "../../assets/defaultAvatar.png";
import { AdminBreadcrumb, GlassWrapper } from "../../components";
import { useHandleErrors, useNotify, useQuery } from "../../hooks";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { ROLES_LIST } from "../../utils/rolesList";
import UpdateAuthor from "./components/UpdateAuthor";

const AdminAuthors = () => {
  // Extract query parameters for default states
  const query = useQuery();

  // State for authors data
  const [authors, setAuthors] = useState<IAuthor[]>([]); // Stores fetched or searched authors
  const [authorsLength, setAuthorsLength] = useState<number>(0); // Tracks the number of authors for pagination

  // Toggle update author
  const [openUpdateAuthor, setOpenUpdateAuthor] = useState<boolean>(false);
  const [willUpdatedAuthor, setWillUpdatedAuthor] = useState<IAuthor | null>(null);

  // Query-related states
  const [limit, setLimit] = useState<number>(query.limit && +query.limit >= 1 ? +query.limit : 5); // Number of authors per page
  const [authorsPage, setAuthorsPage] = useState<number>(
    !query.searchKey && query.page && +query.page >= 1 ? +query.page : 1,
  ); // Current page for default author fetch
  const [searchAuthorsPage, setSearchAuthorsPage] = useState<number>(
    query.searchKey && query.page && +query.page >= 1 ? +query.page : 1,
  ); // Current page for searched authors
  const [searchKey, setSearchKey] = useState<string>(query.searchKey || ""); // Search query

  // Loading states
  const [fetchAuthorsLoad, setFetchAuthorsLoad] = useState<boolean>(false); // Loading state for fetching authors
  const [searchAuthorsLoad, setSearchAuthorsLoad] = useState<boolean>(false); // Loading state for searching authors

  // Utility hooks
  const handleErrors = useHandleErrors();
  const navigate = useNavigate();
  const authorsAPIs = useAuthorsAPIs();

  // Fetch authors based on the current page and limit
  const fetchAuthors = async () => {
    try {
      setFetchAuthorsLoad(true);
      const resBody: ApiBodyResponse<GetAuthorsResponse> = await authorsAPIs.getAuthors(
        authorsPage,
        limit,
      );
      setAuthors(resBody.data!.authors);
    } catch (err) {
      handleErrors(err);
    } finally {
      setFetchAuthorsLoad(false);
    }
  };

  // Search authors based on the search key, page, and limit
  const searchAuthors = async () => {
    try {
      setSearchAuthorsLoad(true);
      const resBody: ApiBodyResponse<SearchAuthorsResponse> = await authorsAPIs.searchAuthors(
        searchKey,
        searchAuthorsPage,
        limit,
      );
      setAuthors(resBody.data!.authors);
    } catch (err) {
      handleErrors(err);
    } finally {
      setSearchAuthorsLoad(false);
    }
  };

  // Synchronize query parameters with state on component mount
  useEffect(() => {
    setLimit(query.limit && +query.limit >= 1 ? +query.limit : 5);
    setAuthorsPage(!query.searchKey && query.page && +query.page >= 1 ? +query.page : 1);
    setSearchAuthorsPage(query.searchKey && query.page && +query.page >= 1 ? +query.page : 1);
    setSearchKey(query.searchKey || "");
  }, []);

  // Update authorsLength when authors state changes
  useEffect(() => {
    setAuthorsLength(authors.length);
  }, [authors]);

  // Fetch authors when authorsPage changes
  useEffect(() => {
    fetchAuthors();
  }, [authorsPage]);

  // Search authors when searchAuthorsPage changes
  useEffect(() => {
    if (searchKey) searchAuthors();
  }, [searchAuthorsPage]);

  // Fetch or search authors when limit changes
  useEffect(() => {
    searchKey ? searchAuthors() : fetchAuthors();
  }, [limit]);

  // Fetch or search authors when searchKey changes
  useEffect(() => {
    if (!searchKey) fetchAuthors();
  }, [searchKey]);

  // Update the URL query parameters when pagination or search changes
  useEffect(() => {
    searchKey
      ? navigate(`/admin/authors?searchKey=${searchKey}&page=${searchAuthorsPage}&limit=${limit}`)
      : navigate(`/admin/authors?page=${authorsPage}&limit=${limit}`);
  }, [authorsPage, searchAuthorsPage, searchKey, limit]);

  return (
    <>
      {/* Breadcrumb for admin panel */}
      <AdminBreadcrumb pageName="Authors" />

      {/* Search Form */}
      <header className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            searchKey ? searchAuthors() : fetchAuthors();
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
            id="table-search-authors"
            className="block p-2 pe-10 text-sm text-gray-900 border border-slate-300 rounded-lg w-80 bg-gray-50 outline-none"
            placeholder="Search for authors"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </form>
      </header>

      {/* Authors Table */}
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
              <th className="px-6 py-3 whitespace-nowrap">provider_author_id</th>
              <th className="px-6 py-3 whitespace-nowrap">avatar</th>
              <th className="px-6 py-3 whitespace-nowrap">permissions</th>
              <th className="px-6 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetchAuthorsLoad || searchAuthorsLoad ? (
              <tr>
                <td className="w-full p-4">loading ...</td>
              </tr>
            ) : authors.length > 0 ? (
              authors.map((author: IAuthor) => (
                <AuthorRow
                  key={author.user_id}
                  author={author}
                  searchKey={searchKey}
                  fetchAuthors={fetchAuthors}
                  searchAuthors={searchAuthors}
                  setWillUpdatedAuthor={setWillUpdatedAuthor}
                  setOpenUpdateAuthor={setOpenUpdateAuthor}
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
        authorsLength={authorsLength}
        limit={limit}
        setLimit={setLimit}
        searchKey={searchKey}
        authorsPage={authorsPage}
        setAuthorsPage={setAuthorsPage}
        searchAuthorsPage={searchAuthorsPage}
        setSearchAuthorsPage={setSearchAuthorsPage}
      />

      {/* Update Author */}
      {openUpdateAuthor && (
        <GlassWrapper setOpenGlassWrapper={setOpenUpdateAuthor}>
          <UpdateAuthor
            setAuthors={setAuthors}
            willUpdatedAuthor={willUpdatedAuthor!}
            setOpenUpdateAuthor={setOpenUpdateAuthor}
          />
        </GlassWrapper>
      )}
    </>
  );
};

const AuthorRow = ({
  author,
  searchKey,
  fetchAuthors,
  searchAuthors,
  setWillUpdatedAuthor,
  setOpenUpdateAuthor,
}: {
  author: IAuthor;
  searchKey: string;
  fetchAuthors: () => void;
  searchAuthors: () => void;
  setWillUpdatedAuthor: (willUpdatedAuthor: IAuthor) => void;
  setOpenUpdateAuthor: (openUpdateAuthor: boolean) => void;
}) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false); // State to manage delete button loading
  const notify = useNotify(); // Custom hook for notifications
  const usersAPIs = useUsersAPIs(); // API abstraction for author-related actions

  /**
   * Deletes a author by author ID.
   * Asks for confirmation, calls the delete API, and refreshes the author list or search results.
   */
  const deleteAuthor = async (authorId: string) => {
    try {
      setDeleteLoading(true);

      // Confirm deletion
      const confirmResult = confirm(
        "Are you sure? You will delete the author and his account. If you need to set author to be normal user you can click on edit btn.",
      );
      if (!confirmResult) return;

      // Call API to delete author
      await usersAPIs.deleteUser(authorId, { password: "" });

      // Refresh the author list or search results
      searchKey ? searchAuthors() : fetchAuthors();
      notify("success", "Author deleted successfully");
    } catch (err) {
      // Handle errors and notify the author
      if (!err?.response) {
        notify("error", "No Server Response");
      } else {
        const message = err.response?.data?.message;
        notify("error", message || "Delete author failed!");
      }
    } finally {
      setDeleteLoading(false); // Reset loading state
    }
  };

  return (
    <tr className="border-b border-slate-300 dark:border-slate-700 text-sm text-body bg-white dark:bg-boxdark dark:text-bodydark font-normal">
      {/* Author Details */}
      <td className="px-6 py-4 whitespace-nowrap">{author.user_id || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{author.name || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{author.email || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{author.is_verified ? "Yes" : "No"}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {author.role === ROLES_LIST.Admin
          ? "Admin"
          : author.role === ROLES_LIST.Author
            ? "Author"
            : "Author"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(author.created_at) || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(author.updated_at) || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{author.provider || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{author.provider_user_id || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <img
          className="w-6 h-6 rounded-full"
          src={author.avatar || defaultAvatar}
          alt="author avatar"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {[
          author.permissions.create && "create",
          author.permissions.update && "update",
          author.permissions.delete && "delete",
        ]
          .filter((val) => val)
          .join(", ")}
        {!author.permissions.create &&
          !author.permissions.update &&
          !author.permissions.delete &&
          "---"}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4">
        <Link
          to={`/authors/${author.user_id}`}
          title="View author profile"
          className="text-blue-600 dark:text-blue-500"
        >
          <FontAwesomeIcon icon={faEye} />
        </Link>

        <button
          type="button"
          title="update this author"
          className="text-blue-600 dark:text-blue-500 mr-4"
          onClick={() => {
            setWillUpdatedAuthor(author);
            setOpenUpdateAuthor(true);
          }}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>

        <button
          type="button"
          title="Delete this author"
          className="text-red-500"
          onClick={() => deleteAuthor(author.user_id)}
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
  authorsLength,
  limit,
  setLimit,
  searchKey,
  authorsPage,
  setAuthorsPage,
  searchAuthorsPage,
  setSearchAuthorsPage,
}: {
  authorsLength: number;
  limit: number;
  setLimit: (limit: number) => void;
  searchKey: string;
  authorsPage: number;
  setAuthorsPage: (limit: number) => void;
  searchAuthorsPage: number;
  setSearchAuthorsPage: (limit: number) => void;
}) => {
  /**
   * Navigate to the next page.
   * Updates either the searchAuthorsPage or authorsPage based on the presence of a searchKey.
   */
  const handleNext = () => {
    if (searchKey) {
      setSearchAuthorsPage(searchAuthorsPage + 1);
    } else {
      setAuthorsPage(authorsPage + 1);
    }
  };

  /**
   * Navigate to the previous page.
   * Ensures the page number does not drop below 1.
   */
  const handlePrev = () => {
    if (searchKey && searchAuthorsPage > 1) {
      setSearchAuthorsPage(searchAuthorsPage - 1);
    } else if (!searchKey && authorsPage > 1) {
      setAuthorsPage(authorsPage - 1);
    }
  };

  /**
   * Update the number of authors displayed per page.
   * This affects both general authors and search results.
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
          disabled={searchKey ? searchAuthorsPage === 1 : authorsPage === 1}
          title="Go to the previous page"
        >
          Previous
        </button>
        <button
          className="px-4 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={handleNext}
          disabled={authorsLength < limit}
          title="Go to the next page"
        >
          Next
        </button>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="limit" className="text-sm">
          Authors per page:
        </label>
        <select
          id="limit"
          className="h-8 border rounded border-slate-300 dark:border-slate-700
            bg-gray-50 dark:bg-transparent focus:border-slate-500 dark:focus:border-slate-500 
            dark:placeholder-gray-400 dark:text-white outline-none"
          value={limit}
          onChange={handleLimitChange}
          title="Select the number of authors to display per page"
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

export default AdminAuthors;
