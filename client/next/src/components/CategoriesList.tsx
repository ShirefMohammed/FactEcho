"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiBodyResponse, GetCategoriesResponse } from "shared/types/apiTypes";
import { ICategory } from "shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../api/client/useCategoriesAPIs";
import { useHandleErrors } from "../hooks";

const CategoriesList = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleErrors = useHandleErrors();
  const categoriesAPIs = useCategoriesAPIs();

  /**
   * Fetches categories from the API with a specific page, limit, and sort order.
   * Updates the state with the fetched categories or handles errors on failure.
   */
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const resBody: ApiBodyResponse<GetCategoriesResponse> = await categoriesAPIs.getCategories(
        1,
        5,
        "new",
      );
      setCategories(resBody.data?.categories || []);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-full p-5 rounded-lg border border-slate-200">
      {/* Header */}
      <h3 className="pb-3 mb-4 border-b border-slate-200 font-bold text-lg">الأقسام</h3>

      {/* Conditionally render the categories list or a loading indicator */}
      {!isLoading ? (
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
      ) : (
        <div className="text-gray-500">جاري التحميل...</div>
      )}
    </div>
  );
};

export default CategoriesList;
