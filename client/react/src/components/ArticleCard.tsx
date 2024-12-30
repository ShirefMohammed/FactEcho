import { Link } from "react-router-dom";

import { IArticle } from "@shared/types/entitiesTypes";

import { formatCreatedSince } from "../utils/formateCreatedSince";

interface ArticleCardProps {
  article_id: IArticle["article_id"];
  title?: IArticle["title"];
  image?: IArticle["image"];
  views?: IArticle["views"];
  created_at?: IArticle["created_at"];
}

/**
 * A reusable card component to display an article with its image, title, views, and creation date.
 * Only the fields that are passed as props will appear in the UI.
 *
 * @param {ArticleCardProps} props - Props containing the article details.
 */
const ArticleCard = ({ article_id, title, image, views, created_at }: ArticleCardProps) => {
  return (
    <div className="w-full h-full rounded-lg">
      {/* Article image */}
      {image && (
        <Link to={`/articles/${article_id}`}>
          <img
            src={image}
            alt="article image"
            loading="lazy"
            className="w-full object-cover user-select-none rounded-md aspect-[5/3]"
          />
        </Link>
      )}

      <div className="flex flex-col gap-2 mt-4">
        {/* Article title */}
        {title && (
          <Link
            to={`/articles/${article_id}`}
            className="text-lg font-bold text-main hover:underline"
          >
            {title}
          </Link>
        )}

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

export default ArticleCard;
