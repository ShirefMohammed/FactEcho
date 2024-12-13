import { IUser, IUserAvatar, UserFields } from "@shared/types/entitiesTypes";

import { ROLES_LIST } from "../../../utils/rolesList";
import { UsersDao } from "../../dao/usersDao";
import { pool } from "../connectToPostgreSQL";

/**
 * Model for performing user-related database operations.
 */
export class UsersModel implements UsersDao {
  private userFields: UserFields[] = [
    "user_id",
    "name",
    "email",
    "password",
    "is_verified",
    "role",
    "created_at",
    "updated_at",
  ];

  private userOAuthFields: UserFields[] = ["provider", "provider_user_id"];

  /**
   * Filters selected fields to include only valid fields for the `users` table
   * and prefixes them with the given table alias.
   * @param tableAlias - The table alias or name to prefix the fields with.
   * @param selectedFields - Optional array of fields to filter.
   * @returns A comma-separated string of valid selected fields prefixed with the table alias.
   */
  private getUserSelectedFieldsWithAlias(
    tableAlias: string,
    selectedFields?: UserFields[],
  ): string {
    if (!selectedFields || selectedFields.length === 0) {
      // Return all fields from the `users` table with the provided alias
      return this.userFields
        .map((field) => `${tableAlias}.${field}`)
        .join(", ");
    }

    const selectedFieldsAfterFilter = selectedFields.filter((field) =>
      this.userFields.includes(field),
    );

    const prefix = tableAlias ? `${tableAlias}.` : "";
    return selectedFieldsAfterFilter
      .map((field) => `${prefix}${field}`)
      .join(", ");
  }

  /**
   * Filters selected fields to include only valid fields for the `users_oauth` table
   * and prefixes them with the given table alias.
   * @param tableAlias - The table alias or name to prefix the fields with.
   * @param selectedFields - Optional array of fields to filter.
   * @returns A comma-separated string of valid selected fields prefixed with the table alias.
   */
  private getUserOAuthSelectedFieldsWithAlias(
    tableAlias: string,
    selectedFields?: UserFields[],
  ): string {
    if (!selectedFields || selectedFields.length === 0) {
      // Return all fields from the `users_oauth` table with the provided alias
      return this.userOAuthFields
        .map((field) => `${tableAlias}.${field}`)
        .join(", ");
    }

    const selectedFieldsAfterFilter = selectedFields.filter((field) =>
      this.userOAuthFields.includes(field),
    );

    const prefix = tableAlias ? `${tableAlias}.` : "";
    return selectedFieldsAfterFilter
      .map((field) => `${prefix}${field}`)
      .join(", ");
  }

  /**
   * Finds a user by their ID, including data from the `users` and `users_oauth` tables.
   * @param userId - The unique identifier of the user.
   * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
   * @returns The user object if found, otherwise null.
   */
  async findUserById(
    userId: string,
    selectedFields?: UserFields[],
  ): Promise<IUser | null> {
    try {
      // Filter and prefix selected fields for `users` and `users_oauth` tables
      const userFields = this.getUserSelectedFieldsWithAlias(
        "u",
        selectedFields,
      );
      const userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias(
        "uo",
        selectedFields,
      );

      // Combine fields for the SELECT clause
      const selectFields = [userFields, userOAuthFields]
        .filter(Boolean)
        .join(", ");

      // Construct the query to join `users` and `users_oauth`
      const query = `
        SELECT ${selectFields} 
        FROM users u
        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id
        WHERE u.user_id = $1
      `;

      const { rows } = await pool.query(query, [userId]);
      return rows[0];
    } catch (err) {
      console.error("Error in findUserById:", err);
      throw err;
    }
  }

  /**
   * Finds a user by their email, including data from the `users` and `users_oauth` tables.
   * @param email - The user's email address.
   * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
   * @returns The user object if found, otherwise null.
   */
  async findUserByEmail(
    email: string,
    selectedFields?: UserFields[],
  ): Promise<IUser | null> {
    try {
      // Filter and prefix selected fields for `users` and `users_oauth` tables
      const userFields = this.getUserSelectedFieldsWithAlias(
        "u",
        selectedFields,
      );
      const userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias(
        "uo",
        selectedFields,
      );

      // Combine fields for the SELECT clause
      const selectFields = [userFields, userOAuthFields]
        .filter(Boolean)
        .join(", ");

      // Construct the query to join `users` and `users_oauth`
      const query = `
        SELECT ${selectFields} 
        FROM users u
        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id
        WHERE u.email = $1
      `;

      const { rows } = await pool.query(query, [email]);
      return rows[0];
    } catch (err) {
      console.error("Error in findUserByEmail:", err);
      throw err;
    }
  }

