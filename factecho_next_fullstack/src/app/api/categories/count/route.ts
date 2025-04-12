import { categoriesModel, connectDB } from "@/database";
import { ApiBodyResponse, GetTotalCategoriesCountResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();

    const totalCategoriesCount = await categoriesModel.getCategoriesCount();

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Total categories count retrieved successfully",
        data: { totalCategoriesCount },
      } as ApiBodyResponse<GetTotalCategoriesCountResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
