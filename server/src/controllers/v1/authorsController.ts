import {
  getAuthor as commonGetAuthor,
  getAuthorArticles as commonGetAuthorArticles,
  getAuthors as commonGetAuthors,
  getTotalAuthorsCount as commonGetTotalAuthorsCount,
  searchAuthors as commonSearchAuthors,
  updateAuthorPermissions as commonUpdateAuthorPermissions,
} from "../common/authorsController";

export const getAuthors = commonGetAuthors;
export const searchAuthors = commonSearchAuthors;
export const getTotalAuthorsCount = commonGetTotalAuthorsCount;
export const getAuthor = commonGetAuthor;
export const updateAuthorPermissions = commonUpdateAuthorPermissions;
export const getAuthorArticles = commonGetAuthorArticles;
