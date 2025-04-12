import { connectDB, usersModel } from "@/database";
import {
  ApiBodyResponse,
  UpdateUserDetailsRequest,
  UpdateUserDetailsResponse,
} from "@/types/apiTypes";
import { IUser } from "@/types/entitiesTypes";
import { RgxList, httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

type UserParams = {
  params: Promise<{ userId: string }>;
};

export const PATCH = async (req: Request, { params }: UserParams) => {
  try {
    await connectDB();

    const { userId } = await params;
    const requesterId = req.headers.get("user_id");
    const { name } = (await req.json()) as UpdateUserDetailsRequest;

    if (requesterId !== userId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "You don't have access to this resource",
        },
        { status: 403 },
      );
    }

    const updatedFields: Partial<IUser> = {};

    if (name) {
      if (!RgxList.NAME_REGEX.test(name)) {
        return NextResponse.json(
          {
            statusText: httpStatusText.FAIL,
            message: "Invalid name format",
          },
          { status: 400 },
        );
      }
      updatedFields.name = name;
    }

    await usersModel.updateUser(userId, updatedFields);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Details updated",
      } as ApiBodyResponse<UpdateUserDetailsResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
