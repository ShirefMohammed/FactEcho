import { connectToPostgreSQL } from "./postgreSQL/connectToPostgreSQL";
import { ArticlesModel } from "./postgreSQL/models/articlesModel";
import { AuthorsModel } from "./postgreSQL/models/authorsModel";
import { CategoriesModel } from "./postgreSQL/models/categoriesModel";
import { UsersModel } from "./postgreSQL/models/usersModel";

export let usersModel: UsersModel;
export let authorsModel: AuthorsModel;
export let categoriesModel: CategoriesModel;
export let articlesModel: ArticlesModel;

export const connectDB = async () => {
  await connectToPostgreSQL();

  usersModel = new UsersModel();
  authorsModel = new AuthorsModel();
  categoriesModel = new CategoriesModel();
  articlesModel = new ArticlesModel();
};