  /**
   * Finds a user by OAuth, including data from the `users` and `users_oauth` tables.
   * @param provider - The users_oauth provider.
   * @param providerUserId - The users_oauth providerUserId.
   * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
   * @returns The user object if found, otherwise null.
   */
  async findUserByOAuth(
    provider: string,
    providerUserId: string,
    selectedFields?: UserFields[],
  ): Promise<IUser | null> {
    try {
      // Filter and prefix selected fields for `users` and `users_oauth` tables
      const userFields = this.getUserSelectedFieldsWithAlias(
        "u",
        selectedFields,
      );
      const userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias(
        "uo",
        selectedFields,
      );

      // Combine fields for the SELECT clause
      const selectFields = [userFields, userOAuthFields]
        .filter(Boolean)
        .join(", ");

      // Construct the query to join `users`, `users_oauth`
      const query = `
        SELECT ${selectFields}
        FROM users u
        INNER JOIN users_oauth uo ON u.user_id = uo.user_id
        WHERE uo.provider = $1 AND uo.provider_user_id = $2
      `;

      const { rows } = await pool.query(query, [provider, providerUserId]);
      return rows[0];
    } catch (err) {
      console.error("Error in findUserByOAuth:", err);
      throw err;
    }
  }

  /**
   * Retrieves the avatar for a user.
   * @param userId - The unique identifier of the user.
   * @returns The avatar URL if found, otherwise null.
   */
  async findUserAvatar(userId: string): Promise<IUserAvatar["avatar"] | null> {
    try {
      const query = `SELECT avatar FROM users_avatars WHERE user_id = $1`;
      const { rows } = await pool.query(query, [userId]);
      return rows[0]?.avatar;
    } catch (err) {
      console.error("Error in findUserByEmail:", err);
      throw err;
    }
  }

  /**
   * Finds a user by their verification token, including data from the `users` and `users_oauth` tables.
   * @param verificationToken - The user's verification token.
   * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
   * @returns The user object if found, otherwise null.
   */
  async findUserByVerificationToken(
    verificationToken: string,
    selectedFields?: UserFields[],
  ): Promise<IUser | null> {
    try {
      // Filter and prefix selected fields for `users` and `users_oauth` tables
      const userFields = this.getUserSelectedFieldsWithAlias(
        "u",
        selectedFields,
      );
      const userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias(
        "uo",
        selectedFields,
      );

      // Combine fields for the SELECT clause
      const selectFields = [userFields, userOAuthFields]
        .filter(Boolean)
        .join(", ");

      // Construct the query to join `users`, `users_oauth`, and `users_verification_tokens`
      const query = `
        SELECT ${selectFields}
        FROM users u
        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id
        JOIN users_verification_tokens uvt ON u.user_id = uvt.user_id
        WHERE uvt.verification_token = $1
      `;

      const { rows } = await pool.query(query, [verificationToken]);
      return rows[0];
    } catch (err) {
      console.error("Error in findUserByVerificationToken:", err);
      throw err;
    }
  }

  /**
   * Finds a user by their reset password token, including data from the `users` and `users_oauth` tables.
   * @param resetPasswordToken - The reset password token associated with the user.
   * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
   * @returns The user object if found, otherwise null.
   */
  async findUserByResetPasswordToken(
    resetPasswordToken: string,
    selectedFields?: UserFields[],
  ): Promise<IUser | null> {
    try {
      // Filter and prefix selected fields for `users` and `users_oauth` tables
      const userFields = this.getUserSelectedFieldsWithAlias(
        "u",
        selectedFields,
      );
      const userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias(
        "uo",
        selectedFields,
      );

      // Combine fields for the SELECT clause
      const selectFields = [userFields, userOAuthFields]
        .filter(Boolean)
        .join(", ");

      // Construct the query to join `users`, `users_oauth`, and `users_reset_password_tokens`
      const query = `
        SELECT ${selectFields}
        FROM users u
        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id
        JOIN users_reset_password_tokens urpt ON u.user_id = urpt.user_id
        WHERE urpt.reset_password_token = $1
      `;

      const { rows } = await pool.query(query, [resetPasswordToken]);
      return rows[0];
    } catch (err) {
      console.error("Error in findUserByResetPasswordToken:", err);
      throw err;
    }
  }

