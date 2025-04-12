import { authorsModel, connectDB, usersModel } from "@/database";
import { deleteFileFromCloudinary } from "@/services/deleteFileFromCloudinary";
import { ApiBodyResponse, UpdateUserRoleRequest, UpdateUserRoleResponse } from "@/types/apiTypes";
import { ROLES_LIST, httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

type UserParams = {
  params: Promise<{ userId: string }>;
};

export const PATCH = async (req: Request, { params }: UserParams) => {
  try {
    await connectDB();

    const { userId } = await params;
    const { role: newRole } = (await req.json()) as UpdateUserRoleRequest;

    const user = await usersModel.findUserById(userId, ["user_id", "role"]);
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
          message: "Cannot update admin role",
        },
        { status: 403 },
      );
    }

    if (newRole !== ROLES_LIST.User && newRole !== ROLES_LIST.Author) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Invalid role",
        },
        { status: 400 },
      );
    }

    await usersModel.updateUser(userId, { role: newRole });

    if (user.role === ROLES_LIST.User && newRole === ROLES_LIST.Author) {
      await authorsModel.createAuthorPermissions(user.user_id, {
        user_id: user.user_id,
        create: true,
        update: true,
        delete: true,
      });
      await usersModel.setAvatar(
        user.user_id,
        process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_AVATAR || "",
      );
    } else if (user.role === ROLES_LIST.Author && newRole === ROLES_LIST.User) {
      await authorsModel.deleteAuthorPermissions(user.user_id);
      const avatar = await usersModel.findUserAvatar(user.user_id);
      await usersModel.setAvatar(user.user_id, "");
      if (avatar) await deleteFileFromCloudinary(avatar);
    }

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Role updated",
      } as ApiBodyResponse<UpdateUserRoleResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
