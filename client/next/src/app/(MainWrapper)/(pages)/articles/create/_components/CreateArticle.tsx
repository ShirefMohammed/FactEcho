"use client";

import { useEffect, useRef, useState } from "react";
import { MoonLoader } from "react-spinners";

import { CreateArticleRequest } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../../../../../../api/client/useArticlesAPIs";
import { CategoriesSelectBox } from "../../../../../../components";
import { Editor } from "../../../../../../components";
import { useNotify } from "../../../../../../hooks";
import { uploadFileToCloudinary } from "../../../../../../services/uploadFileToCloudinary";

const CreateArticle = () => {
  // Refs for title input
  const titleRef = useRef<HTMLInputElement | null>(null);

  const [articleTitle, setArticleTitle] = useState<IArticle["title"]>("");
  const [articleImage, setArticleImage] = useState<Blob | null>(null);
  const [articleCategoryId, setArticleCategoryId] = useState<IArticle["category_id"]>("");
  const [articleContent, setArticleContent] = useState<IArticle["content"]>("");

  // State to track loading during API call
  const [createArticleLoad, setCreateArticleLoad] = useState<boolean>(false);

  const notify = useNotify(); // Notification function
  const articlesAPIs = useArticlesAPIs(); // API functions for articles

  /** Focus the title input on component mount */
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  /**
   * Handles creating a new article.
   * Displays notifications on success or failure.
   */
  const createArticle = async (): Promise<void> => {
    try {
      setCreateArticleLoad(true);

      // Validate required fields
      if (!articleTitle || !articleImage || !articleCategoryId || !articleContent) {
        notify("info", "All fields are required");
        return;
      }

      // Upload the image to Cloudinary and get the URL
      let articleImageUrl: string;
      try {
        articleImageUrl = await uploadFileToCloudinary(articleImage);
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        notify("error", "Failed to upload article image!");
        return;
      }

      // Construct the payload for the API request
      const newArticle: CreateArticleRequest = {
        title: articleTitle,
        image: articleImageUrl,
        category_id: articleCategoryId,
        content: articleContent,
      };

      // Call the API to create a new article
      const resBody = await articlesAPIs.createArticle(newArticle);

      // Notify the user of success
      notify("success", resBody.message);

      // Clear form fields or reset states if needed (optional)
      resetForm();
    } catch (err: any) {
      // Handle errors with appropriate user feedback
      const message =
        err?.response?.data?.message ||
        (err?.response ? "Create article failed!" : "No Server Response");
      notify("error", message);
    } finally {
      setCreateArticleLoad(false); // Hide loading indicator
    }
  };

  /**
   * Resets the form fields to their initial state.
   */
  const resetForm = (): void => {
    setArticleTitle("");
    setArticleImage(null);
    setArticleCategoryId("");
    setArticleContent("");
  };

  return (
    <section>
      {/* Modal Header */}
      <header className="border-b border-stroke py-4 px-6.5">
        <h2 className="font-bold text-black text-2xl text-center">إنشاء مقال</h2>
      </header>

      {/* Form */}
      <form
        className="flex flex-col gap-5.5 p-6.5"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page reload
          createArticle(); // Trigger create article logic
        }}
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-3 block text-black font-bold">
            العنوان
          </label>
          <input
            type="text"
            ref={titleRef}
            name="title"
            id="title"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primaryColor active:border-primaryColor disabled:cursor-default disabled:bg-whiter "
            placeholder="عنوان المقال"
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
            required
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="mb-3 block text-black font-bold">
            الصورة
          </label>
          <input
            type="file"
            id="image"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primaryColor active:border-primaryColor disabled:cursor-default disabled:bg-whiter "
            accept=".jpeg, .jpg, .png, .jfif"
            multiple={false}
            onChange={(e) => (e.target.files ? setArticleImage(e.target.files[0]) : "")}
            placeholder="الصورة"
            required
          />
        </div>

        {/* Category ID */}
        <div>
          <label className="mb-3 block text-black font-bold" htmlFor="category_id">
            القسم
          </label>
          <CategoriesSelectBox
            selectedCategoryId={articleCategoryId!}
            setSelectedCategoryId={setArticleCategoryId}
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="editor" className="mb-3 block text-black font-bold">
            المحتوى
          </label>
          <Editor value={articleContent} setValue={setArticleContent} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="flex w-full justify-center items-center gap-4 rounded bg-primaryColor p-3 text-gray hover:bg-opacity-90 font-bold"
          disabled={createArticleLoad}
          style={createArticleLoad ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          <span>إنشاء</span>
          {createArticleLoad && <MoonLoader color="#fff" size={15} />}
        </button>
      </form>
    </section>
  );
};

export default CreateArticle;