  /**
   * Creates a new user and inserts into both `users` and `users_oauth` tables within a transaction.
   * @param user - The user data to create a new record.
   * @returns void
   */
  async createUser(user: Partial<IUser>): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert into `users` table
      const insertUserQuery = `
        INSERT INTO users (name, email, password, role, is_verified)
        VALUES ($1, $2, $3, $4, $5) RETURNING user_id
      `;
      const res = await client.query(insertUserQuery, [
        user.name,
        user.email,
        user.password,
        ROLES_LIST.User,
        Boolean(user.is_verified),
      ]);

      if (user.provider || user.provider_user_id) {
        const userId = res.rows[0].user_id;

        // Insert into `users_oauth` table (assuming OAuth provider data is available)
        const insertOAuthQuery = `
          INSERT INTO users_oauth (user_id, provider, provider_user_id)
          VALUES ($1, $2, $3)
        `;
        await client.query(insertOAuthQuery, [
          userId,
          user.provider,
          user.provider_user_id,
        ]);
      }

      // Commit the transaction
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error in createUser:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Updates user information by their ID.
   * @param userId - The unique identifier of the user.
   * @param user - Partial user data to update.
   * @returns void
   */
  async updateUser(userId: string, user: Partial<IUser>): Promise<void> {
    try {
      const fields = Object.keys(user)
        .filter((key) => user[key as keyof IUser] !== undefined)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");

      if (!fields) return;

      // No need to update 'updated_at' here because the trigger will handle it
      const query = `UPDATE users SET ${fields} WHERE user_id = $1`;
      await pool.query(query, [userId, ...Object.values(user)]);
    } catch (err) {
      console.error("Error in updateUser:", err);
      throw err;
    }
  }

  /**
   * Sets or deletes a verification token for a user.
   * @param userId - The unique identifier of the user.
   * @param verificationToken - The verification token; pass an empty string to delete.
   * @returns void
   */
  async setVerificationToken(
    userId: string,
    verificationToken: string,
  ): Promise<void> {
    try {
      if (verificationToken === "") {
        await pool.query(
          `DELETE FROM users_verification_tokens WHERE user_id = $1`,
          [userId],
        );
        return;
      }

      const query = `
        INSERT INTO users_verification_tokens (user_id, verification_token) 
        VALUES ($1, $2)
        ON CONFLICT (user_id) DO UPDATE SET verification_token = $2
      `;
      await pool.query(query, [userId, verificationToken]);
    } catch (err) {
      console.error("Error in setVerificationToken:", err);
      throw err;
    }
  }

  /**
   * Sets or deletes a reset password token for a user.
   * @param userId - The unique identifier of the user.
   * @param resetPasswordToken - The reset password token; pass an empty string to delete.
   * @returns void
   */
  async setResetPasswordToken(
    userId: string,
    resetPasswordToken: string,
  ): Promise<void> {
    try {
      if (resetPasswordToken === "") {
        await pool.query(
          `DELETE FROM users_reset_password_tokens WHERE user_id = $1`,
          [userId],
        );
        return;
      }

      const query = `
        INSERT INTO users_reset_password_tokens (user_id, reset_password_token) 
        VALUES ($1, $2)
        ON CONFLICT (user_id) DO UPDATE SET reset_password_token = $2
      `;
      await pool.query(query, [userId, resetPasswordToken]);
    } catch (err) {
      console.error("Error in setResetPasswordToken:", err);
      throw err;
    }
  }

  /**
   * Sets or deletes the avatar for a user.
   * @param userId - The unique identifier of the user.
   * @param avatar - The avatar URL; pass an empty string to delete.
   * @returns void
   */
  async setAvatar(userId: string, avatar: string): Promise<void> {
    try {
      if (avatar === "") {
        await pool.query(`DELETE FROM users_avatars WHERE user_id = $1`, [
          userId,
        ]);
        return;
      }

      const query = `
        INSERT INTO users_avatars (user_id, avatar) 
        VALUES ($1, $2)
        ON CONFLICT (user_id) DO UPDATE SET avatar = $2
      `;
      await pool.query(query, [userId, avatar]);
    } catch (err) {
      console.error("Error in setAvatar:", err);
      throw err;
    }
  }

