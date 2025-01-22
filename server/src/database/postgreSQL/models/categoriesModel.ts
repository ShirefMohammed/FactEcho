import { CategoryFields, ICategory } from "@shared/types/entitiesTypes";

import { CategoriesDao } from "../../dao/categoriesDao";
import { pool } from "../setup/connectToPostgreSQL";

/**
 * Model for performing categories-related database operations.
 */
export class CategoriesModel implements CategoriesDao {
  /* ===== Private Helpers ===== */

  /**
   * Helper function for dynamic selection of fields.
   *
   * If no selectedFields provided it returns all fields.
   *
   * @param selectedFields - Optional CategoryFields[] of selected fields to be fetched.
   * @returns The selected fields or default to '*' if not provided.
   */
  private getSelectedFields(selectedFields?: CategoryFields[]): string {
    return selectedFields && selectedFields.length > 0
      ? selectedFields.join(", ")
      : "*";
  }

  /* ===== Create Operations ===== */

  /**
   * Creates a new category.
   *
   * @param category - The category object to be created.
   * @returns created category.
   */
  async createCategory(category: Partial<ICategory>): Promise<ICategory> {
    try {
      const query = `INSERT INTO categories (title, creator_id) VALUES ($1, $2) RETURNING *`;

      const { rows } = await pool.query(query, [
        category.title,
        category.creator_id || null,
      ]);

      return rows[0];
    } catch (err) {
      console.error("Error in createCategory:", err);
      throw err;
    }
  }

  /* ===== Read Operations ===== */

  /**
   * Finds a category by its ID.
   *
   * If no selectedFields provided it returns all fields.
   *
   * @param categoryId - The ID of the category to find.
   * @param selectedFields - Optional array of fields to return;
   * @returns The category matching the ID, or null if not found.
   */
  async findCategoryById(
    categoryId: ICategory["category_id"],
    selectedFields?: CategoryFields[],
  ): Promise<ICategory | null> {
    try {
      const query = `SELECT ${this.getSelectedFields(selectedFields)} FROM categories WHERE category_id = $1`;
      const { rows } = await pool.query(query, [categoryId]);
      return rows[0];
    } catch (err) {
      console.error("Error in findCategoryById:", err);
      throw err;
    }
  }

  /**
   * Finds a category by its title.
   *
   * If no selectedFields provided it returns all fields.
   *
   * @param title - The title of the category to find.
   * @param selectedFields - Optional array of fields to return;
   * @returns The category matching the title, or null if not found.
   */
  async findCategoryByTitle(
    title: ICategory["title"],
    selectedFields?: CategoryFields[],
  ): Promise<ICategory | null> {
    try {
      const query = `SELECT ${this.getSelectedFields(selectedFields)} FROM categories WHERE title = $1`;
      const { rows } = await pool.query(query, [title]);
      return rows[0];
    } catch (err) {
      console.error("Error in findCategoryByTitle:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of categories with optional sorting, pagination, and selected fields.
   *
   * If no selectedFields provided it returns all fields.
   *
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional maximum number of categories to retrieve.
   * @param skip - Optional number of categories to skip for pagination.
   * @param selectedFields - Optional array of fields to return; defaults to all fields.
   * @returns Array of category objects.
   */
  async getCategories(
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: CategoryFields[],
  ): Promise<ICategory[]> {
    try {
      // Prepare the base query
      let query = `
        SELECT ${this.getSelectedFields(selectedFields)} FROM categories
        ORDER BY created_at ${order === -1 ? "DESC" : "ASC"}
      `;

      // Add LIMIT and OFFSET conditionally
      if (limit) query += ` LIMIT $1`;
      if (skip) query += ` OFFSET $2`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [];
      if (limit) params.push(limit);
      if (skip) params.push(skip);

      // Execute the query with the dynamically constructed parameters
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in getCategories:", err);
      throw err;
    }
  }

  /**
   * Retrieves the total count of categories from the records_count table.
   *
   * Ensures fast retrieval without performing a direct count on the categories table.
   *
   * @returns Total number of categories as a number.
   */
  async getCategoriesCount(): Promise<number> {
    try {
      const query = `SELECT record_count AS total_categories FROM records_count WHERE table_name = 'categories'`;
      const { rows } = await pool.query(query);

      // Return the count value, ensuring it's parsed as a number
      return rows.length ? Number(rows[0].total_categories) : 0;
    } catch (err) {
      console.error("Error in getCategoriesCount:", err);
      throw err;
    }
  }

  /**
   * Searches for categories by title with optional sorting, pagination, and selected fields.
   *
   * If no selectedFields provided it returns all fields.
   *
   * @param searchKey - The search term to look for in the category title.
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional maximum number of categories to retrieve.
   * @param skip - Optional number of categories to skip for pagination.
   * @param selectedFields - Optional array of fields to return; defaults to all fields.
   * @returns Array of category objects matching the search criteria.
   */
  async searchCategories(
    searchKey: string,
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: CategoryFields[],
  ): Promise<ICategory[]> {
    try {
      // Prepare the base query
      let query = `
        SELECT ${this.getSelectedFields(selectedFields)} FROM categories
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

      // Execute the query with the dynamically constructed parameters
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in searchCategories:", err);
      throw err;
    }
  }

  /* ===== Update Operations ===== */

  /**
   * Updates a category by its ID.
   *
   * @param categoryId - The unique identifier of the category.
   * @param category - Partial category data to update.
   * @returns updated category.
   */
  async updateCategory(
    categoryId: ICategory["category_id"],
    category: Partial<ICategory>,
  ): Promise<ICategory> {
    try {
      let updatedCategory = {} as ICategory; // updatedCategory will be returned

      const fields = Object.keys(category)
        .filter((key) => category[key as keyof ICategory] !== undefined)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");

      if (!fields) return updatedCategory;

      // No need to update 'updated_at' here because the trigger will handle it
      const query = `UPDATE categories SET ${fields} WHERE category_id = $1 RETURNING *`;
      const { rows } = await pool.query(query, [
        categoryId,
        ...Object.values(category),
      ]);
      return rows[0];
    } catch (err) {
      console.error("Error in updateCategory:", err);
      throw err;
    }
  }

  /* ===== Delete Operations ===== */

  /**
   * Deletes a category by its ID.
   *
   * @param categoryId - The ID of the category to delete.
   * @returns void
   */
  async deleteCategory(categoryId: ICategory["category_id"]): Promise<void> {
    try {
      await pool.query("DELETE FROM categories WHERE category_id = $1", [
        categoryId,
      ]);
    } catch (err) {
      console.error("Error in deleteCategory:", err);
      throw err;
    }
  }
}
