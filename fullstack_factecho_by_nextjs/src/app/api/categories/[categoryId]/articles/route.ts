import { articlesModel, connectDB } from "@/database";
import { ApiBodyResponse, GetCategoryArticlesResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

type CategoryParams = {
  params: Promise<{ categoryId: string }>;
};

export const GET = async (req: Request, { params }: CategoryParams) => {
  try {
    await connectDB();

    const { categoryId } = await params;

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

    const articles = await articlesModel.getCategoryArticles(categoryId, order, limit, skip);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Category articles retrieved successfully",
        data: { articles },
      } as ApiBodyResponse<GetCategoryArticlesResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
