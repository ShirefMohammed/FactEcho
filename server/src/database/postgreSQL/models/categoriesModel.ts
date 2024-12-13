import { CategoryFields, ICategory } from "@shared/types/entitiesTypes";

import { CategoriesDao } from "../../dao/categoriesDao";
import { pool } from "../connectToPostgreSQL";

/**
 * Model for performing categories-related database operations.
 */
export class CategoriesModel implements CategoriesDao {
  /**
   * Helper function for dynamic selection of fields.
   * @param selectedFields - Optional CategoryFields[] of selected fields to be fetched.
   * @returns The selected fields or default to '*' if not provided.
   */
  private getSelectedFields(selectedFields?: CategoryFields[]): string {
    return selectedFields && selectedFields.length > 0
      ? selectedFields.join(", ")
      : "*";
  }

  /**
   * Finds a category by its ID.
   * @param categoryId - The ID of the category to find.
   * @param selectedFields - Optional array of fields to return;
   * @returns The category matching the ID, or null if not found.
   */
  async findCategoryById(
    categoryId: string,
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
   * @param title - The title of the category to find.
   * @param selectedFields - Optional array of fields to return;
   * @returns The category matching the title, or null if not found.
   */
  async findCategoryByTitle(
    title: string,
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
   * Creates a new category.
   * @param category - The category object to be created.
   * @returns void
   */
  async createCategory(category: Partial<ICategory>): Promise<void> {
    try {
      const query = `INSERT INTO categories (title, creator_id) VALUES ($1, $2)`;
      await pool.query(query, [category.title, category.creator_id || null]);
    } catch (err) {
      console.error("Error in createCategory:", err);
      throw err;
    }
  }

  /**
   * Updates a category by its ID.
   * @param categoryId - The unique identifier of the category.
   * @param category - Partial category data to update.
   * @returns void
   */
  async updateCategory(
    categoryId: string,
    category: Partial<ICategory>,
  ): Promise<void> {
    try {
      const fields = Object.keys(category)
        .filter((key) => category[key as keyof ICategory] !== undefined)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");

      if (!fields) return;

      // No need to update 'updated_at' here because the trigger will handle it
      const query = `UPDATE categories SET ${fields} WHERE category_id = $1`;
      await pool.query(query, [categoryId, ...Object.values(category)]);
    } catch (err) {
      console.error("Error in updateCategory:", err);
      throw err;
    }
  }

  /**
   * Deletes a category by its ID.
   * @param categoryId - The ID of the category to delete.
   * @returns void
   */
  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await pool.query("DELETE FROM categories WHERE category_id = $1", [
        categoryId,
      ]);
    } catch (err) {
      console.error("Error in deleteCategory:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of categories with optional sorting, pagination, and selected fields.
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
   * Ensures fast retrieval without performing a direct count on the categories table.
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
}
