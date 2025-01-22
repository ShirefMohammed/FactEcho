import {
  AuthorFields,
  IAuthor,
  IAuthorPermissions,
  UserFields,
} from "@shared/types/entitiesTypes";

import { usersModel } from "../..";
import { ROLES_LIST } from "../../../utils/rolesList";
import { AuthorsDao } from "../../dao/authorsDao";
import { pool } from "../setup/connectToPostgreSQL";

/**
 * Model for performing author-related database operations.
 */
export class AuthorsModel implements AuthorsDao {
  /* ===== Fields for users and users_oauth ===== */

  private userFields: AuthorFields[] = [
    "user_id",
    "name",
    "email",
    "password",
    "is_verified",
    "role",
    "created_at",
    "updated_at",
  ];

  private userOAuthFields: AuthorFields[] = ["provider", "provider_user_id"];

  /* ===== Private Helpers ===== */

  /**
   * Filters selected fields to include only valid fields for the `users` table
   * and prefixes them with the given table alias.
   *
   * If no selectedFields provided return all fields from the `users` table with the provided alias.
   *
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

    return selectedFieldsAfterFilter
      .map((field) => `${tableAlias}.${field}`)
      .join(", ");
  }

  /**
   * Filters selected fields to include only valid fields for the `users_oauth` table
   * and prefixes them with the given table alias.
   *
   * If no selectedFields provided return all fields from the `users_oauth` table with the provided alias.
   *
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

    return selectedFieldsAfterFilter
      .map((field) => `${tableAlias}.${field}`)
      .join(", ");
  }

  /* ===== Create Operations ===== */

  /**
   * Creates an author's permissions.
   *
   * @param authorId - The unique identifier of the author.
   * @param authorPermissions - The permissions data to create.
   * @returns created authorPermissions.
   */
  async createAuthorPermissions(
    authorId: IAuthor["user_id"],
    authorPermissions: IAuthorPermissions,
  ): Promise<IAuthorPermissions> {
    try {
      const query = `
        INSERT INTO author_permissions (user_id, "create", "update", "delete") 
        VALUES ($1, $2, $3, $4) RETURNING *
      `;

      const { rows } = await pool.query(query, [
        authorId,
        Boolean(authorPermissions.create),
        Boolean(authorPermissions.update),
        Boolean(authorPermissions.delete),
      ]);

      return rows[0];
    } catch (err) {
      console.error("Error in createAuthorPermissions:", err);
      throw err;
    }
  }

  /* ===== Read Operations ===== */

  /**
   * Finds an author by their ID, including user details, avatar, and permissions.
   *
   * If no selectedFields provided it will return all author fields form `users` table
   *
   * @param authorId - The unique identifier of the author.
   * @param selectedFields - Optional array of fields to return. Avatar and permissions will always be included in the result.
   * @returns The author object if found, otherwise null.
   */
  async findAuthorById(
    authorId: IAuthor["user_id"],
    selectedFields?: UserFields[],
  ): Promise<IAuthor | null> {
    try {
      // Retrieve user details using usersModel's findUserById method
      const authorUserData = await usersModel.findUserById(
        authorId,
        selectedFields,
      );

      if (!authorUserData) return null; // If user data is not found, return null

      // Retrieve the author's avatar
      const avatar = await usersModel.findUserAvatar(authorId);

      // Retrieve the author's permissions
      const permissionsQuery = `
        SELECT *
        FROM author_permissions
        WHERE user_id = $1
      `;
      const { rows: permissionsRows } = await pool.query(permissionsQuery, [
        authorId,
      ]);
      const permissions = permissionsRows[0] || {
        create: false,
        update: false,
        delete: false,
      };

      // Construct the IAuthor object
      const author: IAuthor = {
        ...authorUserData,
        avatar: avatar || "",
        permissions: permissions,
      };

      return author;
    } catch (err) {
      console.error("Error in findAuthorById:", err);
      throw err;
    }
  }

  /**
   * Retrieves a list of authors with optional sorting, pagination, and selected fields.
   *
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional maximum number of authors to retrieve.
   * @param skip - Optional number of authors to skip for pagination.
   * @param selectedFields - Optional array of fields to return. Avatar, permissions, and OAuth data will always be included in the result.
   * @returns Array of author objects.
   */
  async getAuthors(
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: UserFields[],
  ): Promise<IAuthor[]> {
    try {
      // Prepare the fields for users, users_oauth, and author permissions
      const userFields = this.getUserSelectedFieldsWithAlias(
        "u",
        selectedFields,
      );
      const userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias(
        "uo",
        selectedFields,
      );

      // Construct the query to retrieve user details, avatars, permissions, and OAuth data
      let query = `
        SELECT ${userFields}, ${userOAuthFields}, ua.avatar, ap."create", ap."update", ap."delete"
        FROM users u
        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id
        LEFT JOIN users_avatars ua ON u.user_id = ua.user_id
        LEFT JOIN author_permissions ap ON u.user_id = ap.user_id
        WHERE u.role = $1
        ORDER BY u.created_at ${order === -1 ? "DESC" : "ASC"}
      `;

      // Add LIMIT and OFFSET conditionally
      if (limit) query += ` LIMIT $2`;
      if (skip) query += ` OFFSET $3`;

      // Add LIMIT and OFFSET conditionally
      const params: (string | number)[] = [ROLES_LIST.Author];
      if (limit) params.push(limit);
      if (skip) params.push(skip);

      // Execute the query to fetch user details, avatars, permissions, and OAuth data
      const { rows: userRows } = await pool.query(query, params);

      // Return the list of authors
      return userRows.map((userRow) => ({
        ...userRow,
        avatar: userRow.avatar,
        permissions: {
          create: userRow.create || false,
          update: userRow.update || false,
          delete: userRow.delete || false,
        },
      }));
    } catch (err) {
      console.error("Error in getAuthors:", err);
      throw err;
    }
  }

