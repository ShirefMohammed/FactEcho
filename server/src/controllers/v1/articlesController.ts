import {
  createArticle as commonCreateArticle,
  deleteArticle as commonDeleteArticle,
  getArticle as commonGetArticle,
  getArticles as commonGetArticles,
  getExploredArticles as commonGetExploredArticles,
  getLatestArticles as commonGetLatestArticles,
  getSavedArticles as commonGetSavedArticles,
  getTotalArticlesCount as commonGetTotalArticlesCount,
  getTrendArticles as commonGetTrendArticles,
  isArticleSaved as commonIsArticleSaved,
  saveArticle as commonSaveArticle,
  searchArticles as commonSearchArticles,
  unsaveArticle as commonUnsaveArticle,
  updateArticle as commonUpdateArticle,
} from "../common/articlesController";

export const getArticles = commonGetArticles;
export const searchArticles = commonSearchArticles;
export const getTotalArticlesCount = commonGetTotalArticlesCount;
export const getExploredArticles = commonGetExploredArticles;
export const getTrendArticles = commonGetTrendArticles;
export const getLatestArticles = commonGetLatestArticles;
export const getArticle = commonGetArticle;
export const createArticle = commonCreateArticle;
export const updateArticle = commonUpdateArticle;
export const deleteArticle = commonDeleteArticle;
export const getSavedArticles = commonGetSavedArticles;
export const isArticleSaved = commonIsArticleSaved;
export const saveArticle = commonSaveArticle;
export const unsaveArticle = commonUnsaveArticle;
