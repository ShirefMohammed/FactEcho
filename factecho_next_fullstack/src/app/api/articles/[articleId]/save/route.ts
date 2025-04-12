import { articlesModel, connectDB } from "@/database";
import { ApiBodyResponse, IsArticleSavedResponse, SaveArticleResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

type ArticleParams = {
  params: Promise<{ articleId: string }>;
};

// Is article saved
export const GET = async (req: Request, { params }: ArticleParams) => {
  try {
    await connectDB();

    const { articleId } = await params;
    const userId = req.headers.get("user_id");

    if (!articleId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Missing articleId in the request params",
        },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Missing userId",
        },
        { status: 400 },
      );
    }

    const isArticleSaved = await articlesModel.isArticleSaved(userId, articleId);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Article save status",
        data: { isArticleSaved },
      } as ApiBodyResponse<IsArticleSavedResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};

// Save article
export const POST = async (req: Request, { params }: ArticleParams) => {
  try {
    await connectDB();

    const { articleId } = await params;
    const userId = req.headers.get("user_id");

    if (!articleId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Missing articleId in the request params",
        },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Missing userId",
        },
        { status: 400 },
      );
    }

    await articlesModel.saveArticle(userId, articleId);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Article saved",
      } as ApiBodyResponse<SaveArticleResponse>,
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};

// Unsave article
export const DELETE = async (req: Request, { params }: ArticleParams) => {
  try {
    await connectDB();

    const { articleId } = await params;
    const userId = req.headers.get("user_id");

    if (!articleId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Missing articleId in the request params",
        },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Missing userId",
        },
        { status: 400 },
      );
    }

    await articlesModel.unsaveArticle(userId, articleId);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
};
