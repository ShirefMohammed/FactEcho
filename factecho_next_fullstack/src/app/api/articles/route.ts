import { articlesModel, authorsModel, categoriesModel, connectDB } from "@/database";
import { isFileExistsInCloudinary } from "@/services/isFileExistsInCloudinary";
import {
  ApiBodyResponse,
  CreateArticleRequest,
  CreateArticleResponse,
  GetArticlesResponse,
} from "@/types/apiTypes";
import { ROLES_LIST, httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

// Get articles
export const GET = async (req: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
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

    const articles = await articlesModel.getArticles(order, limit, skip);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Articles retrieved",
        data: { articles },
      } as ApiBodyResponse<GetArticlesResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};

// Create article
export const POST = async (req: Request) => {
  try {
    await connectDB();

    const creatorId = req.headers.get("user_id");
    const requesterRole = Number(req.headers.get("role"));
    const { title, content, image, category_id } = (await req.json()) as CreateArticleRequest;

    if (!creatorId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    if (!title || !content || !image || !category_id) {
      return NextResponse.json(
        { statusText: httpStatusText.FAIL, message: "Missing fields" },
        { status: 400 },
      );
    }

    if (requesterRole === ROLES_LIST.Author) {
      const author = await authorsModel.findAuthorById(creatorId, ["user_id"]);
      if (!author?.permissions?.create) {
        return NextResponse.json(
          { statusText: httpStatusText.FAIL, message: "No permission" },
          { status: 403 },
        );
      }
    }

    // Check for duplicate articles by title
    const existingArticle = await articlesModel.findArticleByTitle(title, ["article_id"]);
    if (existingArticle) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "An article with the same title already exists",
        },
        { status: 409 },
      );
    }

    // Verify that the image exists in Cloudinary storage
    if (!(await isFileExistsInCloudinary(image))) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Image is not uploaded to the storage.",
        },
        { status: 400 },
      );
    }

    // Validate the provided category ID
    const category = await categoriesModel.findCategoryById(category_id, ["category_id"]);
    if (!category) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Category not found.",
        },
        { status: 400 },
      );
    }

    const newArticle = await articlesModel.createArticle({
      title,
      content,
      image,
      category_id,
      creator_id: creatorId,
    });

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Article created",
        data: { newArticle },
      } as ApiBodyResponse<CreateArticleResponse>,
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
