import { IAuthor, IAuthorPermissions, UserFields } from "@/types/entitiesTypes";

export interface AuthorsDao {
  /* ===== Create Operations ===== */

  // Creates an existing author's permissions by ID
  createAuthorPermissions(
    authorId: IAuthor["user_id"],
    authorPermissions: IAuthorPermissions,
  ): Promise<IAuthorPermissions>;

  /* ===== Read Operations ===== */

  // Finds a author by ID, with specific fields to select
  findAuthorById(
    authorId: IAuthor["user_id"],
    selectedFields?: UserFields[],
  ): Promise<IAuthor | null>;

  // Retrieves multiple authors with optional order, limit, skip, and selected fields
  getAuthors(
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: UserFields[],
  ): Promise<IAuthor[]>;

  // Get the total count of authors
  getAuthorsCount(): Promise<number>;

  // Searches for authors based on a search key, with optional order, limit, skip, and selected fields
  searchAuthors(
    searchKey: string,
    order?: number,
    limit?: number,
    skip?: number,
    selectedFields?: UserFields[],
  ): Promise<IAuthor[]>;

  /* ===== Update Operations ===== */

  // Updates an existing author's permissions by ID
  updateAuthorPermissions(
    authorId: IAuthor["user_id"],
    authorPermissions: IAuthorPermissions,
  ): Promise<IAuthorPermissions>;

  /* ===== Delete Operations ===== */

  // Deletes an existing author's permissions by ID
  deleteAuthorPermissions(authorId: IAuthor["user_id"]): Promise<void>;
}
