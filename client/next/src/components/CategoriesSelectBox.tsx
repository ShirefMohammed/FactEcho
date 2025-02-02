"use client";

import { useEffect, useState } from "react";
import { ICategory } from "shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../api/client/useCategoriesAPIs";
import { useHandleErrors } from "../hooks";

const CategoriesSelectBox = ({
  selectedCategoryId,
  setSelectedCategoryId,
}: {
  selectedCategoryId: ICategory["category_id"];
  setSelectedCategoryId: (selectedCategoryId: ICategory["category_id"]) => void;
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleErrors = useHandleErrors();
  const categoriesAPIs = useCategoriesAPIs();

  // Fetches categories from the API
  const fetchCategories = async () => {
    try {
      setIsLoading(true);

      // Fetch categories with pagination and sorting
      const resBody = await categoriesAPIs.getCategories(1, 100, "new");
      setCategories(resBody?.data?.categories ?? []);
    } catch (err) {
      handleErrors(err as Error); // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of categories
    fetchCategories();
  }, []);

  useEffect(() => {
    // Automatically set the first category as selected if none is selected
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].category_id);
    }
  }, [categories, selectedCategoryId, setSelectedCategoryId]);

  return (
    <div className="relative z-20 bg-transparent">
      {/* Select box for categories */}
      <select
        id="category_id"
        value={selectedCategoryId ?? ""}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primaryColor active:border-primaryColor"
      >
        {!isLoading ? (
          categories.map((category: ICategory) => (
            <option key={category.category_id} value={category.category_id} className="text-body">
              {category.title.length <= 40 ? category.title : category.title.substr(0, 50) + "..."}
            </option>
          ))
        ) : (
          <option disabled>Loading...</option>
        )}
      </select>

      {/* Dropdown arrow icon */}
      <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
        <svg
          className="fill-current"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.8">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
              fill=""
            ></path>
          </g>
        </svg>
      </span>
    </div>
  );
};

export default CategoriesSelectBox;
