import dotenv from "dotenv";

import {
  IUser,
  IUserAvatar,
  IUserResetPasswordToken,
  IUserVerificationToken,
} from "@shared/types/entitiesTypes";

import { connectDB, disconnectDB, usersModel } from "../../../../database";
import { ROLES_LIST } from "../../../../utils/rolesList";

dotenv.config();

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
 * Integration tests for the usersModel.
 *
 * This suite tests the create, read, update, and delete operations for user management.
 */

/**
 * Test data setup.
 */
let testUser: IUser = {
  user_id: "testUser.UUID",
  name: "testUser.name",
  email: "testUser.email",
  password: "testUser.password",
  is_verified: true,
  role: ROLES_LIST.User,
  created_at: "",
  updated_at: "",
  provider: "testUser.provider",
  provider_user_id: "testUser.provider_user_id",
};
let testVerificationToken: IUserVerificationToken["verification_token"] =
  "verificationToken";
let testResetPasswordToken: IUserResetPasswordToken["reset_password_token"] =
  "resetPasswordToken";
let testAvatar: IUserAvatar["avatar"] = "avatar";

describe("usersModel Integration Tests", () => {
  /* ===== Create Operations ===== */
  describe("Create Operations", () => {
    it("should create a normal new user", async () => {
      const newUser: Partial<IUser> = {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        role: testUser.role,
        is_verified: testUser.is_verified,
      };

      const createdUser = await usersModel.createUser(newUser);

      expect(createdUser.name).toBe(newUser.name);
      expect(createdUser.email).toBe(newUser.email);
      expect(createdUser.password).toBe(newUser.password);
      expect(createdUser.role).toBe(newUser.role);
      expect(createdUser.is_verified).toBe(newUser.is_verified);
    });

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

      // OAuth createdUser should have all fields in testUser
      for (const key in testUser) {
        expect(createdUser).toHaveProperty(key);
      }

      expect(createdUser.name).toBe(newUser.name);
      expect(createdUser.email).toBe(newUser.email);
      expect(createdUser.password).toBe(newUser.password);
      expect(createdUser.role).toBe(newUser.role);
      expect(createdUser.is_verified).toBe(newUser.is_verified);
      expect(createdUser.provider).toBe(newUser.provider);
      expect(createdUser.provider_user_id).toBe(newUser.provider_user_id);

      testUser = { ...testUser, ...createdUser };
    });
  });

  /* ===== Read Operations ===== */
  describe("Read Operations", () => {
    it("should findUserById", async () => {
      const user = await usersModel.findUserById(testUser.user_id);
      if (user) expect(user).toEqual(testUser);
    });

    it("should findUserByEmail", async () => {
      const user = await usersModel.findUserByEmail(testUser.email);
      if (user) expect(user).toEqual(testUser);
    });

    it("should findUserByOAuth", async () => {
      const user = await usersModel.findUserByOAuth(
        testUser.provider,
        testUser.provider_user_id,
      );
      if (user) expect(user).toEqual(testUser);
    });

    it("should findUserByVerificationToken", async () => {
      const user = await usersModel.findUserByVerificationToken(
        testVerificationToken,
      );
      if (user) expect(user).toEqual(testUser);
    });

    it("should findUserByResetPasswordToken", async () => {
      const user = await usersModel.findUserByResetPasswordToken(
        testResetPasswordToken,
      );
      if (user) expect(user).toEqual(testUser);
    });

    it("should findUserAvatar", async () => {
      const avatar = await usersModel.findUserAvatar(testUser.user_id);
      if (avatar) expect(avatar).toBe(testAvatar);
    });

    it("should getUsers", async () => {
      const users = await usersModel.getUsers(1, 100, 0);
      expect(users).toBeInstanceOf(Array);
    });

    it("should getUsersCount", async () => {
      const count = await usersModel.getUsersCount();
      expect(typeof count).toBe("number");
    });

    it("should searchUsers", async () => {
      const users = await usersModel.searchUsers(testUser.name, 1, 100, 0);
      expect(users).toBeInstanceOf(Array);
    });
  });

  /* ===== Update Operations ===== */
  describe("Update Operations", () => {
    it("should updateUser", async () => {
      const updates: Partial<IUser> = {
        name: `${testUser.name}_Updated`,
        email: `${testUser.email}_Updated`,
        password: `${testUser.password}_Updated`,
      };

      const updatedUser = await usersModel.updateUser(
        testUser.user_id,
        updates,
      );

      expect(updatedUser.name).toBe(updates.name);
      expect(updatedUser.email).toBe(updates.email);
      expect(updatedUser.password).toBe(updates.password);

      testUser = { ...testUser, ...updatedUser };
    });

    it("should setVerificationToken", async () => {
      await usersModel.setVerificationToken(
        testUser.user_id,
        testVerificationToken,
      );
    });

    it("should setResetPasswordToken", async () => {
      await usersModel.setResetPasswordToken(
        testUser.user_id,
        testVerificationToken,
      );
    });

    it("should setAvatar", async () => {
      await usersModel.setAvatar(testUser.user_id, testAvatar);
    });
  });

  /* ===== Delete Operations ===== */
  describe("Delete Operations", () => {
    it("should deleteUser", async () => {
      await usersModel.deleteUser(testUser.user_id);
    });

    it("should deleteStaleUnverifiedUsers", async () => {
      const deletedCount = await usersModel.deleteStaleUnverifiedUsers("1 day");
      expect(typeof deletedCount).toBe("number");
    });
  });
});
