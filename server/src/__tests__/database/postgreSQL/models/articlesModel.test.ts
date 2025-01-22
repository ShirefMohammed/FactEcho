import dotenv from "dotenv";

import { IArticle, ICategory, IUser } from "@shared/types/entitiesTypes";

import {
  articlesModel,
  categoriesModel,
  connectDB,
  disconnectDB,
  usersModel,
} from "../../../../database";
import { ROLES_LIST } from "../../../../utils/rolesList";

dotenv.config();

/**
 * Integration tests for the articlesModel.
 *
 * This suite tests the create, read, update, and delete operations for article management.
 */

/**
 * Setup and teardown for database connection.
 */
beforeAll(async () => {
  if (process.env.NODE_ENV?.trim() !== "testing") {
    throw new Error("Tests can only run in the 'testing' environment.");
  }
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

/**
 * Test data setup.
 */
let testUser: IUser = {
  user_id: "testUser.UUID",
  name: "testUser.testArticle.name",
  email: "testUser.testArticle.email",
  password: "testUser.testArticle.password",
  is_verified: true,
  role: ROLES_LIST.Admin,
  created_at: "",
  updated_at: "",
  provider: "testUser.testArticle.provider",
  provider_user_id: "testUser.testArticle.provider_user_id",
};
let testCategory: ICategory = {
  category_id: "testCategory.UUID",
  title: "testCategory.title",
  created_at: "",
  updated_at: "",
  creator_id: "testCategory.UUID",
};
let testArticle: IArticle = {
  article_id: "testArticle.UUID",
  title: "testArticle.title",
  content: "testArticle.content",
  image: "testArticle.image",
  views: 0,
  created_at: "",
  updated_at: "",
  category_id: "testArticle.UUID",
  creator_id: "testArticle.UUID",
};

describe("articlesModel Integration Tests", () => {
  /* ===== Create Operations ===== */
  describe("Create Operations", () => {
    it("should create a new user with OAuth data", async () => {
      const newUser: Partial<IUser> = {
        name: testUser.name,
        email: `${testUser.email}_OAuth`,
        password: testUser.password,
        role: testUser.role,
        is_verified: testUser.is_verified,
        provider: testUser.provider,
        provider_user_id: testUser.provider_user_id,
      };

      const createdUser = await usersModel.createUser(newUser);

      testUser = { ...testUser, ...createdUser };
    });

    it("should create a new category", async () => {
      const newCategory: Partial<ICategory> = {
        title: testCategory.title,
        creator_id: testUser.user_id,
      };

      const createdCategory = await categoriesModel.createCategory(newCategory);

      testCategory = { ...testCategory, ...createdCategory };
    });

    it("should create a new article", async () => {
      const newArticle: Partial<IArticle> = {
        title: testArticle.title,
        content: testArticle.content,
        image: testArticle.image,
        category_id: testCategory.category_id,
        creator_id: testUser.user_id,
      };

      const createdArticle = await articlesModel.createArticle(newArticle);

      expect(createdArticle.title).toBe(newArticle.title);
      expect(createdArticle.content).toBe(newArticle.content);
      expect(createdArticle.image).toBe(newArticle.image);
      expect(createdArticle.category_id).toBe(newArticle.category_id);
      expect(createdArticle.creator_id).toBe(newArticle.creator_id);

      testArticle = { ...testArticle, ...createdArticle };
    });

    it("should save an article", async () => {
      await articlesModel.saveArticle(testUser.user_id, testArticle.article_id);
    });
  });

  /* ===== Read Operations ===== */
  describe("Read Operations", () => {
    it("should findArticleById", async () => {
      const article = await articlesModel.findArticleById(
        testArticle.article_id,
      );
      if (article) expect(article).toEqual(testArticle);
    });

    it("should findArticleByTitle", async () => {
      const article = await articlesModel.findArticleByTitle(testArticle.title);
      if (article) expect(article).toEqual(testArticle);
    });

    it("should getArticles", async () => {
      const articles = await articlesModel.getArticles(1, 100, 0);
      expect(articles).toBeInstanceOf(Array);
    });

    it("should getArticlesCount", async () => {
      const count = await articlesModel.getArticlesCount();
      expect(typeof count).toBe("number");
    });

    it("should searchArticles", async () => {
      const articles = await articlesModel.searchArticles(
        testArticle.title,
        1,
        100,
        0,
      );
      expect(articles).toBeInstanceOf(Array);
    });

    it("should getRandomArticles", async () => {
      const articles = await articlesModel.getRandomArticles(100);
      expect(articles).toBeInstanceOf(Array);
    });

    it("should getTrendingArticles", async () => {
      const articles = await articlesModel.getTrendingArticles(100);
      expect(articles).toBeInstanceOf(Array);
    });

    it("should getLatestArticles", async () => {
      const articles = await articlesModel.getLatestArticles(100);
      expect(articles).toBeInstanceOf(Array);
    });

    it("should getCategoryArticles", async () => {
      const articles = await articlesModel.getCategoryArticles(
        testCategory.category_id,
        1,
        100,
        0,
      );
      expect(articles).toBeInstanceOf(Array);
    });

    it("should getCreatedArticles", async () => {
      const articles = await articlesModel.getCreatedArticles(
        testUser.user_id,
        1,
        100,
        0,
      );
      expect(articles).toBeInstanceOf(Array);
    });

    it("should getSavedArticles", async () => {
      const articles = await articlesModel.getSavedArticles(
        testUser.user_id,
        1,
        100,
        0,
      );
      expect(articles).toBeInstanceOf(Array);
    });

    it("should isArticleSaved", async () => {
      const isSaved = await articlesModel.isArticleSaved(
        testUser.user_id,
        testArticle.article_id,
      );
      expect(typeof isSaved).toBe("boolean");
    });
  });

  /* ===== Update Operations ===== */
  describe("Update Operations", () => {
    it("should updateArticle", async () => {
      const updates: Partial<IArticle> = {
        title: `${testArticle.title}_Updated`,
        content: `${testArticle.content}_Updated`,
        image: `${testArticle.image}_Updated`,
        category_id: testCategory.category_id,
        creator_id: testUser.user_id,
      };

      const updatedArticle = await articlesModel.updateArticle(
        testArticle.article_id,
        updates,
      );

      expect(updatedArticle.title).toBe(updates.title);
      expect(updatedArticle.content).toBe(updates.content);
      expect(updatedArticle.image).toBe(updates.image);
      expect(updatedArticle.category_id).toBe(updates.category_id);
      expect(updatedArticle.creator_id).toBe(updates.creator_id);

      testArticle = { ...testArticle, ...updatedArticle };
    });
  });

  /* ===== Delete Operations ===== */
  describe("Delete Operations", () => {
    it("should unsaveArticle", async () => {
      await articlesModel.unsaveArticle(
        testUser.user_id,
        testArticle.article_id,
      );
    });

    it("should deleteArticle", async () => {
      await articlesModel.deleteArticle(testArticle.article_id);
    });
  });
});
