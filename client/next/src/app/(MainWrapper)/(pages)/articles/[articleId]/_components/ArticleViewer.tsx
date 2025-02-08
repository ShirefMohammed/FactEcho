"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";

import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../../../../../../api/client/useArticlesAPIs";
import defaultAvatar from "../../../../../../assets/defaultAvatar.png";
import { useHandleErrors, useNotify } from "../../../../../../hooks";
import { StoreState } from "../../../../../../store/store";
import { formatArticleDate } from "../../../../../../utils/formatArticleDate";
import { ROLES_LIST } from "../../../../../../utils/rolesList";

interface ArticleViewerProps {
  article: IArticle | null;
  fetchArticleLoad: boolean;
}

const ArticleViewer = ({ article, fetchArticleLoad }: ArticleViewerProps) => {
  const currentUser = useSelector((state: StoreState) => state.currentUser);
  const accessToken = useSelector((state: StoreState) => state.accessToken);

  const [saveLoad, setSaveLoad] = useState<boolean>(false);
  const [unsaveLoad, setUnsaveLoad] = useState<boolean>(false);
  const [isArticleSaved, setIsArticleSaved] = useState<boolean>(false);
  const [deleteArticleLoad, setDeleteArticleLoad] = useState<boolean>(false);

  const articlesAPIs = useArticlesAPIs();
  const handleErrors = useHandleErrors();
  const router = useRouter();
  const notify = useNotify();

  /**
   * Save the article for the current user.
   * @param articleId - The ID of the article to save.
   */
  const saveArticle = async (articleId: IArticle["article_id"]) => {
    try {
      setSaveLoad(true);
      await articlesAPIs.saveArticle(articleId);
      setIsArticleSaved(true); // Mark the article as saved
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setSaveLoad(false);
    }
  };

  /**
   * Unsave the article for the current user.
   * @param articleId - The ID of the article to unsave.
   */
  const unsaveArticle = async (articleId: IArticle["article_id"]) => {
    try {
      setUnsaveLoad(true);
      await articlesAPIs.unsaveArticle(articleId);
      setIsArticleSaved(false); // Mark the article as not saved
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setUnsaveLoad(false);
    }
  };

  /**
   * Check if the article is already saved by the current user.
   * @param articleId - The ID of the article to check.
   */
  const checkIsArticleSaved = async (articleId: IArticle["article_id"]) => {
    try {
      const resBody = await articlesAPIs.isArticleSaved(articleId);
      setIsArticleSaved(resBody.data?.isArticleSaved || false);
    } catch (err) {
      handleErrors(err as Error);
    }
  };

  /**
   * Deletes an article by its ID.
   *
   * This function performs the following steps:
   * 1. Prompts the user for confirmation to delete the article.
   * 2. Calls the delete article API to remove the article from the database.
   * 3. Displays a success or error notification based on the result.
   * 4. Redirects the user to the homepage after successful deletion.
   * 5. Resets the loading state after the process is complete.
   *
   * @param {string} articleId - The unique identifier of the article to be deleted.
   * @returns {Promise<void>} - A promise that resolves when the operation completes.
   */

  const deleteArticle = async (articleId: string) => {
    try {
      setDeleteArticleLoad(true);

      // Confirm deletion
      const confirmResult = confirm("Are you sure?");
      if (!confirmResult) return;

      // Call API to delete article
      await articlesAPIs.deleteArticle(articleId);

      notify("success", "Article deleted successfully");
      router.replace("/");
    } catch (err) {
      // Handle errors and notify the article
      if (!axios.isAxiosError(err) || !err.response) {
        notify("error", "No Server Response");
      } else {
        const message = err.response?.data?.message;
        notify("error", message || "Delete article failed!");
      }
    } finally {
      setDeleteArticleLoad(false); // Reset loading state
    }
  };

  // Runs when the access token or article ID changes to check if the article is saved
  useEffect(() => {
    if (accessToken && article?.article_id) {
      checkIsArticleSaved(article.article_id);
    }
  }, [accessToken, article?.article_id]);

  /**
   * Handle the save/unsave button click.
   * Toggles the save state for the article.
   */
  const handleSaveClick = () => {
    if (!article?.article_id || saveLoad || unsaveLoad) return; // Prevent actions during loading states
    if (isArticleSaved) {
      unsaveArticle(article.article_id);
    } else {
      saveArticle(article.article_id);
    }
  };

  // Show a loading skeleton while fetching the article
  if (fetchArticleLoad) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-lg">جارى التحميل...</div>;
  }

  // Return null if no article is available
  if (!article) {
    return null;
  }

  return (
    <article className="bg-white rounded-lg overflow-hidden" dir="rtl">
      {/* Article Title and Save Button */}
      <div className="flex justify-between items-start gap-4 mb-8">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <button
          className={`
            flex items-center gap-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap
            ${
              isArticleSaved
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }
            ${saveLoad || unsaveLoad ? "opacity-75 cursor-not-allowed" : ""}
          `}
          onClick={handleSaveClick}
          disabled={saveLoad || unsaveLoad}
        >
          {/* Show a spinner during save/unsave operations */}
          {saveLoad || unsaveLoad ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          )}
          {isArticleSaved ? "تم الحفظ" : "حفظ"}
        </button>
      </div>

      {/* Article Image */}
      {article.image && (
        <div className="relative mb-6 max-w-[700px]">
          <Image
            src={article.image}
            alt={article.title}
            className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-md"
            width={700}
            height={400}
          />
        </div>
      )}

      {/* Article Metadata */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-4">
        {/* Div For Styling */}
        <div className="w-1 h-8 bg-primaryColor"></div>

        {/* Article Created At */}
        <div className="flex items-center gap-2 text-mainGreyColor text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          <time dateTime={article.created_at} className="text-mainGreyColor text-xs">
            {formatArticleDate(article.created_at)}
          </time>
        </div>

        {/* Article Updated At */}
        {article.updated_at && (
          <div className="flex items-center gap-2 text-mainGreyColor text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            <span>آخر تحديث: {formatArticleDate(article.updated_at)}</span>
          </div>
        )}

        {/* Article Views */}
        <div className="flex items-center gap-2 text-mainGreyColor text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>{article.views} مشاهدة</span>
        </div>
      </div>

      {/* Author Link */}
      <Link
        href={`/authors/${article.creator_id}`}
        className="w-fit flex items-center gap-2 text-mainGreyColor hover:text-primaryColor mb-4"
        title="article author profile"
      >
        <div className="w-1 h-8 bg-primaryColor"></div> {/* Div For Styling */}
        <Image
          className="w-6 h-6 rounded-full"
          src={defaultAvatar}
          alt="author avatar"
          width={24}
          height={24}
        />
        كاتب المقال
      </Link>

      {/* Article Controllers */}
      {(currentUser.role === ROLES_LIST.Admin || currentUser.role === ROLES_LIST.Author) && (
        <div className="w-fit flex items-center gap-2 mb-8">
          {/* Div for styling */}
          <div className="w-1 h-8 bg-primaryColor"></div>

          {/* Update link */}
          {currentUser.user_id === article.creator_id && (
            <>
              <Link
                href={`/articles/${article.article_id}/update`}
                className="w-fit text-mainGreyColor hover:text-primaryColor"
              >
                تحديث
              </Link>
              .
            </>
          )}

          {/* Delete btn */}
          {(currentUser.role === ROLES_LIST.Admin ||
            currentUser.user_id === article.creator_id) && (
            <button
              type="button"
              className="flex items-center gap-2 w-fit text-mainGreyColor hover:text-danger"
              onClick={() => deleteArticle(article.article_id)}
              disabled={deleteArticleLoad}
              style={deleteArticleLoad ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              {deleteArticleLoad ? <PuffLoader color="#000" size={20} /> : <span>حذف</span>}
            </button>
          )}
        </div>
      )}

      {/* Article Content */}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
};

export default ArticleViewer;
