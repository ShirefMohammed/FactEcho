import dotenv from "dotenv";

import { ICategory, IUser } from "@shared/types/entitiesTypes";

import { ROLES_LIST } from "../../../..//utils/rolesList";
import {
  categoriesModel,
  connectDB,
  disconnectDB,
  usersModel,
} from "../../../../database";

dotenv.config();

/**
 * Integration tests for the categoriesModel.
 *
 * This suite tests the create, read, update, and delete operations for category management.
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
  name: "testUser.testCategory.name",
  email: "testUser.testCategory.email",
  password: "testUser.testCategory.password",
  is_verified: true,
  role: ROLES_LIST.Admin,
  created_at: "",
  updated_at: "",
  provider: "testUser.testCategory.provider",
  provider_user_id: "testUser.testCategory.provider_user_id",
};
let testCategory: ICategory = {
  category_id: "testCategory.UUID",
  title: "testCategory.title",
  created_at: "",
  updated_at: "",
  creator_id: "testCategory.UUID",
};

describe("categoriesModel Integration Tests", () => {
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

      expect(createdCategory.title).toBe(newCategory.title);
      expect(createdCategory.creator_id).toBe(newCategory.creator_id);

      testCategory = { ...testCategory, ...createdCategory };
    });
  });

  /* ===== Read Operations ===== */
  describe("Read Operations", () => {
    it("should findCategoryById", async () => {
      const category = await categoriesModel.findCategoryById(
        testCategory.category_id,
      );
      if (category) expect(category).toEqual(testCategory);
    });

    it("should findCategoryByTitle", async () => {
      const category = await categoriesModel.findCategoryByTitle(
        testCategory.title,
      );
      if (category) expect(category).toEqual(testCategory);
    });

    it("should getCategories", async () => {
      const categories = await categoriesModel.getCategories(1, 100, 0);
      expect(categories).toBeInstanceOf(Array);
    });

    it("should getCategoriesCount", async () => {
      const count = await categoriesModel.getCategoriesCount();
      expect(typeof count).toBe("number");
    });

    it("should searchCategories", async () => {
      const categories = await categoriesModel.searchCategories(
        testCategory.title,
        1,
        100,
        0,
      );
      expect(categories).toBeInstanceOf(Array);
    });
  });

  /* ===== Update Operations ===== */
  describe("Update Operations", () => {
    it("should updateCategory", async () => {
      const updates: Partial<ICategory> = {
        title: `${testCategory.title}_Updated`,
        creator_id: testCategory.creator_id,
      };

      const updatedCategory = await categoriesModel.updateCategory(
        testCategory.category_id,
        updates,
      );

      expect(updatedCategory.title).toBe(updates.title);
      expect(updatedCategory.creator_id).toBe(updates.creator_id);

      testCategory = { ...testCategory, ...updatedCategory };
    });
  });

  /* ===== Delete Operations ===== */
  describe("Delete Operations", () => {
    it("should deleteCategory", async () => {
      await categoriesModel.deleteCategory(testCategory.category_id);
    });
  });
});
