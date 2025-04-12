import { ArticleFields, IArticle, ICategory, IUser } from "@/types/entitiesTypes";

import { ArticlesDao } from "../../dao/articlesDao";
import { pool } from "../setup/connectToPostgreSQL";

/**
 * Model for performing articles-related database operations.
 */
export class ArticlesModel implements ArticlesDao {
  /* ===== Private Helpers ===== */

  /**
   * Helper function for dynamic selection of fields.
   *
   * If no selectedFields provided it returns all fields.
   *
   * @param selectedFields - Optional ArticleFields[] of selected fields to be fetched.
   * @returns The selected fields or default to '*' if not provided.
   */
  private getSelectedFields(selectedFields?: ArticleFields[]): string {
    return selectedFields && selectedFields.length > 0 ? selectedFields.join(", ") : "*";
  }

  /* ===== Create Operations ===== */

  /**
   * Creates a new article.
   *
   * @param article - The article object to be created.
   * @returns created article.
   */
  async createArticle(article: Partial<IArticle>): Promise<IArticle> {
    try {
      const query = `
        INSERT INTO articles (title, content, image, category_id, creator_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const { rows } = await pool.query(query, [
        article.title,
        article.content,
        article.image,
        article.category_id,
        article.creator_id,
      ]);

      return rows[0];
    } catch (err) {
      console.error("Error in createArticle:", err);
      throw err;
    }
  }

  /**
   * Saves an article for the user.
   *
   * @param userId - The ID of the user who is saving the article.
   * @param articleId - The ID of the article to save.
   * @returns void.
   */
  async saveArticle(userId: IUser["user_id"], articleId: IArticle["article_id"]): Promise<void> {
    try {
      const query = `
        INSERT INTO users_saved_articles (user_id, article_id)
        VALUES ($1, $2)
      `;
      await pool.query(query, [userId, articleId]);
    } catch (err) {
      console.error("Error in saveArticle:", err);
      throw err;
    }
  }

  /* ===== Read Operations ===== */

  /**
   * Finds an article by its ID.
   *
   * If no selectedFields provided it returns all fields.
   *
   * @param articleId - The unique identifier of the article.
   * @param selectedFields - Optional string specifying fields to return.
   * @returns The article object if found, otherwise null.
   */
  async findArticleById(
    articleId: IArticle["article_id"],
    selectedFields?: ArticleFields[],
  ): Promise<IArticle | null> {
    try {
      const query = `SELECT ${this.getSelectedFields(selectedFields)} FROM articles WHERE article_id = $1`;
      const { rows } = await pool.query(query, [articleId]);
      return rows[0];
    } catch (err) {
      console.error("Error in findArticleById:", err);
      throw err;
    }
  }

  /**
   * Finds an article by its title.
   *
   * If no selectedFields provided it returns all fields.
   *
   * @param title - The title of the article.
   * @param selectedFields - Optional string specifying fields to return.
   * @returns The article object if found, otherwise null.
   */
  async findArticleByTitle(
    title: IArticle["title"],
    selectedFields?: ArticleFields[],
  ): Promise<IArticle | null> {
    try {
      const query = `SELECT ${this.getSelectedFields(selectedFields)} FROM articles WHERE title = $1`;
      const { rows } = await pool.query(query, [title]);
      return rows[0];
    } catch (err) {
      console.error("Error in findArticleByTitle:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of articles with optional sorting, pagination, and selected fields.
   *
   * If no selectedFields provided it returns all fields.
   *
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional maximum number of articles to retrieve.
   * @param skip - Optional number of articles to skip for pagination.
   * @param selectedFields - Optional string of fields to return.
   * @returns Array of article objects.
   */
  async getArticles(
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle[]> {
    try {
      // Prepare the base query
      let query = `
        SELECT ${this.getSelectedFields(selectedFields)}
        FROM articles
        ORDER BY created_at ${order === -1 ? "DESC" : "ASC"}
      `;

      // Add LIMIT and OFFSET conditionally
      if (limit) query += ` LIMIT $1`;
      if (skip) query += ` OFFSET $2`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [];
      if (limit) params.push(limit);
      if (skip) params.push(skip);

      // Execute the query
      const { rows } = await pool.query(query, params);

      return rows;
    } catch (err) {
      console.error("Error in getArticles:", err);
      throw err;
    }
  }

  /**
   * Retrieves the total count of articles from the records_count table.
   *
   * Ensures fast retrieval without performing a direct count on the articles table.
   *
   * @returns Total number of articles as a number.
   */
  async getArticlesCount(): Promise<number> {
    try {
      const query = `SELECT record_count AS total_articles FROM records_count WHERE table_name = 'articles'`;
      const { rows } = await pool.query(query);

      // Return the count value, ensuring it's parsed as a number
      return rows.length ? Number(rows[0].total_articles) : 0;
    } catch (err) {
      console.error("Error in getArticlesCount:", err);
      throw err;
    }
  }

  /**
   * Searches for articles by title with optional sorting, pagination, and selected fields.
   *
   * If no selectedFields provided it returns all fields.
   *
   * @param searchKey - The search term to look for in the article title.
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional maximum number of articles to retrieve.
   * @param skip - Optional number of articles to skip for pagination.
   * @param selectedFields - Optional string of fields to return.
   * @returns Array of article objects matching the search criteria.
   */
  async searchArticles(
    searchKey: string,
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle[]> {
    try {
      // Prepare the base query
      let query = `
        SELECT ${this.getSelectedFields(selectedFields)}
        FROM articles
        WHERE title ILIKE $1
        ORDER BY created_at ${order === -1 ? "DESC" : "ASC"}
      `;

      // Add LIMIT and OFFSET conditionally
      if (limit) query += ` LIMIT $2`;
      if (skip) query += ` OFFSET $3`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [`%${searchKey}%`];
      if (limit) params.push(limit);
      if (skip) params.push(skip);

      // Execute the query
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in searchArticles:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of random articles.
   *
   * @param limit - Optional maximum number of random articles to retrieve.
   * @returns Array of random article objects.
   */
  async getRandomArticles(limit?: number): Promise<IArticle[]> {
    try {
      // Prepare the base query
      let query = `
        SELECT * 
        FROM articles
        ORDER BY RANDOM()
      `;

      // Add LIMIT conditionally
      if (limit) query += ` LIMIT $1`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [];
      if (limit) params.push(limit);

      // Execute the query
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in getRandomArticles:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of trending articles based on views.
   *
   * @param limit - Optional maximum number of trending articles to retrieve.
   * @returns Array of trending article objects.
   */
  async getTrendingArticles(limit?: number): Promise<IArticle[]> {
    try {
      // Prepare the base query
      let query = `
        SELECT * 
        FROM articles
        ORDER BY views DESC
      `;

      // Add LIMIT conditionally
      if (limit) query += ` LIMIT $1`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [];
      if (limit) params.push(limit);

      // Execute the query
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in getTrendingArticles:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of the latest articles based on their creation date.
   *
   * @param limit - Optional maximum number of latest articles to retrieve.
   * @returns Array of latest article objects.
   */
  async getLatestArticles(limit?: number): Promise<IArticle[]> {
    try {
      // Prepare the base query
      let query = `
        SELECT * 
        FROM articles
        ORDER BY created_at DESC
      `;

      // Add LIMIT conditionally
      if (limit) query += ` LIMIT $1`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [];
      if (limit) params.push(limit);

      // Execute the query
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in getLatestArticles:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of articles for a specific category with optional sorting, pagination.
   *
   * @param categoryId - The unique identifier of the category.
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional maximum number of articles to retrieve.
   * @param skip - Optional number of articles to skip for pagination.
   * @returns Array of article objects in the specified category.
   */
  async getCategoryArticles(
    categoryId: ICategory["category_id"],
    order?: number,
    limit?: number,
    skip?: number,
  ): Promise<IArticle[]> {
    try {
      // Prepare the base query
      let query = `
        SELECT * FROM articles
        WHERE category_id = $1
        ORDER BY created_at ${order === -1 ? "DESC" : "ASC"}
      `;

      // Add LIMIT and OFFSET conditionally
      if (limit) query += ` LIMIT $2`;
      if (skip) query += ` OFFSET $3`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [categoryId];
      if (limit) params.push(limit);
      if (skip) params.push(skip);

      // Execute the query with the dynamically constructed parameters
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in getCategoryArticles:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of created articles for a user with optional sorting, pagination, and selected fields.
   *
   * @param userId - The ID of the user whose created articles are being retrieved.
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional maximum number of articles to retrieve.
   * @param skip - Optional number of articles to skip for pagination.
   * @param selectedFields - Optional array of fields to return; defaults to all fields.
   * @returns Array of created article objects.
   */
  async getCreatedArticles(
    userId: IUser["user_id"],
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle[]> {
    try {
      // Prepare the base query
      let query = `
        SELECT ${this.getSelectedFields(selectedFields)} 
        FROM articles 
        WHERE creator_id = $1
        ORDER BY created_at ${order === -1 ? "DESC" : "ASC"}
      `;

      // Add LIMIT and OFFSET conditionally
      if (limit) query += ` LIMIT $2`;
      if (skip) query += ` OFFSET $${limit ? "3" : "2"}`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [userId];
      if (limit) params.push(limit);
      if (skip) params.push(skip);

      // Execute the query with the dynamically constructed parameters
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in getCreatedArticles:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of saved articles for a user with optional sorting, pagination, and selected fields.
   *
   * @param userId - The ID of the user whose saved articles are being retrieved.
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional maximum number of articles to retrieve.
   * @param skip - Optional number of articles to skip for pagination.
   * @param selectedFields - Optional array of fields to return.
   * @returns Array of saved article objects.
   */
  async getSavedArticles(
    userId: IUser["user_id"],
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: ArticleFields[],
  ): Promise<IArticle[]> {
    try {
      // Prepare the base query
      let query = `
        SELECT ${this.getSelectedFields(selectedFields)}
        FROM articles
        WHERE article_id IN (
          SELECT article_id
          FROM users_saved_articles
          WHERE user_id = $1
        )
        ORDER BY created_at ${order === -1 ? "DESC" : "ASC"}
      `;

      // Add LIMIT and OFFSET conditionally
      if (limit) query += ` LIMIT $2`;
      if (skip) query += ` OFFSET $3`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [userId];
      if (limit) params.push(limit);
      if (skip) params.push(skip);

      // Execute the query
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in getSavedArticles:", err);
      throw err;
    }
  }

  /**
   * Checks if the specified article is saved by the user.
   *
   * @param userId - The ID of the user.
   * @param articleId - The ID of the article to check.
   * @returns Boolean indicating whether the article is saved by the user.
   */
  async isArticleSaved(
    userId: IUser["user_id"],
    articleId: IArticle["article_id"],
  ): Promise<boolean> {
    try {
      const query = `
        SELECT 1
        FROM users_saved_articles
        WHERE user_id = $1 AND article_id = $2
      `;
      const { rowCount } = await pool.query(query, [userId, articleId]);
      return rowCount ? rowCount > 0 : false;
    } catch (err) {
      console.error("Error in isArticleSaved:", err);
      throw err;
    }
  }

  /* ===== Update Operations ===== */

  /**
   * Updates an article by its ID.
   *
   * @param articleId - The unique identifier of the article.
   * @param article - Partial article data to update.
   * @returns updated article.
   */
  async updateArticle(
    articleId: IArticle["article_id"],
    article: Partial<IArticle>,
  ): Promise<IArticle> {
    try {
      let updatedArticle = {} as IArticle; // updatedArticle will be returned

      const fields = Object.keys(article)
        .filter((key) => article[key as keyof IArticle] !== undefined)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");

      if (!fields) return updatedArticle;

      const query = `UPDATE articles SET ${fields} WHERE article_id = $1 RETURNING *`;
      const { rows } = await pool.query(query, [articleId, ...Object.values(article)]);
      return rows[0];
    } catch (err) {
      console.error("Error in updateArticle:", err);
      throw err;
    }
  }

  /* ===== Delete Operations ===== */

  /**
   * Removes a saved article for the user.
   *
   * @param userId - The ID of the user who is removing the saved article.
   * @param articleId - The ID of the article to remove from saved articles.
   * @returns void.
   */
  async unsaveArticle(userId: IUser["user_id"], articleId: IArticle["article_id"]): Promise<void> {
    try {
      const query = `
        DELETE FROM users_saved_articles
        WHERE user_id = $1 AND article_id = $2
      `;
      await pool.query(query, [userId, articleId]);
    } catch (err) {
      console.error("Error in unsaveArticle:", err);
      throw err;
    }
  }

  /**
   * Deletes an article by its ID.
   *
   * @param articleId - The ID of the article to delete.
   * @returns void
   */
  async deleteArticle(articleId: IArticle["article_id"]): Promise<void> {
    try {
      const query = `DELETE FROM articles WHERE article_id = $1`;
      await pool.query(query, [articleId]);
    } catch (err) {
      console.error("Error in deleteArticle:", err);
      throw err;
    }
  }
}
