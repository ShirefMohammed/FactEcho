import { connectDB, usersModel } from "@/database";
import { ApiBodyResponse, GetTotalUsersCountResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();

    const totalUsersCount = await usersModel.getUsersCount();

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Total users count retrieved",
        data: { totalUsersCount },
      } as ApiBodyResponse<GetTotalUsersCountResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
