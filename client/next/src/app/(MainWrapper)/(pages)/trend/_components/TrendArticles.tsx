import { IArticle } from "@shared/types/entitiesTypes";

import { ArticlesGrid } from "../../../../../components";

const TrendArticles = ({ articles }: { articles: IArticle[] }) => {
  return (
    <ArticlesGrid
      title="المقالات الرائجة"
      isLoading={false}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
    />
  );
};

export default TrendArticles;
