import { articlesModel, authorsModel, categoriesModel, connectDB } from "@/database";
import { deleteFileFromCloudinary } from "@/services/deleteFileFromCloudinary";
import { isFileExistsInCloudinary } from "@/services/isFileExistsInCloudinary";
import {
  ApiBodyResponse,
  GetArticleResponse,
  UpdateArticleRequest,
  UpdateArticleResponse,
} from "@/types/apiTypes";
import { IArticle } from "@/types/entitiesTypes";
import { ROLES_LIST, httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

type ArticleParams = {
  params: Promise<{ articleId: string }>;
};

// Get article
export const GET = async (req: Request, { params }: ArticleParams) => {
  try {
    await connectDB();

    const { articleId } = await params;

    const article = await articlesModel.findArticleById(articleId);
    if (!article) {
      return NextResponse.json(
        { statusText: httpStatusText.FAIL, message: "Article not found" },
        { status: 404 },
      );
    }

    await articlesModel.updateArticle(articleId, { views: article.views + 1 });

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Article retrieved",
        data: { article },
      } as ApiBodyResponse<GetArticleResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};

// Update article
export const PATCH = async (req: Request, { params }: ArticleParams) => {
  try {
    await connectDB();

    const { articleId } = await params;
    const requesterId = req.headers.get("user_id");
    const requesterRole = Number(req.headers.get("role"));
    const { title, content, image, category_id } = (await req.json()) as UpdateArticleRequest;

    if (!requesterId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    // Check if the article exists
    const article = await articlesModel.findArticleById(articleId, [
      "article_id",
      "image",
      "creator_id",
    ]);

    if (!article) {
      return NextResponse.json(
        { statusText: httpStatusText.FAIL, message: "Article not found" },
        { status: 404 },
      );
    }

    // Handle case where admin is not the creator
    if (requesterRole === ROLES_LIST.Admin && requesterId !== article.creator_id) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "You don't have access to this resource",
        },
        { status: 403 },
      );
    }

    // Check for author update permissions if the user is an Author
    if (requesterRole === ROLES_LIST.Author) {
      // Handle case where author is not the creator
      if (requesterId !== article.creator_id) {
        return NextResponse.json(
          {
            statusText: httpStatusText.FAIL,
            message: "You don't have access to this resource",
          },
          { status: 403 },
        );
      }

      const author = await authorsModel.findAuthorById(requesterId, ["user_id"]);

      // Handle case where author is not found
      if (!author) {
        return NextResponse.json(
          { statusText: httpStatusText.FAIL, message: "Author not found" },
          { status: 404 },
        );
      }

      // Check if the author has permission to update articles
      if (!author.permissions.update) {
        return NextResponse.json(
          {
            statusText: httpStatusText.FAIL,
            message: "You don't have permission to update articles",
          },
          { status: 403 },
        );
      }
    }

    let message = "Article updated";
    const updatedFields: Partial<IArticle> = {};

    // Check for duplicate titles if a new title is provided
    if (title) {
      const duplicateArticle = await articlesModel.findArticleByTitle(title, ["article_id"]);
      if (duplicateArticle && duplicateArticle.article_id !== articleId) {
        message += " Title is not updated as another article with the same title exists";
      } else {
        updatedFields.title = title;
      }
    }

    // Update the content if provided
    if (content) {
      updatedFields.content = content;
    }

    // Validate the image if provided
    if (image) {
      if (!(await isFileExistsInCloudinary(image))) {
        message += " Image is not updated as it is not uploaded to the storage";
      } else {
        updatedFields.image = image;
      }
    }

    // Validate category if provided
    if (category_id) {
      const category = await categoriesModel.findCategoryById(category_id, ["category_id"]);
      if (!category) {
        message += " Category is not updated as it was not found";
      } else {
        updatedFields.category_id = category_id;
      }
    }

    // Update the article with the new fields
    const updatedArticle = await articlesModel.updateArticle(articleId, updatedFields);

    // Delete the old image from Cloudinary if a new image was provided
    if (updatedFields.image && article.image) {
      await deleteFileFromCloudinary(article.image);
    }

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message,
        data: { updatedArticle },
      } as ApiBodyResponse<UpdateArticleResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};

// Delete article
export const DELETE = async (req: Request, { params }: ArticleParams) => {
  try {
    await connectDB();

    const { articleId } = await params;
    const requesterId = req.headers.get("user_id");
    const requesterRole = Number(req.headers.get("role"));

    if (!requesterId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const article = await articlesModel.findArticleById(articleId, [
      "article_id",
      "image",
      "creator_id",
    ]);

    if (!article) {
      return NextResponse.json(
        { statusText: httpStatusText.FAIL, message: "Article not found" },
        { status: 404 },
      );
    }

    // Check for author delete permissions if the user is an Author
    if (requesterRole === ROLES_LIST.Author) {
      // Handle case where author is not the creator
      if (requesterId !== article.creator_id) {
        return NextResponse.json(
          {
            statusText: httpStatusText.FAIL,
            message: "You don't have access to this resource",
          },
          { status: 403 },
        );
      }

      const author = await authorsModel.findAuthorById(requesterId, ["user_id"]);

      // Handle case where author is not found
      if (!author) {
        return NextResponse.json(
          { statusText: httpStatusText.FAIL, message: "Author not found" },
          { status: 404 },
        );
      }

      // Check if the author has permission to delete articles
      if (!author.permissions.delete) {
        return NextResponse.json(
          {
            statusText: httpStatusText.FAIL,
            message: "You don't have permission to delete articles",
          },
          { status: 403 },
        );
      }
    }

    // Perform the deletion
    await articlesModel.deleteArticle(articleId);

    // Delete the article image from Cloudinary if it exists
    if (article.image) {
      await deleteFileFromCloudinary(article.image);
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
};
