import {
  createCategory as commonCreateCategory,
  deleteCategory as commonDeleteCategory,
  getCategories as commonGetCategories,
  getCategory as commonGetCategory,
  getCategoryArticles as commonGetCategoryArticles,
  getTotalCategoriesCount as commonGetTotalCategoriesCount,
  searchCategories as commonSearchCategories,
  updateCategory as commonUpdateCategory,
} from "../common/categoriesController";

export const getCategories = commonGetCategories;
export const searchCategories = commonSearchCategories;
export const getTotalCategoriesCount = commonGetTotalCategoriesCount;
export const getCategory = commonGetCategory;
export const createCategory = commonCreateCategory;
export const updateCategory = commonUpdateCategory;
export const deleteCategory = commonDeleteCategory;
export const getCategoryArticles = commonGetCategoryArticles;
