import { authorsModel, connectDB } from "@/database";
import { ApiBodyResponse, GetTotalAuthorsCountResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();

    const totalAuthorsCount = await authorsModel.getAuthorsCount();

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Total authors count retrieved",
        data: { totalAuthorsCount },
      } as ApiBodyResponse<GetTotalAuthorsCountResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
