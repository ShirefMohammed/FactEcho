import { IArticle } from "@/types/entitiesTypes";
import { MoonLoader } from "react-spinners";

import ArticleCard from "./ArticleCard";

interface ArticlesGridProps {
  title?: string;
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
  articles: IArticle[];
  displayFields: Array<"title" | "image" | "views" | "created_at" | "creator_id">;
  gridClassName?: string;
  btn?: {
    articlesLength: number;
    limit: number;
    page: number;
    setPage: (page: number) => void;
  };
}

/**
 * Renders a grid of articles using the `ArticleCard` component.
 *
 * @component
 * @param {ArticlesGridProps} props - Props for the `ArticlesGrid` component.
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <ArticlesGrid
 *   title="Latest Articles"
 *   isLoading={isLoading}
 *   setIsLoading={setIsLoading}
 *   articles={articles}
 *   displayFields={["title", "image", "views", "created_at", "creator_id"]}
 *   gridClassName="grid gap-4 md:grid-cols-2"
 *   btn={{
 *     articlesLength: articles.length,
 *     limit: limit,
 *     page: page,
 *     setPage: setPage,
 *   }}
 * />
 */
const ArticlesGrid: React.FC<ArticlesGridProps> = ({
  title,
  isLoading,
  setIsLoading,
  articles,
  displayFields,
  gridClassName,
  btn,
}: ArticlesGridProps) => {
  return (
    <section className="w-full">
      {/* Render title if provided */}
      {title && (
        <h2 className="pb-3 mb-4 border-b border-slate-200 font-bold text-lg flex items-center gap-2">
          <span className="block w-3 h-3 bg-primaryColor rounded-full"></span>
          {title}
        </h2>
      )}

      {/* Conditionally render the articles list or a loading indicator */}
      {!isLoading ? (
        <ul className={gridClassName || "grid gap-4 md:grid-cols-2 lg:grid-cols-3"}>
          {articles.map((article) => {
            // Dynamically construct props for ArticleCard based on displayFields
            const props: Partial<IArticle> = {};
            if (displayFields.indexOf("title") !== -1) props.title = article.title;
            if (displayFields.indexOf("image") !== -1) props.image = article.image;
            if (displayFields.indexOf("views") !== -1) props.views = article.views;
            if (displayFields.indexOf("created_at") !== -1) props.created_at = article.created_at;
            if (displayFields.indexOf("creator_id") !== -1) props.creator_id = article.creator_id;

            return (
              <li key={article.article_id}>
                <ArticleCard article_id={article.article_id} {...props} />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-gray-500">جاري التحميل...</div>
      )}

      {/* Render "Load More" button or "No More Articles" message */}
      {btn && (
        <div className="mt-4">
          {btn.articlesLength === btn.limit * btn.page ? (
            <button
              type="button"
              className="border-none outline-none mx-auto text-white bg-primaryColor underline text-center py-1 px-2 rounded-md flex items-center justify-center gap-1 uppercase text-sm"
              disabled={isLoading}
              onClick={() => {
                setIsLoading && setIsLoading(true);
                btn.setPage(btn.page + 1);
              }}
            >
              <span>المزيد</span>
              {isLoading && <MoonLoader color="#fff" size={10} className="ml-2" />}
            </button>
          ) : btn.page * btn.limit > btn.articlesLength ? (
            <p className="text-center text-sm mt-2">لم يعد هناك شئ</p>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default ArticlesGrid;
