import {
  ArticleFields,
  IArticle,
  ICategory,
  IUser,
} from "@shared/types/entitiesTypes";

export interface ArticlesDao {
  /* ===== Create Operations ===== */

  // Creates a new article
  createArticle(article: Partial<IArticle>): Promise<IArticle>;

  // Saves an article for the user.
  saveArticle(
    userId: IUser["user_id"],
    articleId: IArticle["article_id"],
  ): Promise<void>;

  /* ===== Read Operations ===== */

  // Finds an article by ID, with specific fields to select
  findArticleById(
    articleId: IArticle["article_id"],
    selectedFields?: ArticleFields[],
  ): Promise<IArticle | null>;

  // Finds an article by title, with specific fields to select
  findArticleByTitle(
    title: IArticle["title"],
    selectedFields?: ArticleFields[],
  ): Promise<IArticle | null>;

  // Retrieves multiple articles with optional order, limit, skip, and selected fields
  getArticles(
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle[]>;

  // Get the total count of articles
  getArticlesCount(): Promise<number>;

  // Searches for articles based on a search key, with optional order, limit, skip, and selected fields
  searchArticles(
    searchKey: string,
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle[]>;

  // Retrieves a list of random articles with an optional limit.
  getRandomArticles(limit: number): Promise<IArticle[]>;

  // Retrieves a list of trending articles with an optional limit.
  getTrendingArticles(limit: number): Promise<IArticle[]>;

  // Retrieves a list of the latest articles with an optional limit.
  getLatestArticles(limit: number): Promise<IArticle[]>;

  // Retrieves articles associated with a given category
  getCategoryArticles(
    categoryId: ICategory["category_id"],
    order?: number,
    limit?: number,
    skip?: number,
  ): Promise<IArticle[]>;

  // Retrieves a list of created articles with optional order, limit, skip, and selected fields.
  getCreatedArticles(
    userId: IUser["user_id"],
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle[]>;

  // Retrieves a list of saved articles with optional order, limit, skip, and selected fields.
  getSavedArticles(
    userId: IUser["user_id"],
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle[]>;

  // Checks if the specified article is saved by the user.
  isArticleSaved(
    userId: IUser["user_id"],
    articleId: IArticle["article_id"],
  ): Promise<boolean>;

  /* ===== Update Operations ===== */

  // Updates an existing article by ID
  updateArticle(
    articleId: IArticle["article_id"],
    article: Partial<IArticle>,
  ): Promise<IArticle>;

  /* ===== Delete Operations ===== */

  // Removes a saved article for the user.
  unsaveArticle(
    userId: IUser["user_id"],
    articleId: IArticle["article_id"],
  ): Promise<void>;

  // Deletes an article by ID
  deleteArticle(articleId: IArticle["article_id"]): Promise<void>;
}