  /**
   * Retrieves the total count of authors by checking the users table where role is "Author".
   *
   * @returns Total count of authors as a number.
   */
  async getAuthorsCount(): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) AS total_count
        FROM users
        WHERE role = $1
      `;

      const { rows } = await pool.query(query, [ROLES_LIST.Author]);

      return Number(rows[0].total_count);
    } catch (err) {
      console.error("Error in getAuthorsCount:", err);
      throw err;
    }
  }

  /**
   * Searches for authors by a keyword in their name or email, including avatars, permissions, and OAuth data.
   *
   * If no selectedFields provided it will return all author fields form `users` table
   *
   * @param searchKey - The keyword to search for.
   * @param order - Sorting order (1 for ascending, -1 for descending). Defaults to ascending.
   * @param limit - Optional maximum number of authors to retrieve.
   * @param skip - Optional number of authors to skip for pagination.
   * @param selectedFields - Optional array of fields to return. Avatar, permissions, and OAuth data will always be included in the result.
   * @returns Array of author objects matching the search criteria.
   */
  async searchAuthors(
    searchKey: string,
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: UserFields[],
  ): Promise<IAuthor[]> {
    try {
      // Prepare the fields for users, users_oauth, and author permissions
      const userFields = this.getUserSelectedFieldsWithAlias(
        "u",
        selectedFields,
      );
      const userOAuthFields = this.getUserOAuthSelectedFieldsWithAlias(
        "uo",
        selectedFields,
      );

      // Construct the query to retrieve user details, avatars, permissions, and OAuth data
      let query = `
        SELECT ${userFields}, ${userOAuthFields}, ua.avatar, ap."create", ap."update", ap."delete"
        FROM users u
        LEFT JOIN users_oauth uo ON u.user_id = uo.user_id
        LEFT JOIN users_avatars ua ON u.user_id = ua.user_id
        LEFT JOIN author_permissions ap ON u.user_id = ap.user_id
        WHERE u.role = $1 AND (u.name ILIKE $2 OR u.email ILIKE $2)
        ORDER BY u.created_at ${order === -1 ? "DESC" : "ASC"}
      `;

      // Add LIMIT and OFFSET conditionally
      if (limit) query += ` LIMIT $3`;
      if (skip) query += ` OFFSET $4`;

      // Add LIMIT and OFFSET conditionally
      const params: (string | number)[] = [ROLES_LIST.Author, `%${searchKey}%`];
      if (limit) params.push(limit);
      if (skip) params.push(skip);

      // Execute the query to fetch user details, avatars, permissions, and OAuth data
      const { rows: userRows } = await pool.query(query, params);

      // Return the list of authors
      return userRows.map((userRow) => ({
        ...userRow,
        avatar: userRow.avatar,
        permissions: {
          create: userRow.create || false,
          update: userRow.update || false,
          delete: userRow.delete || false,
        },
      }));
    } catch (err) {
      console.error("Error in searchAuthors:", err);
      throw err;
    }
  }

  /* ===== Update Operations ===== */

  /**
   * Updates an author's permissions by ID.
   *
   * @param authorId - The unique identifier of the author.
   * @param authorPermissions - The permissions data to update.
   * @returns updated authorPermissions.
   */
  async updateAuthorPermissions(
    authorId: IAuthor["user_id"],
    authorPermissions: IAuthorPermissions,
  ): Promise<IAuthorPermissions> {
    try {
      const query = `
        UPDATE author_permissions 
        SET 
          "create" = $1, 
          "update" = $2, 
          "delete" = $3 
        WHERE user_id = $4
        RETURNING *
    `;

      const { rows } = await pool.query(query, [
        Boolean(authorPermissions.create),
        Boolean(authorPermissions.update),
        Boolean(authorPermissions.delete),
        authorId,
      ]);

      return rows[0];
    } catch (err) {
      console.error("Error in updateAuthorPermissions:", err);
      throw err;
    }
  }

  /* ===== Delete Operations ===== */

  /**
   * Deletes an author's permissions by ID.
   *
   * @param authorId - The unique identifier of the author.
   * @returns void
   */
  async deleteAuthorPermissions(authorId: string): Promise<void> {
    try {
      await pool.query(`DELETE FROM author_permissions WHERE user_id = $1`, [
        authorId,
      ]);
    } catch (err) {
      console.error("Error in deleteAuthorPermissions:", err);
      throw err;
    }
  }
}
