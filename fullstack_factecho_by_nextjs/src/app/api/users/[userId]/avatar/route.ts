import { connectDB, usersModel } from "@/database";
import { deleteFileFromCloudinary } from "@/services/deleteFileFromCloudinary";
import { isFileExistsInCloudinary } from "@/services/isFileExistsInCloudinary";
import {
  ApiBodyResponse,
  UpdateUserAvatarRequest,
  UpdateUserAvatarResponse,
} from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
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
    const { avatar: newAvatar } = (await req.json()) as UpdateUserAvatarRequest;

    if (requesterId !== userId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "You don't have access to this resource",
        },
        { status: 403 },
      );
    }

    if (!newAvatar) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Avatar required",
        },
        { status: 400 },
      );
    }

    if (!(await isFileExistsInCloudinary(newAvatar))) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Avatar not found in storage",
        },
        { status: 400 },
      );
    }

    const oldAvatar = await usersModel.findUserAvatar(userId);
    await usersModel.setAvatar(userId, newAvatar);

    if (oldAvatar && oldAvatar !== process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_AVATAR) {
      await deleteFileFromCloudinary(oldAvatar);
    }

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Avatar updated",
      } as ApiBodyResponse<UpdateUserAvatarResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
