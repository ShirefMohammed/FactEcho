import { articlesModel, connectDB } from "@/database";
import { ApiBodyResponse, GetTotalArticlesCountResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();

    const totalArticlesCount = await articlesModel.getArticlesCount();

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Total articles count",
        data: { totalArticlesCount },
      } as ApiBodyResponse<GetTotalArticlesCountResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
