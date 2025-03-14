import Link from "next/link";

import { ApiBodyResponse, GetCategoriesResponse } from "@shared/types/apiTypes";
import { ICategory } from "@shared/types/entitiesTypes";

import { categoriesAPIs } from "../api/server/categoriesAPIs";

const CategoriesList = async () => {
  // Fetch categories on the server
  let categories: ICategory[] = [];
  try {
    const resBody: ApiBodyResponse<GetCategoriesResponse> = await categoriesAPIs.getCategories(
      1,
      5,
      "new",
    );
    categories = resBody.data?.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <div className="w-full p-5 rounded-lg border border-slate-200">
      {/* Header */}
      <h3 className="pb-3 mb-4 border-b border-slate-200 font-bold text-lg">الأقسام</h3>

      {/* Render the categories list */}
      <ul className="flex flex-col gap-3 list-disc pr-6">
        {categories.map((category) => (
          <li key={category.category_id}>
            <Link
              href={`/categories/${category.category_id}/articles`}
              className="flex items-center gap-3 hover:underline hover:text-primaryColor"
            >
              <span className="text-sm">{category.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;
