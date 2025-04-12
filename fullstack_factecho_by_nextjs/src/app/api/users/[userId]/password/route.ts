import { connectDB, usersModel } from "@/database";
import {
  ApiBodyResponse,
  UpdateUserPasswordRequest,
  UpdateUserPasswordResponse,
} from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

type UserParams = {
  params: Promise<{ userId: string }>;
};

export const PATCH = async (req: Request, { params }: UserParams) => {
  try {
    await connectDB();

    const { userId } = await params;
    const requesterId = req.headers.get("user_id");
    const { oldPassword, newPassword } = (await req.json()) as UpdateUserPasswordRequest;

    if (requesterId !== userId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "You don't have access to this resource",
        },
        { status: 403 },
      );
    }

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Both passwords required",
        },
        { status: 400 },
      );
    }

    const user = await usersModel.findUserById(userId, ["user_id", "password"]);
    if (!user) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Wrong password",
        },
        { status: 403 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await usersModel.updateUser(userId, { password: hashedPassword });

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Password updated",
      } as ApiBodyResponse<UpdateUserPasswordResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
