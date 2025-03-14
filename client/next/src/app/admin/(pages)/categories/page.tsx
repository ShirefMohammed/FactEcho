"use client";

import { faEye, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";

import {
  ApiBodyResponse,
  GetCategoriesResponse,
  SearchCategoriesResponse,
} from "@shared/types/apiTypes";
import { ICategory } from "@shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../../../../api/client/useCategoriesAPIs";
import { AdminBreadcrumb, GlassWrapper } from "../../../../components";
import { useHandleErrors, useNotify, useQuery } from "../../../../hooks";
import { formatTimestamp } from "../../../../utils/formatDate";
import CreateCategory from "./_components/CreateCategory";
import UpdateCategory from "./_components/UpdateCategory";

const AdminCategories = () => {
  // Extract query parameters for default states
  const query = useQuery();

  // State for categories data
  const [categories, setCategories] = useState<ICategory[]>([]); // Stores fetched or searched categories
  const [categoriesLength, setCategoriesLength] = useState<number>(0); // Tracks the number of categories for pagination

  // Toggle create and update category
  const [openCreateCategory, setOpenCreateCategory] = useState<boolean>(false);
  const [openUpdateCategory, setOpenUpdateCategory] = useState<boolean>(false);
  const [willUpdatedCategory, setWillUpdatedCategory] = useState<ICategory | null>(null);

  // Query-related states
  const [limit, setLimit] = useState<number>(query.limit && +query.limit >= 1 ? +query.limit : 5); // Number of categories per page
  const [categoriesPage, setCategoriesPage] = useState<number>(
    !query.searchKey && query.page && +query.page >= 1 ? +query.page : 1,
  ); // Current page for default category fetch
  const [searchCategoriesPage, setSearchCategoriesPage] = useState<number>(
    query.searchKey && query.page && +query.page >= 1 ? +query.page : 1,
  ); // Current page for searched categories
  const [searchKey, setSearchKey] = useState<string>(query.searchKey || ""); // Search query

  // Loading states
  const [fetchCategoriesLoad, setFetchCategoriesLoad] = useState<boolean>(false); // Loading state for fetching categories
  const [searchCategoriesLoad, setSearchCategoriesLoad] = useState<boolean>(false); // Loading state for searching categories

  // Utility hooks
  const handleErrors = useHandleErrors();
  const categoriesAPIs = useCategoriesAPIs();
  const router = useRouter();

  // Fetch categories based on the current page and limit
  const fetchCategories = async () => {
    try {
      setFetchCategoriesLoad(true);
      const resBody: ApiBodyResponse<GetCategoriesResponse> = await categoriesAPIs.getCategories(
        categoriesPage,
        limit,
      );
      setCategories(resBody.data!.categories);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setFetchCategoriesLoad(false);
    }
  };

  // Search categories based on the search key, page, and limit
  const searchCategories = async () => {
    try {
      setSearchCategoriesLoad(true);
      const resBody: ApiBodyResponse<SearchCategoriesResponse> =
        await categoriesAPIs.searchCategories(searchKey, searchCategoriesPage, limit);
      setCategories(resBody.data!.categories);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setSearchCategoriesLoad(false);
    }
  };

  // Synchronize query parameters with state on component mount
  useEffect(() => {
    setLimit(query.limit && +query.limit >= 1 ? +query.limit : 5);
    setCategoriesPage(!query.searchKey && query.page && +query.page >= 1 ? +query.page : 1);
    setSearchCategoriesPage(query.searchKey && query.page && +query.page >= 1 ? +query.page : 1);
    setSearchKey(query.searchKey || "");
  }, []);

  // Update categoriesLength when categories state changes
  useEffect(() => {
    setCategoriesLength(categories.length);
  }, [categories]);

  // Fetch categories when categoriesPage changes
  useEffect(() => {
    fetchCategories();
  }, [categoriesPage]);

  // Search categories when searchCategoriesPage changes
  useEffect(() => {
    if (searchKey) searchCategories();
  }, [searchCategoriesPage]);

  // Fetch or search categories when limit changes
  useEffect(() => {
    searchKey ? searchCategories() : fetchCategories();
  }, [limit]);

  // Fetch or search categories when searchKey changes
  useEffect(() => {
    if (!searchKey) fetchCategories();
  }, [searchKey]);

  // Update the URL query parameters when pagination or search changes
  useEffect(() => {
    searchKey
      ? router.push(
          `/admin/categories?searchKey=${searchKey}&page=${searchCategoriesPage}&limit=${limit}`,
        )
      : router.push(`/admin/categories?page=${categoriesPage}&limit=${limit}`);
  }, [categoriesPage, searchCategoriesPage, searchKey, limit]);

  return (
    <>
      {/* Breadcrumb for admin panel */}
      <AdminBreadcrumb pageName="Categories" />

      {/* Search Form && Create Category Btn */}
      <header className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <label htmlFor="table-search-categories" className="sr-only">
          Search
        </label>

        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            searchKey ? searchCategories() : fetchCategories();
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
            id="table-search-categories"
            className="block p-2 pe-10 text-sm text-gray-900 border border-slate-300 rounded-lg w-80 bg-gray-50 outline-none"
            placeholder="Search for categories"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </form>

        <button
          type="button"
          className="inset-y-0 ltr:inset-r-0 px-4 py-1 flex items-center justify-center text-white bg-blue-500 rounded-md"
          onClick={() => setOpenCreateCategory(true)}
        >
          New
          <svg
            className="w-4 h-4 ml-1 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 5v10m5-5H5"
            />
          </svg>
        </button>
      </header>

      {/* Categories Table */}
      <div className="relative overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left shadow-lg border border-slate-300 dark:border-slate-700">
          <thead>
            <tr>
              {/* <th className="px-6 py-3 whitespace-nowrap">category_id</th> */}
              <th className="px-6 py-3 whitespace-nowrap">title</th>
              <th className="px-6 py-3 whitespace-nowrap">created_at</th>
              <th className="px-6 py-3 whitespace-nowrap">updated_at</th>
              <th className="px-6 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetchCategoriesLoad || searchCategoriesLoad ? (
              <tr>
                <td className="w-full p-4">loading ...</td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category: ICategory) => (
                <CategoryRow
                  key={category.category_id}
                  category={category}
                  searchKey={searchKey}
                  fetchCategories={fetchCategories}
                  searchCategories={searchCategories}
                  setWillUpdatedCategory={setWillUpdatedCategory}
                  setOpenUpdateCategory={setOpenUpdateCategory}
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
        categoriesLength={categoriesLength}
        limit={limit}
        setLimit={setLimit}
        searchKey={searchKey}
        categoriesPage={categoriesPage}
        setCategoriesPage={setCategoriesPage}
        searchCategoriesPage={searchCategoriesPage}
        setSearchCategoriesPage={setSearchCategoriesPage}
      />

      {/* Create Category */}
      {openCreateCategory && (
        <GlassWrapper setOpenGlassWrapper={setOpenCreateCategory}>
          <CreateCategory
            setCategories={setCategories}
            setOpenCreateCategory={setOpenCreateCategory}
          />
        </GlassWrapper>
      )}

      {/* Update Category */}
      {openUpdateCategory && (
        <GlassWrapper setOpenGlassWrapper={setOpenUpdateCategory}>
          <UpdateCategory
            setCategories={setCategories}
            willUpdatedCategory={willUpdatedCategory!}
            setOpenUpdateCategory={setOpenUpdateCategory}
          />
        </GlassWrapper>
      )}
    </>
  );
};

const CategoryRow = ({
  category,
  searchKey,
  fetchCategories,
  searchCategories,
  setWillUpdatedCategory,
  setOpenUpdateCategory,
}: {
  category: ICategory;
  searchKey: string;
  fetchCategories: () => void;
  searchCategories: () => void;
  setWillUpdatedCategory: (willUpdatedCategory: ICategory) => void;
  setOpenUpdateCategory: (openUpdateCategory: boolean) => void;
}) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false); // State to manage delete button loading
  const notify = useNotify(); // Custom hook for notifications
  const categoriesAPIs = useCategoriesAPIs(); // API abstraction for category-related actions

  /**
   * Deletes a category by category ID.
   * Asks for confirmation, calls the delete API, and refreshes the category list or search results.
   */
  const deleteCategory = async (categoryId: string) => {
    try {
      setDeleteLoading(true);

      // Confirm deletion
      const confirmResult = confirm("Are you sure?");
      if (!confirmResult) return;

      // Call API to delete category
      await categoriesAPIs.deleteCategory(categoryId);

      // Refresh the category list or search results
      searchKey ? searchCategories() : fetchCategories();
      notify("success", "Category deleted successfully");
    } catch (err) {
      // Handle errors and notify the category
      if (!axios.isAxiosError(err) || !err?.response) {
        notify("error", "No Server Response");
      } else {
        const message = err.response?.data?.message;
        notify("error", message || "Delete category failed!");
      }
    } finally {
      setDeleteLoading(false); // Reset loading state
    }
  };

  return (
    <tr className="border-b border-slate-300 dark:border-slate-700 text-sm text-body bg-white dark:bg-boxdark dark:text-bodydark font-normal">
      {/* Category Details */}
      {/* <td className="px-6 py-4 whitespace-nowrap">{category.category_id || "---"}</td> */}
      <td className="px-6 py-4 whitespace-nowrap">
        {(category.title.length <= 40 ? category.title : category.title.substr(0, 50) + "...") ||
          "---"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {formatTimestamp(category.created_at) || "---"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {formatTimestamp(category.updated_at) || "---"}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4">
        <Link
          href={`/categories/${category.category_id}/articles`}
          title="View category articles"
          className="text-blue-600 dark:text-blue-500"
        >
          <FontAwesomeIcon icon={faEye} />
        </Link>

        <button
          type="button"
          title="update this category"
          className="text-blue-600 dark:text-blue-500 mr-4"
          onClick={() => {
            setWillUpdatedCategory(category);
            setOpenUpdateCategory(true);
          }}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>

        <button
          type="button"
          title="Delete this category"
          className="text-red-500"
          onClick={() => deleteCategory(category.category_id)}
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
  categoriesLength,
  limit,
  setLimit,
  searchKey,
  categoriesPage,
  setCategoriesPage,
  searchCategoriesPage,
  setSearchCategoriesPage,
}: {
  categoriesLength: number;
  limit: number;
  setLimit: (limit: number) => void;
  searchKey: string;
  categoriesPage: number;
  setCategoriesPage: (limit: number) => void;
  searchCategoriesPage: number;
  setSearchCategoriesPage: (limit: number) => void;
}) => {
  /**
   * redirect to the next page.
   * Updates either the searchCategoriesPage or categoriesPage based on the presence of a searchKey.
   */
  const handleNext = () => {
    if (searchKey) {
      setSearchCategoriesPage(searchCategoriesPage + 1);
    } else {
      setCategoriesPage(categoriesPage + 1);
    }
  };

  /**
   * redirect to the previous page.
   * Ensures the page number does not drop below 1.
   */
  const handlePrev = () => {
    if (searchKey && searchCategoriesPage > 1) {
      setSearchCategoriesPage(searchCategoriesPage - 1);
    } else if (!searchKey && categoriesPage > 1) {
      setCategoriesPage(categoriesPage - 1);
    }
  };

  /**
   * Update the number of categories displayed per page.
   * This affects both general categories and search results.
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
          disabled={searchKey ? searchCategoriesPage === 1 : categoriesPage === 1}
          title="Go to the previous page"
        >
          Previous
        </button>
        <button
          className="px-4 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={handleNext}
          disabled={categoriesLength < limit}
          title="Go to the next page"
        >
          Next
        </button>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="limit" className="text-sm">
          Categories per page:
        </label>
        <select
          id="limit"
          className="h-8 border rounded border-slate-300 dark:border-slate-700
            bg-gray-50 dark:bg-transparent focus:border-slate-500 dark:focus:border-slate-500 
            dark:placeholder-gray-400 dark:text-white outline-none"
          value={limit}
          onChange={handleLimitChange}
          title="Select the number of categories to display per page"
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

export default AdminCategories;
