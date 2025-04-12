import { authorsModel, connectDB } from "@/database";
import { ApiBodyResponse, GetAuthorResponse } from "@/types/apiTypes";
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

    const author = await authorsModel.findAuthorById(authorId, ["user_id", "name"]);

    if (!author) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Author not found",
        },
        { status: 404 },
      );
    }

    // Remove permissions field
    delete (author as any).permissions;

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Author retrieved",
        data: { author },
      } as ApiBodyResponse<GetAuthorResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
