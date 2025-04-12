import { categoriesModel, connectDB } from "@/database";
import {
  ApiBodyResponse,
  GetCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "@/types/apiTypes";
import { ICategory } from "@/types/entitiesTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

type CategoryParams = {
  params: Promise<{ categoryId: string }>;
};

// Get category
export const GET = async (req: Request, { params }: CategoryParams) => {
  try {
    await connectDB();

    const { categoryId } = await params;

    const category = await categoriesModel.findCategoryById(categoryId);

    if (!category) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Category retrieved successfully",
        data: { category },
      } as ApiBodyResponse<GetCategoryResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};

// Update category
export const PATCH = async (req: Request, { params }: CategoryParams) => {
  try {
    await connectDB();

    const { categoryId } = await params;

    const requesterId = req.headers.get("user_id");
    const { title } = (await req.json()) as UpdateCategoryRequest;

    if (!requesterId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const existingCategory = await categoriesModel.findCategoryById(categoryId);
    if (!existingCategory) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    let message = "Category updated successfully";
    const updatedFields: Partial<ICategory> = {};

    if (title) {
      const duplicateCategory = await categoriesModel.findCategoryByTitle(title, ["category_id"]);
      if (duplicateCategory && duplicateCategory.category_id !== categoryId) {
        message += " Title was not updated as another category with the same title exists.";
      } else {
        updatedFields.title = title;
      }
    }

    const updatedCategory =
      Object.keys(updatedFields).length > 0
        ? await categoriesModel.updateCategory(categoryId, updatedFields)
        : existingCategory;

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message,
        data: { updatedCategory },
      } as ApiBodyResponse<UpdateCategoryResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};

// Delete category
export const DELETE = async (req: Request, { params }: CategoryParams) => {
  try {
    await connectDB();

    const { categoryId } = await params;
    const requesterId = req.headers.get("user_id");

    if (!requesterId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const existingCategory = await categoriesModel.findCategoryById(categoryId, ["category_id"]);
    if (!existingCategory) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    await categoriesModel.deleteCategory(categoryId);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
};
