import { authorsModel, connectDB } from "@/database";
import {
  ApiBodyResponse,
  UpdateAuthorPermissionsRequest,
  UpdateAuthorPermissionsResponse,
} from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { NextResponse } from "next/server";

type AuthorParams = {
  params: Promise<{ authorId: string }>;
};

export const PATCH = async (req: Request, { params }: AuthorParams) => {
  try {
    await connectDB();

    const { authorId } = await params;
    const { permissions } = (await req.json()) as UpdateAuthorPermissionsRequest;

    if (!permissions) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Permissions are required",
        },
        { status: 400 },
      );
    }

    await authorsModel.updateAuthorPermissions(authorId, permissions);

    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Permissions updated",
      } as ApiBodyResponse<UpdateAuthorPermissionsResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
