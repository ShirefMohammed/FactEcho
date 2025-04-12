import { articlesModel, connectDB } from "@/database";
import { ApiBodyResponse, GetAuthorArticlesResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

type AuthorParams = {
  params: Promise<{ authorId: string }>;
};

export const GET = async (req: Request, { params }: AuthorParams) => {
  try {
    await connectDB();

    const { authorId } = await params;
    const { searchParams } = new URL(req.url);
    const order = searchParams.get("order") === "old" ? 1 : -1;
    const limit = Number(searchParams.get("limit")) || 10;
    const page = Number(searchParams.get("page")) || 1;

    if (limit <= 0 || page <= 0) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Invalid pagination parameters",
        },
        { status: 400 },
      );
    }

    const skip = (page - 1) * limit;
    const articles = await articlesModel.getCreatedArticles(authorId, order, limit, skip);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Author articles retrieved",
        data: { articles },
      } as ApiBodyResponse<GetAuthorArticlesResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
