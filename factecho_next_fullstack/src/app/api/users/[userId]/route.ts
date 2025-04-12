import { connectDB, usersModel } from "@/database";
import { deleteFileFromCloudinary } from "@/services/deleteFileFromCloudinary";
import { ApiBodyResponse, DeleteUserRequest, GetUserResponse } from "@/types/apiTypes";
import { ROLES_LIST, httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

type UserParams = {
  params: Promise<{ userId: string }>;
};

// Get user
export const GET = async (req: Request, { params }: UserParams) => {
  try {
    await connectDB();

    const { userId } = await params;
    const requesterId = req.headers.get("user_id");
    const requesterRole = Number(req.headers.get("role"));

    if (requesterRole !== ROLES_LIST.Admin && requesterId !== userId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Unauthorized access",
        },
        { status: 403 },
      );
    }

    const user = await usersModel.findUserById(userId, [
      "user_id",
      "name",
      "email",
      "role",
      "is_verified",
      "created_at",
      "updated_at",
      "provider",
      "provider_user_id",
    ]);

    if (!user) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "User retrieved",
        data: { user },
      } as ApiBodyResponse<GetUserResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};

// Delete user
export const DELETE = async (req: Request, { params }: UserParams) => {
  try {
    await connectDB();

    const { userId } = await params;
    const requesterId = req.headers.get("user_id");
    const requesterRole = Number(req.headers.get("role"));
    const { password } = (await req.json()) as DeleteUserRequest;

    if (requesterRole !== ROLES_LIST.Admin && requesterId !== userId) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "You don't have access to this resource",
        },
        { status: 403 },
      );
    }

    const user = await usersModel.findUserById(userId, [
      "user_id",
      "password",
      "role",
      "provider",
      "provider_user_id",
    ]);

    if (!user) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    if (user.role === ROLES_LIST.Admin) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Cannot delete admin",
        },
        { status: 403 },
      );
    }

    if (
      requesterRole !== ROLES_LIST.Admin &&
      !(user.provider && user.provider_user_id) &&
      !password
    ) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Password required",
        },
        { status: 400 },
      );
    }

    if (requesterRole !== ROLES_LIST.Admin && !(user.provider && user.provider_user_id)) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          {
            statusText: httpStatusText.FAIL,
            message: "Wrong password",
          },
          { status: 403 },
        );
      }
    }

    // Handle avatar deletion if applicable
    const userAvatar = [ROLES_LIST.Admin, ROLES_LIST.Author].includes(user.role)
      ? await usersModel.findUserAvatar(user.user_id)
      : null;

    if (userAvatar && userAvatar !== process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_AVATAR) {
      await deleteFileFromCloudinary(userAvatar);
    }

    await usersModel.deleteUser(userId);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
};
