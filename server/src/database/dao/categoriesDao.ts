import { CategoryFields, ICategory } from "@shared/types/entitiesTypes";

export interface CategoriesDao {
  // Finds a category by its ID, with optional specific fields to select
  findCategoryById(
    categoryId: string,
    selectedFields?: CategoryFields[],
  ): Promise<ICategory | null>;

  // Finds a category by its title, with optional specific fields to select
  findCategoryByTitle(
    title: string,
    selectedFields?: CategoryFields[],
  ): Promise<ICategory | null>;

  // Creates a new category
  createCategory(category: Partial<ICategory>): Promise<void>;

  // Updates an existing category by its ID
  updateCategory(
    categoryId: string,
    category: Partial<ICategory>,
  ): Promise<void>;

  // Deletes a category by its ID
  deleteCategory(categoryId: string): Promise<void>;

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
}
