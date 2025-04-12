"use client";

import { articlesAPIs } from "@/axios/apis/articlesAPIs";
import { AdminBreadcrumb } from "@/components";
import { useHandleErrors, useNotify, useQuery } from "@/hooks";
import { ApiBodyResponse, GetArticlesResponse, SearchArticlesResponse } from "@/types/apiTypes";
import { IArticle } from "@/types/entitiesTypes";
import { formatTimestamp } from "@/utils/formatDate";
import { faEye, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";

const AdminArticles = () => {
  // Extract query parameters for default states
  const query = useQuery();

  // State for articles data
  const [articles, setArticles] = useState<IArticle[]>([]); // Stores fetched or searched articles
  const [articlesLength, setArticlesLength] = useState<number>(0); // Tracks the number of articles for pagination

  // Query-related states
  const [limit, setLimit] = useState<number>(query.limit && +query.limit >= 1 ? +query.limit : 5); // Number of articles per page
  const [articlesPage, setArticlesPage] = useState<number>(
    !query.searchKey && query.page && +query.page >= 1 ? +query.page : 1,
  ); // Current page for default article fetch
  const [searchArticlesPage, setSearchArticlesPage] = useState<number>(
    query.searchKey && query.page && +query.page >= 1 ? +query.page : 1,
  ); // Current page for searched articles
  const [searchKey, setSearchKey] = useState<string>(query.searchKey || ""); // Search query

  // Loading states
  const [fetchArticlesLoad, setFetchArticlesLoad] = useState<boolean>(false); // Loading state for fetching articles
  const [searchArticlesLoad, setSearchArticlesLoad] = useState<boolean>(false); // Loading state for searching articles

  // Utility hooks
  const handleErrors = useHandleErrors();
  const router = useRouter();

  // Fetch articles based on the current page and limit
  const fetchArticles = async () => {
    try {
      setFetchArticlesLoad(true);
      const resBody: ApiBodyResponse<GetArticlesResponse> = await articlesAPIs.getArticles(
        articlesPage,
        limit,
      );
      setArticles(resBody.data!.articles);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setFetchArticlesLoad(false);
    }
  };

  // Search articles based on the search key, page, and limit
  const searchArticles = async () => {
    try {
      setSearchArticlesLoad(true);
      const resBody: ApiBodyResponse<SearchArticlesResponse> = await articlesAPIs.searchArticles(
        searchKey,
        searchArticlesPage,
        limit,
      );
      setArticles(resBody.data!.articles);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setSearchArticlesLoad(false);
    }
  };

  // Synchronize query parameters with state on component mount
  useEffect(() => {
    setLimit(query.limit && +query.limit >= 1 ? +query.limit : 5);
    setArticlesPage(!query.searchKey && query.page && +query.page >= 1 ? +query.page : 1);
    setSearchArticlesPage(query.searchKey && query.page && +query.page >= 1 ? +query.page : 1);
    setSearchKey(query.searchKey || "");
  }, []);

  // Update articlesLength when articles state changes
  useEffect(() => {
    setArticlesLength(articles.length);
  }, [articles]);

  // Fetch articles when articlesPage changes
  useEffect(() => {
    fetchArticles();
  }, [articlesPage]);

  // Search articles when searchArticlesPage changes
  useEffect(() => {
    if (searchKey) searchArticles();
  }, [searchArticlesPage]);

  // Fetch or search articles when limit changes
  useEffect(() => {
    searchKey ? searchArticles() : fetchArticles();
  }, [limit]);

  // Fetch or search articles when searchKey changes
  useEffect(() => {
    if (!searchKey) fetchArticles();
  }, [searchKey]);

  // Update the URL query parameters when pagination or search changes
  useEffect(() => {
    searchKey
      ? router.push(
          `/admin/articles?searchKey=${searchKey}&page=${searchArticlesPage}&limit=${limit}`,
        )
      : router.push(`/admin/articles?page=${articlesPage}&limit=${limit}`);
  }, [articlesPage, searchArticlesPage, searchKey, limit]);

  return (
    <>
      {/* Breadcrumb for admin panel */}
      <AdminBreadcrumb pageName="Articles" />

      {/* Search Form && Create Article Btn */}
      <header className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <label htmlFor="table-search-articles" className="sr-only">
          Search
        </label>

        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            searchKey ? searchArticles() : fetchArticles();
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
            id="table-search-articles"
            className="block p-2 pe-10 text-sm text-gray-900 border border-slate-300 rounded-lg w-80 bg-gray-50 outline-none"
            placeholder="Search for articles"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </form>

        <Link
          href={"/articles/create"}
          className="inset-y-0 ltr:inset-r-0 px-4 py-1 flex items-center justify-center text-white bg-blue-500 rounded-md"
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
        </Link>
      </header>

      {/* Articles Table */}
      <div className="relative overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left shadow-lg border border-slate-300 dark:border-slate-700">
          <thead>
            <tr>
              {/* <th className="px-6 py-3 whitespace-nowrap">article_id</th> */}
              <th className="px-6 py-3 whitespace-nowrap">title</th>
              <th className="px-6 py-3 whitespace-nowrap">image</th>
              <th className="px-6 py-3 whitespace-nowrap">views</th>
              <th className="px-6 py-3 whitespace-nowrap">created_at</th>
              <th className="px-6 py-3 whitespace-nowrap">updated_at</th>
              <th className="px-6 py-3 whitespace-nowrap">category_id</th>
              <th className="px-6 py-3 whitespace-nowrap">creator_id</th>
              <th className="px-6 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetchArticlesLoad || searchArticlesLoad ? (
              <tr>
                <td className="w-full p-4">loading ...</td>
              </tr>
            ) : articles.length > 0 ? (
              articles.map((article: IArticle) => (
                <ArticleRow
                  key={article.article_id}
                  article={article}
                  searchKey={searchKey}
                  fetchArticles={fetchArticles}
                  searchArticles={searchArticles}
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
        articlesLength={articlesLength}
        limit={limit}
        setLimit={setLimit}
        searchKey={searchKey}
        articlesPage={articlesPage}
        setArticlesPage={setArticlesPage}
        searchArticlesPage={searchArticlesPage}
        setSearchArticlesPage={setSearchArticlesPage}
      />
    </>
  );
};

const ArticleRow = ({
  article,
  searchKey,
  fetchArticles,
  searchArticles,
}: {
  article: IArticle;
  searchKey: string;
  fetchArticles: () => void;
  searchArticles: () => void;
}) => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false); // State to manage delete button loading
  const notify = useNotify(); // Custom hook for notifications

  /**
   * Deletes a article by article ID.
   * Asks for confirmation, calls the delete API, and refreshes the article list or search results.
   */
  const deleteArticle = async (articleId: string) => {
    try {
      setDeleteLoading(true);

      // Confirm deletion
      const confirmResult = confirm("Are you sure?");
      if (!confirmResult) return;

      // Call API to delete article
      await articlesAPIs.deleteArticle(articleId);

      // Refresh the article list or search results
      searchKey ? searchArticles() : fetchArticles();
      notify("success", "Article deleted successfully");
    } catch (err) {
      // Handle errors and notify the article
      if (!axios.isAxiosError(err) || !err?.response) {
        notify("error", "No Server Response");
      } else {
        const message = err.response?.data?.message;
        notify("error", message || "Delete article failed!");
      }
    } finally {
      setDeleteLoading(false); // Reset loading state
    }
  };

  return (
    <tr className="border-b border-slate-300 dark:border-slate-700 text-sm text-body bg-white dark:bg-boxdark dark:text-bodydark font-normal">
      {/* Article Details */}
      {/* <td className="px-6 py-4 whitespace-nowrap">{article.article_id || "---"}</td> */}
      <td className="px-6 py-4 whitespace-nowrap">
        {(article.title.length <= 40 ? article.title : "..." + article.title.substr(0, 50)) ||
          "---"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {article.image ? (
          <Image
            className="w-6 h-6 rounded-sm"
            src={article.image}
            alt="article image"
            width={24}
            height={24}
          />
        ) : (
          "---"
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{article.views}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {formatTimestamp(article.created_at) || "---"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {formatTimestamp(article.updated_at) || "---"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{article.category_id || "---"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{article.creator_id || "---"}</td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4">
        <Link
          href={`/articles/${article.article_id}`}
          title="View article"
          className="text-blue-600 dark:text-blue-500"
        >
          <FontAwesomeIcon icon={faEye} />
        </Link>

        <Link
          href={`/articles/${article.article_id}/update`}
          title="update this article"
          className="text-blue-600 dark:text-blue-500 mr-4"
        >
          <FontAwesomeIcon icon={faPen} />
        </Link>

        <button
          type="button"
          title="Delete this article"
          className="text-red-500"
          onClick={() => deleteArticle(article.article_id)}
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
  articlesLength,
  limit,
  setLimit,
  searchKey,
  articlesPage,
  setArticlesPage,
  searchArticlesPage,
  setSearchArticlesPage,
}: {
  articlesLength: number;
  limit: number;
  setLimit: (limit: number) => void;
  searchKey: string;
  articlesPage: number;
  setArticlesPage: (limit: number) => void;
  searchArticlesPage: number;
  setSearchArticlesPage: (limit: number) => void;
}) => {
  /**
   * redirect to the next page.
   * Updates either the searchArticlesPage or articlesPage based on the presence of a searchKey.
   */
  const handleNext = () => {
    if (searchKey) {
      setSearchArticlesPage(searchArticlesPage + 1);
    } else {
      setArticlesPage(articlesPage + 1);
    }
  };

  /**
   * redirect to the previous page.
   * Ensures the page number does not drop below 1.
   */
  const handlePrev = () => {
    if (searchKey && searchArticlesPage > 1) {
      setSearchArticlesPage(searchArticlesPage - 1);
    } else if (!searchKey && articlesPage > 1) {
      setArticlesPage(articlesPage - 1);
    }
  };

  /**
   * Update the number of articles displayed per page.
   * This affects both general articles and search results.
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
          disabled={searchKey ? searchArticlesPage === 1 : articlesPage === 1}
          title="Go to the previous page"
        >
          Previous
        </button>
        <button
          className="px-4 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={handleNext}
          disabled={articlesLength < limit}
          title="Go to the next page"
        >
          Next
        </button>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="limit" className="text-sm">
          Articles per page:
        </label>
        <select
          id="limit"
          className="h-8 border rounded border-slate-300 dark:border-slate-700
            bg-gray-50 dark:bg-transparent focus:border-slate-500 dark:focus:border-slate-500 
            dark:placeholder-gray-400 dark:text-white outline-none"
          value={limit}
          onChange={handleLimitChange}
          title="Select the number of articles to display per page"
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

export default AdminArticles;
