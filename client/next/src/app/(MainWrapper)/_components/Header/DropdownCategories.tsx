"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ApiBodyResponse, GetCategoriesResponse } from "@shared/types/apiTypes";
import { ICategory } from "@shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../../../../api/client/useCategoriesAPIs";
import { ClickOutside } from "../../../../components";

const DropdownCategories = () => {
  const limit = 100;

  const pathname = usePathname();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const categoriesAPIs = useCategoriesAPIs();

  /**
   * Fetches categories from the API with a specific page, limit, and sort order.
   * Updates the state with the fetched categories or handles errors on failure.
   */
  const fetchCategories = async () => {
    try {
      setIsLoading(true); // Indicate loading state
      const resBody: ApiBodyResponse<GetCategoriesResponse> = await categoriesAPIs.getCategories(
        1,
        limit,
        "new",
      );
      setCategories(resBody.data?.categories || []); // Safely set the categories
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger the fetchCategories function once when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setDropdownOpen(false); // Close dropdown when the route changes
  }, [pathname]);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      {/* Button to toggle the dropdown */}
      <button
        type="button"
        className="flex items-center gap-6"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="h-8 w-8">الأقسام</span>
        <svg
          className="fill-current -mt-1"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </button>

      {/* Dropdown menu, conditionally rendered when dropdownOpen is true */}
      {dropdownOpen && (
        <div
          className={`absolute -left-25 z-99 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default`}
        >
          {/* Conditionally render the categories list or a loading indicator */}
          {!isLoading ? (
            <ul className="max-h-70 overflow-auto custom-scrollbar flex flex-col gap-3 list-none px-6 py-7.5">
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
      )}
    </ClickOutside>
  );
};

export default DropdownCategories;
