import { useEffect, useState } from "react";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../../../api/hooks/useCategoriesAPIs";
import { ArticlesGrid } from "../../../components";
import { useHandleErrors } from "../../../hooks";

const RelatedArticlesByCategory = ({ article }: { article: IArticle }) => {
  // State to store related articles fetched from the API
  const [relatedArticles, setRelatedArticles] = useState<IArticle[]>([]);
  // State to track the loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hook to handle errors gracefully
  const handleErrors = useHandleErrors();
  // Hook for accessing category-related API methods
  const categoriesAPIs = useCategoriesAPIs();

  /**
   * Fetch related articles based on the category of the provided article.
   */
  const fetchRelatedArticles = async () => {
    try {
      if (!article?.category_id) return;
      setIsLoading(true); // Set loading state
      const response: ApiBodyResponse<GetArticlesResponse> =
        await categoriesAPIs.getCategoryArticles(article.category_id, 1, 4, "new");
      setRelatedArticles(response.data?.articles || []); // Update state with the articles
    } catch (error) {
      handleErrors(error); // Handle API errors
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Fetch related articles when the component mounts or article changes
  useEffect(() => {
    fetchRelatedArticles();
  }, [article?.category_id]);

  return (
    <ArticlesGrid
      title="مقالات ذات صلة"
      isLoading={isLoading}
      articles={relatedArticles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
      gridClassName="grid gap-4 md:grid-cols-2"
    />
  );
};

export default RelatedArticlesByCategory;
