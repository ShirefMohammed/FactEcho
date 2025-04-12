import { categoriesModel, connectDB } from "@/database";
import { ApiBodyResponse, SearchCategoriesResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const searchKey = searchParams.get("searchKey") || "";
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

    const categories = await categoriesModel.searchCategories(searchKey, order, limit, skip);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Categories searched successfully",
        data: { categories },
      } as ApiBodyResponse<SearchCategoriesResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
