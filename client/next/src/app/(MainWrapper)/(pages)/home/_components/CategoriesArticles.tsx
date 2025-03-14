import { ApiBodyResponse, GetCategoriesResponse } from "@shared/types/apiTypes";
import { IArticle, ICategory } from "@shared/types/entitiesTypes";

import { categoriesAPIs } from "../../../../../api/server/categoriesAPIs";
import ArticlesGrid from "../../../../../components/ArticlesGrid";

const CategoriesArticles = async () => {
  // Fetch categories on the server
  let categories: ICategory[] = [];
  try {
    const resBody: ApiBodyResponse<GetCategoriesResponse> = await categoriesAPIs.getCategories(
      1,
      5,
      "new",
    );
    categories = resBody.data?.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Fetch articles for each category in parallel
  const categoryArticlesPromises = categories.map((category) =>
    categoriesAPIs.getCategoryArticles(category.category_id, 1, 3, "new"),
  );
  const categoryArticlesResponses = await Promise.allSettled(categoryArticlesPromises);

  const categoryArticles: { [key: string]: IArticle[] } = {};
  categoryArticlesResponses.forEach((response, index) => {
    if (response.status === "fulfilled") {
      const category = categories[index];
      categoryArticles[category.category_id] = response.value.data?.articles || [];
    } else {
      console.error(
        `Error fetching articles for category ${categories[index]?.category_id}:`,
        response.reason,
      );
    }
  });

  return (
    <div className="w-full flex flex-col gap-8">
      {categories.map((category) => (
        <CategoryArticles
          key={category.category_id}
          category={category}
          articles={categoryArticles[category.category_id]}
        />
      ))}
    </div>
  );
};

interface CategoryArticlesProps {
  category: ICategory;
  articles: IArticle[];
}

const CategoryArticles = ({ category, articles }: CategoryArticlesProps) => {
  if (articles.length < 3) {
    return null;
  }

  return (
    <ArticlesGrid
      title={`${category?.title || ""}`}
      isLoading={false}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
    />
  );
};

export default CategoriesArticles;
