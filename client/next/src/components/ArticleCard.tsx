"use client";

import { faBookmark, faEllipsisV, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

import { ApiBodyResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../api/client/useArticlesAPIs";
import { ClickOutside } from "../components";
import { useNotify } from "../hooks";
import { StoreState } from "../store/store";
import { formatCreatedSince } from "../utils/formateCreatedSince";
import { ROLES_LIST } from "../utils/rolesList";

interface ArticleCardProps {
  article_id: IArticle["article_id"];
  title?: IArticle["title"];
  image?: IArticle["image"];
  views?: IArticle["views"];
  created_at?: IArticle["created_at"];
  creator_id?: IArticle["creator_id"];
}

type DropdownCardControllersProps = Pick<ArticleCardProps, "article_id" | "creator_id">;

/**
 * A reusable card component to display an article with its image, title, views, and creation date.
 * Only the fields that are passed as props will appear in the UI.
 *
 * @param {ArticleCardProps} props - Props containing the article details.
 */
const ArticleCard = ({
  article_id,
  title,
  image,
  views,
  created_at,
  creator_id,
}: ArticleCardProps) => {
  return (
    <div className="w-full h-full rounded-lg">
      {/* Article image */}
      {image && (
        <Link href={`/articles/${article_id}`}>
          <Image
            src={image}
            alt="article image"
            loading="lazy"
            className="w-full object-cover user-select-none rounded-md aspect-[5/3]"
            width={500} // Adjust width according to your layout
            height={300} // Adjust height according to your layout
          />
        </Link>
      )}

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between gap-2">
          {/* Article title */}
          {title && (
            <Link
              href={`/articles/${article_id}`}
              className="text-lg font-bold text-main hover:underline"
            >
              {title}
            </Link>
          )}

          <DropdownCardControllers article_id={article_id} creator_id={creator_id} />
        </div>

        {/* Article details */}
        <div className="text-xs text-textSoft flex items-center justify-end gap-2" dir="ltr">
          {created_at && <span>{formatCreatedSince(created_at)}</span>}
          {views !== undefined && " . "}
          {views !== undefined && <span>{views} views</span>}
        </div>
      </div>
    </div>
  );
};

/**
 * A memoized React component that provides a dropdown menu with controls for managing articles.
 *
 * @param {DropdownCardControllersProps} props - The props for the component.
 * @returns {JSX.Element} The rendered dropdown card controllers component.
 */
const DropdownCardControllers = ({ article_id, creator_id }: DropdownCardControllersProps) => {
  const currentUser = useSelector((state: StoreState) => state.currentUser);
  const accessToken = useSelector((state: StoreState) => state.accessToken);

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [saveLoad, setSaveLoad] = useState<boolean>(false);
  const [unsaveLoad, setUnsaveLoad] = useState<boolean>(false);
  const [deleteArticleLoad, setDeleteArticleLoad] = useState<boolean>(false);

  const articlesAPIs = useArticlesAPIs();
  const notify = useNotify();

  /**
   * Save the article for the current user.
   * @param articleId - The ID of the article to save.
   */
  const saveArticle = async (articleId: IArticle["article_id"]) => {
    try {
      setSaveLoad(true);
      await articlesAPIs.saveArticle(articleId);
      notify("success", "تم حفظ المقال");
    } catch (err) {
      console.log(err);
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
      notify("success", "تم إلغاء حفظ المقال");
    } catch (err) {
      console.log(err);
    } finally {
      setUnsaveLoad(false);
    }
  };

  /**
   * Deletes an article by its ID.
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
    } catch (err) {
      if (!(err as AxiosError)?.response) {
        notify("error", "No Server Response");
      } else {
        const message = ((err as AxiosError).response?.data as ApiBodyResponse<any>)?.message;
        notify("error", message || "Delete article failed!");
      }
    } finally {
      setDeleteArticleLoad(false); // Reset loading state
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      {/* Button to toggle the dropdown */}
      <button
        type="button"
        className="flex items-center gap-6"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <FontAwesomeIcon icon={faEllipsisV} className="text-gray-500 cursor-pointer" />
      </button>

      {/* Dropdown menu, conditionally rendered when dropdownOpen is true */}
      {dropdownOpen && (
        <div
          className={`absolute left-0 z-1 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-zinc-800`}
        >
          <ul className="flex flex-col gap-4 border-b border-stroke p-4">
            {/* Logged users can save and unsave the article */}
            {accessToken && (
              <>
                {/* Save */}
                <li>
                  <button
                    type="button"
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primaryColor lg:text-base"
                    onClick={() => saveArticle(article_id)}
                  >
                    <FontAwesomeIcon icon={faBookmark} />
                    حفظ للقرآة لاحقا
                    {saveLoad && (
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
                    )}
                  </button>
                </li>

                {/* Unsave */}
                <li>
                  <button
                    type="button"
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primaryColor lg:text-base"
                    onClick={() => unsaveArticle(article_id)}
                  >
                    <FontAwesomeIcon icon={faBookmark} />
                    إلغاء الحفظ
                    {unsaveLoad && (
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
                    )}
                  </button>
                </li>
              </>
            )}

            {/* Article author owner can update the article */}
            {currentUser?.user_id === creator_id && (
              <>
                {/* Update */}
                <li>
                  <Link
                    href={`/articles/${article_id}/update`}
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primaryColor lg:text-base"
                  >
                    <FontAwesomeIcon icon={faPen} />
                    تعديل المقال
                  </Link>
                </li>
              </>
            )}

            {/* Admins and article author owner can delete articles */}
            {(currentUser?.role === ROLES_LIST.Admin || currentUser?.user_id === creator_id) && (
              <li>
                <button
                  type="button"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-danger lg:text-base"
                  onClick={() => deleteArticle(article_id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  حذف المقال
                  {deleteArticleLoad && (
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
                  )}
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </ClickOutside>
  );
};

export default ArticleCard;
