import { authorsModel, connectDB } from "@/database";
import { ApiBodyResponse, GetAuthorsResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
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
    const authors = await authorsModel.getAuthors(-1, limit, skip);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Authors retrieved successfully",
        data: { authors },
      } as ApiBodyResponse<GetAuthorsResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
