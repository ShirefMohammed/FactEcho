import { connectDB, usersModel } from "@/database";
import {
  ApiBodyResponse,
  CheckUserExistenceRequest,
  CheckUserExistenceResponse,
} from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { user_id, role } = (await req.json()) as CheckUserExistenceRequest;

  if (!user_id || !role) {
    return NextResponse.json(
      {
        statusText: httpStatusText.FAIL,
        message: "Missing user information",
      },
      { status: 400 },
    );
  }

  try {
    const isUserFound = await usersModel.findUserById(user_id, ["user_id", "role"]);

    if (!isUserFound) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Your account is not found",
        },
        { status: 404 },
      );
    }

    if (isUserFound.role !== role) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Not Allowed",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "User exists in db",
      } as ApiBodyResponse<CheckUserExistenceResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}
