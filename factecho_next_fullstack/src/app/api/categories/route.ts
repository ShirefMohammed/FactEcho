import { categoriesModel, connectDB } from "@/database";
import {
  ApiBodyResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoriesResponse,
} from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

// Get categories
export const GET = async (req: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const order = searchParams.get("order") === "old" ? 1 : -1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    if (limit <= 0 || page <= 0) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Invalid pagination parameters. Limit and page must be positive integers.",
        },
        { status: 400 },
      );
    }

    const skip = (page - 1) * limit;

    const categories = await categoriesModel.getCategories(order, limit, skip);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Categories retrieved successfully",
        data: { categories },
      } as ApiBodyResponse<GetCategoriesResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};

// Create category
export const POST = async (req: Request) => {
  try {
    await connectDB();

    const creatorId = req.headers.get("user_id");
    const { title } = (await req.json()) as CreateCategoryRequest;

    if (!creatorId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Category title is required",
        },
        { status: 400 },
      );
    }

    const existingCategory = await categoriesModel.findCategoryByTitle(title, ["category_id"]);
    if (existingCategory) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "A category with the same title already exists",
        },
        { status: 409 },
      );
    }

    const newCategory = await categoriesModel.createCategory({
      title,
      creator_id: creatorId,
    });

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Category created successfully",
        data: { newCategory },
      } as ApiBodyResponse<CreateCategoryResponse>,
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
