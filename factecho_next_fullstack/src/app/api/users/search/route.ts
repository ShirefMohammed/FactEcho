import { connectDB, usersModel } from "@/database";
import { ApiBodyResponse, SearchUsersResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const searchKey = searchParams.get("searchKey") || "";
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
    const users = await usersModel.searchUsers(searchKey, -1, limit, skip);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Users search results retrieved",
        data: { users },
      } as ApiBodyResponse<SearchUsersResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
