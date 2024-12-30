import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ApiBodyResponse, GetCategoriesResponse } from "@shared/types/apiTypes";
import { ICategory } from "@shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../api/hooks/useCategoriesAPIs";
import { useHandleErrors } from "../hooks";

const CategoriesList = memo(() => {
  // State to store the fetched categories
  const [categories, setCategories] = useState<ICategory[]>([]);
  // State to track the loading status of the API call
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Custom hook to handle API errors
  const handleErrors = useHandleErrors();
  // API methods for categories
  const categoriesAPIs = useCategoriesAPIs();

  /**
   * Fetches categories from the API with a specific page, limit, and sort order.
   * Updates the state with the fetched categories or handles errors on failure.
   */
  const fetchCategories = async () => {
    try {
      setIsLoading(true); // Indicate loading state
      const resBody: ApiBodyResponse<GetCategoriesResponse> = await categoriesAPIs.getCategories(
        1, // Page number
        5, // Number of categories per page
        "new", // Sort order
      );
      setCategories(resBody.data?.categories || []); // Safely set the categories
    } catch (err) {
      handleErrors(err); // Handle any errors using the custom hook
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Trigger the fetchCategories function once when the component mounts
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
                to={`/categories/${category.category_id}/articles`}
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
});

export default CategoriesList;
