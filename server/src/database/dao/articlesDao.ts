import { ArticleFields, IArticle } from "@shared/types/entitiesTypes";

export interface ArticlesDao {
  // Finds an article by ID, with specific fields to select
  findArticleById(
    articleId: string,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle | null>;

  // Finds an article by title, with specific fields to select
  findArticleByTitle(
    title: string,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle | null>;

  // Creates a new article
  createArticle(article: Partial<IArticle>): Promise<void>;

  // Updates an existing article by ID
  updateArticle(articleId: string, article: Partial<IArticle>): Promise<void>;

  // Deletes an article by ID
  deleteArticle(articleId: string): Promise<void>;

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

  // Get articles count
  getArticlesCount(): Promise<number>;

  // Retrieves a list of random articles with an optional limit.
  getRandomArticles(limit: number): Promise<IArticle[]>;

  // Retrieves a list of trending articles with an optional limit.
  getTrendingArticles(limit: number): Promise<IArticle[]>;

  // Retrieves a list of the latest articles with an optional limit.
  getLatestArticles(limit: number): Promise<IArticle[]>;

  // Retrieves articles associated with a given category
  getCategoryArticles(
    categoryId: string,
    order?: number,
    limit?: number,
    skip?: number,
  ): Promise<IArticle[]>;

  // Retrieves a list of saved articles with optional order, limit, skip, and selected fields.
  getSavedArticles(
    userId: string,
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle[]>;

  // Checks if the specified article is saved by the user.
  isArticleSaved(userId: string, articleId: string): Promise<boolean>;

  // Saves an article for the user.
  saveArticle(userId: string, articleId: string): Promise<void>;

  // Removes a saved article for the user.
  unsaveArticle(userId: string, articleId: string): Promise<void>;

  // Retrieves a list of created articles with optional order, limit, skip, and selected fields.
  getCreatedArticles(
    userId: string,
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle[]>;
}
