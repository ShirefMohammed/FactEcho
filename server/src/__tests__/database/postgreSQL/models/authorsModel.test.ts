import dotenv from "dotenv";

import {
  IAuthor,
  IAuthorPermissions,
  IUser,
} from "@shared/types/entitiesTypes";

import {
  authorsModel,
  connectDB,
  disconnectDB,
  usersModel,
} from "../../../../database";
import { ROLES_LIST } from "../../../../utils/rolesList";

dotenv.config();

/**
 * Integration tests for the authorsModel.
 *
 * This suite tests the create, read, update, and delete operations for author management.
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
let testAuthor: IAuthor = {
  user_id: "testAuthor.UUID",
  name: "testAuthor.name",
  email: "testAuthor.email",
  password: "testAuthor.password",
  is_verified: true,
  role: ROLES_LIST.Author,
  created_at: "",
  updated_at: "",
  provider: "testAuthor.provider",
  provider_user_id: "testAuthor.provider_user_id",
  avatar: "",
  permissions: {
    user_id: "testAuthor.permissions.UUID",
    create: true,
    update: true,
    delete: true,
  },
};

describe("authorsModel Integration Tests", () => {
  /* ===== Create Operations ===== */
  describe("Create Operations", () => {
    it("should create a new user with OAuth data", async () => {
      const newUser: Partial<IUser> = {
        name: testAuthor.name,
        email: `${testAuthor.email}_OAuth`,
        password: testAuthor.password,
        role: testAuthor.role,
        is_verified: testAuthor.is_verified,
        provider: testAuthor.provider,
        provider_user_id: testAuthor.provider_user_id,
      };

      const createdUser = await usersModel.createUser(newUser);

      testAuthor = { ...testAuthor, ...createdUser };
    });

    it("should create a new author permissions", async () => {
      const newAuthorPermissions: IAuthorPermissions = {
        user_id: testAuthor.user_id,
        create: true,
        update: true,
        delete: true,
      };

      const createdAuthorPermissions =
        await authorsModel.createAuthorPermissions(
          testAuthor.user_id,
          newAuthorPermissions,
        );

      expect(createdAuthorPermissions.user_id).toBe(
        newAuthorPermissions.user_id,
      );
      expect(createdAuthorPermissions.create).toBe(newAuthorPermissions.create);
      expect(createdAuthorPermissions.update).toBe(newAuthorPermissions.update);
      expect(createdAuthorPermissions.delete).toBe(newAuthorPermissions.delete);

      testAuthor = { ...testAuthor, permissions: createdAuthorPermissions };
    });
  });

  /* ===== Read Operations ===== */
  describe("Read Operations", () => {
    it("should findAuthorById", async () => {
      const author = await authorsModel.findAuthorById(testAuthor.user_id);
      if (author) expect(author).toEqual(testAuthor);
    });

    it("should getAuthors", async () => {
      const authors = await authorsModel.getAuthors(1, 100, 0);
      expect(authors).toBeInstanceOf(Array);
    });

    it("should getAuthorsCount", async () => {
      const count = await authorsModel.getAuthorsCount();
      expect(typeof count).toBe("number");
    });

    it("should searchAuthors", async () => {
      const authors = await authorsModel.searchAuthors(
        testAuthor.name,
        1,
        100,
        0,
      );
      expect(authors).toBeInstanceOf(Array);
    });
  });

  /* ===== Update Operations ===== */
  describe("Update Operations", () => {
    it("should updateAuthorPermissions", async () => {
      const updates: IAuthorPermissions = {
        user_id: testAuthor.user_id,
        create: true,
        update: true,
        delete: true,
      };

      const updatedAuthorPermissions =
        await authorsModel.updateAuthorPermissions(testAuthor.user_id, updates);

      expect(updatedAuthorPermissions.create).toBe(updates.create);
      expect(updatedAuthorPermissions.update).toBe(updates.update);
      expect(updatedAuthorPermissions.delete).toBe(updates.delete);

      testAuthor = { ...testAuthor, permissions: updatedAuthorPermissions };
    });
  });

  /* ===== Delete Operations ===== */
  describe("Delete Operations", () => {
    it("should deleteAuthorPermissions", async () => {
      await authorsModel.deleteAuthorPermissions(testAuthor.user_id);
    });
  });
});
