import {
  IAuthor,
  IAuthorPermissions,
  UserFields,
} from "@shared/types/entitiesTypes";

export interface AuthorsDao {
  // Finds a author by ID, with specific fields to select
  findAuthorById(
    authorId: string,
    selectedFields?: UserFields[],
  ): Promise<IAuthor | null>;

  // Creates an existing author's permissions by ID
  createAuthorPermissions(
    authorId: string,
    authorPermissions: IAuthorPermissions,
  ): Promise<void>;

  // Updates an existing author's permissions by ID
  updateAuthorPermissions(
    authorId: string,
    authorPermissions: IAuthorPermissions,
  ): Promise<void>;

  // Deletes an existing author's permissions by ID
  deleteAuthorPermissions(authorId: string): Promise<void>;

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
}
