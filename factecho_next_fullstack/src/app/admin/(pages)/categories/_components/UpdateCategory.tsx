"use client";

import { categoriesAPIs } from "@/axios/apis/categoriesAPIs";
import { useNotify } from "@/hooks";
import { ApiBodyResponse, UpdateCategoryRequest, UpdateCategoryResponse } from "@/types/apiTypes";
import { ICategory } from "@/types/entitiesTypes";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

const UpdateCategory = ({
  setCategories,
  willUpdatedCategory,
  setOpenUpdateCategory,
}: {
  setCategories: any;
  willUpdatedCategory: ICategory;
  setOpenUpdateCategory: (openUpdateCategory: boolean) => void;
}) => {
  // State to hold the category object being updated
  const [category, setCategory] = useState<ICategory>(willUpdatedCategory);

  // Loading states for fetching and updating category
  const [updateCategoryLoad, setUpdateCategoryLoad] = useState<boolean>(false);

  const notify = useNotify(); // Hook for displaying notifications

  /**
   * Update the category in the database and update the categories list in the UI.
   */
  const updateCategory = async () => {
    try {
      setUpdateCategoryLoad(true);

      const categoryUpdatedFields: UpdateCategoryRequest = { title: category.title };

      // Call API to update the category
      const resBody: ApiBodyResponse<UpdateCategoryResponse> = await categoriesAPIs.updateCategory(
        category.category_id,
        categoryUpdatedFields,
      );

      const updatedCategory = resBody.data?.updatedCategory as ICategory;

      // Update the category in the state
      setCategories((prev: ICategory[]) =>
        prev.map((cat: ICategory) =>
          cat.category_id === updatedCategory.category_id ? updatedCategory : cat,
        ),
      );

      // Notify user about success
      notify("success", resBody.message);

      // Close the update category modal
      setOpenUpdateCategory(false);
    } catch (err: any) {
      if (!err?.response) {
        notify("error", "No Server Response");
      } else {
        const message = err.response?.data?.message;
        notify("error", message || "Failed to update category!");
      }
    } finally {
      setUpdateCategoryLoad(false);
    }
  };

  return (
    <section className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto text-body bg-whiten dark:bg-boxdark-2 dark:text-bodydark relative top-2/4 -translate-y-1/2">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-fit sm:w-100">
        <header className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h2 className="font-bold text-black dark:text-white">Update Category</h2>
        </header>

        <form
          className="flex flex-col gap-5.5 p-6.5"
          onSubmit={(e) => {
            e.preventDefault();
            updateCategory();
          }}
        >
          {/* Input field for category title */}
          <div>
            <label htmlFor="title" className="mb-3 block text-black dark:text-white">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="Category Title"
              value={category.title}
              onChange={(e) => setCategory({ ...category, title: e.target.value })}
              required
            />
          </div>

          {/* Submit button with loading indicator */}
          <button
            type="submit"
            className="flex w-full justify-center items-center gap-4 rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            disabled={updateCategoryLoad}
            style={updateCategoryLoad ? { opacity: 0.5, cursor: "revert" } : {}}
          >
            <span>Save</span>
            {updateCategoryLoad && <MoonLoader color="#fff" size={15} />}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateCategory;