  /**
   * Deletes a user by their ID.
   * @param userId - The unique identifier of the user to delete.
   * @returns void
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      // Only delete the user from the 'users' table, cascading will take care of the rest
      await pool.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
    } catch (err) {
      console.error("Error in deleteUser:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of users with optional sorting, pagination, and selected fields.
   * Includes OAuth details if they exist.
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional Maximum number of users to retrieve.
   * @param skip - Optional Number of users to skip for pagination.
   * @param selectedFields - Optional array of fields to return; defaults to all fields from both tables.
   * @returns Array of user objects with OAuth details.
   */
  async getUsers(
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: UserFields[],
  ): Promise<IUser[]> {
    try {
      // Filter and prefix selected fields for `users` and `users_oauth` tables
      const userFields = this.getUserSelectedFieldsWithAlias(
        "u",
        selectedFields,
      );
      const oauthFields = this.getUserOAuthSelectedFieldsWithAlias(
        "uo",
        selectedFields,
      );

      // Combine fields for the SELECT clause
      const selectFields = [userFields, oauthFields].filter(Boolean).join(", ");

      // Prepare the base query with a LEFT JOIN to include OAuth details
      let query = `
        SELECT ${selectFields}
        FROM users u
        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id
        ORDER BY u.created_at ${order === -1 ? "DESC" : "ASC"}
      `;

      // Add LIMIT and OFFSET conditionally
      if (limit) query += ` LIMIT $1`;
      if (skip) query += ` OFFSET $2`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [];
      if (limit) params.push(limit);
      if (skip) params.push(skip);

      // Execute the query with the dynamically constructed parameters
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in getUsers:", err);
      throw err;
    }
  }

  /**
   * Retrieves the total count of users from the records_count table.
   * Ensures fast retrieval without performing a direct count on the users table.
   * @returns Total number of users as a number.
   */
  async getUsersCount(): Promise<number> {
    try {
      const query = `SELECT record_count AS total_users FROM records_count WHERE table_name = 'users'`;
      const { rows } = await pool.query(query);

      // Return the count value, ensuring it's parsed as a number
      return rows.length ? Number(rows[0].total_users) : 0;
    } catch (err) {
      console.error("Error in getUsersCount:", err);
      throw err;
    }
  }

  /**
   * Searches for users by a keyword in their name or email.
   * Includes OAuth details if they exist.
   * @param searchKey - The keyword to search for in user names or emails.
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional maximum number of users to retrieve.
   * @param skip - Optional number of users to skip for pagination.
   * @param selectedFields - Optional array of fields to return; defaults to all fields.
   * @returns Array of user objects matching the search criteria with OAuth details.
   */
  async searchUsers(
    searchKey: string,
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: UserFields[],
  ): Promise<IUser[]> {
    try {
      // Filter and prefix selected fields for `users` and `users_oauth` tables
      const userFields = this.getUserSelectedFieldsWithAlias(
        "u",
        selectedFields,
      );
      const oauthFields = this.getUserOAuthSelectedFieldsWithAlias(
        "uo",
        selectedFields,
      );

      // Combine fields for the SELECT clause
      const selectFields = [userFields, oauthFields].filter(Boolean).join(", ");

      // Construct the base query with a LEFT JOIN to include OAuth details and search by name or email
      let query = `
        SELECT ${selectFields}
        FROM users u
        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id
        WHERE u.name ILIKE $1 OR u.email ILIKE $1
        ORDER BY u.created_at ${order === -1 ? "DESC" : "ASC"}
      `;

      // Add LIMIT and OFFSET conditionally
      if (limit) query += ` LIMIT $2`;
      if (skip) query += ` OFFSET $3`;

      // Prepare the parameters array based on provided arguments
      const params: (string | number)[] = [`%${searchKey}%`];
      if (limit) params.push(limit);
      if (skip) params.push(skip);

      // Execute the query with the dynamically constructed parameters
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error("Error in searchUsers:", err);
      throw err;
    }
  }

  /**
   * Deletes unverified user accounts that are older than a specified interval.
   * @param interval - The time interval (e.g., '30 days') to determine stale accounts.
   * @example
   * deleteStaleUnverifiedUsers('1 day') deletes all unverified accounts older than 7 days.
   * @returns Logs the number of deleted accounts to the console.
   */
  async deleteStaleUnverifiedUsers(interval: string): Promise<void> {
    try {
      const query = `
        DELETE FROM users 
        WHERE is_verified = false AND created_at < NOW() - $1::INTERVAL;
      `;
      const { rowCount } = await pool.query(query, [interval]);
      console.log(
        `${rowCount} unverified accounts deleted (older than ${interval}).`,
      );
    } catch (err) {
      console.error("Error in deleteStaleUnverifiedUsers:", err);
      throw err;
    }
  }
}
