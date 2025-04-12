"use client";

import { categoriesAPIs } from "@/axios/apis/categoriesAPIs";
import { useNotify } from "@/hooks";
import { CreateCategoryRequest } from "@/types/apiTypes";
import { ICategory } from "@/types/entitiesTypes";
import { useEffect, useRef, useState } from "react";
import { MoonLoader } from "react-spinners";

const CreateCategory = ({
  setCategories,
  setOpenCreateCategory,
}: {
  setCategories: any;
  setOpenCreateCategory: (openCreateCategory: boolean) => void;
}) => {
  // Refs for title input
  const titleRef = useRef<HTMLInputElement | null>(null);

  // State for category details
  const [category, setCategory] = useState<Partial<ICategory>>({ title: "" });

  // State to track loading during API call
  const [createCategoryLoad, setCreateCategoryLoad] = useState<boolean>(false);

  const notify = useNotify(); // Notification function

  /** Focus the title input on component mount */
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  /**
   * Handles creating a new category.
   * Displays notifications on success or failure.
   */
  const createCategory = async () => {
    try {
      setCreateCategoryLoad(true);

      // Construct the payload for the API request
      const newCategory: CreateCategoryRequest = { title: category.title! };

      // Call the API to create a new category
      const resBody = await categoriesAPIs.createCategory(newCategory);

      // Update the categories list with the newly created category
      setCategories((prev: ICategory[]) => [resBody?.data?.newCategory, ...prev]);

      // Notify the user of success
      notify("success", resBody.message);

      // Close the create category modal
      setOpenCreateCategory(false);
    } catch (err: any) {
      // Handle errors with appropriate user feedback
      if (!err?.response) {
        notify("error", "No Server Response");
      } else {
        const message = err.response?.data?.message;
        notify("error", message || "Create category failed!");
      }
    } finally {
      setCreateCategoryLoad(false); // Hide loading indicator
    }
  };

  return (
    <section className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto text-body bg-whiten dark:bg-boxdark-2 dark:text-bodydark relative top-2/4 -translate-y-1/2">
      {/* Modal Container */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-fit sm:w-100">
        {/* Modal Header */}
        <header className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h2 className="font-bold text-black dark:text-white">Create Category</h2>
        </header>

        {/* Form */}
        <form
          className="flex flex-col gap-5.5 p-6.5"
          onSubmit={(e) => {
            e.preventDefault(); // Prevent page reload
            createCategory(); // Trigger create category logic
          }}
        >
          {/* Input Field for Category Title */}
          <div>
            <label htmlFor="title" className="mb-3 block text-black dark:text-white">
              Title
            </label>
            <input
              type="text"
              ref={titleRef}
              name="title"
              id="title"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="Category Title"
              value={category.title}
              onChange={(e) => setCategory({ ...category, title: e.target.value })}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full justify-center items-center gap-4 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            disabled={createCategoryLoad}
            style={createCategoryLoad ? { opacity: 0.5, cursor: "not-allowed" } : {}}
          >
            <span>Create</span>
            {createCategoryLoad && <MoonLoader color="#fff" size={15} />}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateCategory;
