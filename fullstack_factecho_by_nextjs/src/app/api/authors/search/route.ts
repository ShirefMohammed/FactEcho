import { authorsModel, connectDB } from "@/database";
import { ApiBodyResponse, SearchAuthorsResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

type SearchParams = {
  params: Promise<{ searchKey: string }>;
};

export const GET = async (req: Request, { params }: SearchParams) => {
  try {
    await connectDB();

    const { searchKey } = await params;
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 10;
    const page = Number(searchParams.get("page")) || 1;

    if (!searchKey.trim()) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Search key is required",
        },
        { status: 400 },
      );
    }

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
    const authors = await authorsModel.searchAuthors(searchKey, -1, limit, skip);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Authors search results retrieved",
        data: { authors },
      } as ApiBodyResponse<SearchAuthorsResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
