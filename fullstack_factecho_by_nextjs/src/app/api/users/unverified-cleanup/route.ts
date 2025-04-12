import { connectDB, usersModel } from "@/database";
import { ApiBodyResponse, CleanupUnverifiedUsersResponse, ValidIntervals } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const interval = (searchParams.get("interval") as ValidIntervals) || "1 day";

    const validIntervals: ValidIntervals[] = ["1 day", "7 days", "30 days", "1 hour", "12 hours"];
    if (!validIntervals.includes(interval)) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: `Invalid interval. Allowed: ${validIntervals.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const count = await usersModel.deleteStaleUnverifiedUsers(interval);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: `${count} unverified users deleted`,
      } as ApiBodyResponse<CleanupUnverifiedUsersResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
