import { articlesModel, connectDB } from "@/database";
import { ApiBodyResponse, GetLatestArticlesResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 10;

    if (limit <= 0) {
      return NextResponse.json(
        { statusText: httpStatusText.FAIL, message: "Invalid limit" },
        { status: 400 },
      );
    }

    const articles = await articlesModel.getLatestArticles(limit);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Latest articles retrieved",
        data: { articles },
      } as ApiBodyResponse<GetLatestArticlesResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
