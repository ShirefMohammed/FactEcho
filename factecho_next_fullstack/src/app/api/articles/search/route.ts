import { articlesModel, connectDB } from "@/database";
import { ApiBodyResponse, SearchArticlesResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const searchKey = searchParams.get("searchKey") || "";
    const order = searchParams.get("order") === "old" ? 1 : -1;
    const limit = Number(searchParams.get("limit")) || 10;
    const page = Number(searchParams.get("page")) || 1;

    if (limit <= 0 || page <= 0) {
      return NextResponse.json(
        { statusText: httpStatusText.FAIL, message: "Invalid pagination" },
        { status: 400 },
      );
    }

    const skip = (page - 1) * limit;

    const articles = await articlesModel.searchArticles(searchKey, order, limit, skip);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Articles search results",
        data: { articles },
      } as ApiBodyResponse<SearchArticlesResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
