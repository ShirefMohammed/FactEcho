"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaveArticle = exports.saveArticle = exports.isArticleSaved = exports.getSavedArticles = exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticle = exports.getLatestArticles = exports.getTrendArticles = exports.getExploredArticles = exports.getTotalArticlesCount = exports.searchArticles = exports.getArticles = void 0;
var articlesController_1 = require("../common/articlesController");
exports.getArticles = articlesController_1.getArticles;
exports.searchArticles = articlesController_1.searchArticles;
exports.getTotalArticlesCount = articlesController_1.getTotalArticlesCount;
exports.getExploredArticles = articlesController_1.getExploredArticles;
exports.getTrendArticles = articlesController_1.getTrendArticles;
exports.getLatestArticles = articlesController_1.getLatestArticles;
exports.getArticle = articlesController_1.getArticle;
exports.createArticle = articlesController_1.createArticle;
exports.updateArticle = articlesController_1.updateArticle;
exports.deleteArticle = articlesController_1.deleteArticle;
exports.getSavedArticles = articlesController_1.getSavedArticles;
exports.isArticleSaved = articlesController_1.isArticleSaved;
exports.saveArticle = articlesController_1.saveArticle;
exports.unsaveArticle = articlesController_1.unsaveArticle;
