import { CategoryFields, ICategory } from "@/types/entitiesTypes";

export interface CategoriesDao {
  /* ===== Create Operations ===== */

  // Creates a new category
  createCategory(category: Partial<ICategory>): Promise<ICategory>;

  /* ===== Read Operations ===== */

  // Finds a category by its ID, with optional specific fields to select
  findCategoryById(
    categoryId: ICategory["category_id"],
    selectedFields?: CategoryFields[],
  ): Promise<ICategory | null>;

  // Finds a category by its title, with optional specific fields to select
  findCategoryByTitle(
    title: ICategory["title"],
    selectedFields?: CategoryFields[],
  ): Promise<ICategory | null>;

  // Retrieves multiple categories with optional order, limit, skip, and selected fields
  getCategories(
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: CategoryFields[],
  ): Promise<ICategory[]>;

  // Get categories count
  getCategoriesCount(): Promise<number>;

  // Searches for categories based on a search key, with optional order, limit, skip, and selected fields
  searchCategories(
    searchKey: string,
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: CategoryFields[],
  ): Promise<ICategory[]>;

  /* ===== Update Operations ===== */

  // Updates an existing category by its ID
  updateCategory(
    categoryId: ICategory["category_id"],
    category: Partial<ICategory>,
  ): Promise<ICategory>;

  /* ===== Delete Operations ===== */

  // Deletes a category by its ID
  deleteCategory(categoryId: ICategory["category_id"]): Promise<void>;
}
