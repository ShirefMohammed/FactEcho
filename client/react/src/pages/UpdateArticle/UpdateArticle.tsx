import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MoonLoader } from "react-spinners";

import { UpdateArticleRequest } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../../api/hooks/useArticlesAPIs";
import { CategoriesSelectBox } from "../../components";
import { Editor } from "../../components";
import { useHandleErrors, useNotify } from "../../hooks";
import { uploadFileToCloudinary } from "../../services/uploadFileToCloudinary";

const UpdateArticle = () => {
  // Will updated article id
  const { articleId: willUpdatedArticleId } = useParams();

  const [articleTitle, setArticleTitle] = useState<IArticle["title"]>("");
  const [articleImage, setArticleImage] = useState<Blob | null>(null);
  const [articleCategoryId, setArticleCategoryId] = useState<IArticle["category_id"]>("");
  const [articleContent, setArticleContent] = useState<IArticle["content"]>("");

  // State to track loading during API call
  const [updateArticleLoad, setUpdateArticleLoad] = useState<boolean>(false);

  const notify = useNotify(); // Notification function
  const handleErrors = useHandleErrors();
  const articlesAPIs = useArticlesAPIs(); // API functions for articles

  /**
   * Handles updating the article.
   * Displays notifications on success or failure.
   */
  const updateArticle = async (): Promise<void> => {
    try {
      setUpdateArticleLoad(true);

      // Validate required fields
      if (!articleTitle || !articleCategoryId || !articleContent) {
        notify("info", "Article title, category, content are required");
        return;
      }

      // Upload the image to Cloudinary and get the URL
      let articleImageUrl: string = "";
      if (articleImage) {
        try {
          articleImageUrl = await uploadFileToCloudinary(articleImage);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          notify("error", "Failed to upload article image!");
          return;
        }
      }

      // Construct the payload for the API request
      const willUpdatedArticle: UpdateArticleRequest = {
        title: articleTitle,
        image: articleImageUrl,
        category_id: articleCategoryId,
        content: articleContent,
      };

      // Call the API to update a new article
      const resBody = await articlesAPIs.updateArticle(willUpdatedArticleId!, willUpdatedArticle);

      // Notify the user of success
      notify("success", resBody.message);
    } catch (err: any) {
      // Handle errors with appropriate user feedback
      const message =
        err?.response?.data?.message ||
        (err?.response ? "Update article failed!" : "No Server Response");
      notify("error", message);
    } finally {
      setUpdateArticleLoad(false); // Hide loading indicator
    }
  };

  /**
   * Fetch will updated article previous data
   */
  const fetchWillUpdatedArticle = async (): Promise<void> => {
    try {
      // Call the API to update a new article
      const resBody = await articlesAPIs.getArticleById(willUpdatedArticleId!);

      // Set will updated article previous data
      setArticleTitle(resBody.data?.article.title || "");
      setArticleCategoryId(resBody.data?.article.category_id || "");
      setArticleContent(resBody.data?.article.content || "");
    } catch (err: any) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    // Fetch will updated article previous data
    fetchWillUpdatedArticle();
  }, [willUpdatedArticleId]);

  return (
    <section>
      {/* Modal Header */}
      <header className="border-b border-stroke py-4 px-6.5">
        <h2 className="font-bold text-black text-2xl text-center">تعديل مقال</h2>
      </header>

      {/* Form */}
      <form
        className="flex flex-col gap-5.5 p-6.5"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page reload
          updateArticle(); // Trigger update article logic
        }}
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-3 block text-black font-bold">
            العنوان
          </label>
          <input
            type="text"
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
          disabled={updateArticleLoad}
          style={updateArticleLoad ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          <span>حفظ التعديلات</span>
          {updateArticleLoad && <MoonLoader color="#fff" size={15} />}
        </button>
      </form>
    </section>
  );
};

export default UpdateArticle;
