import { connectDB, usersModel } from "@/database";
import { ApiBodyResponse, GetUsersResponse } from "@/types/apiTypes";
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
    const users = await usersModel.getUsers(-1, limit, skip);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Users retrieved successfully",
        data: { users },
      } as ApiBodyResponse<GetUsersResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
