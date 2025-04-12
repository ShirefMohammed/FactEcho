import { connectDB, usersModel } from "@/database";
import { ApiBodyResponse, VerifyAccountRequest, VerifyAccountResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const { verificationToken } = (await req.json()) as VerifyAccountRequest;

    // Validate the presence and type of the verification token
    if (!verificationToken) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Verification token is missing",
        },
        { status: 400 },
      );
    }

    // Find the user by their verification token
    const user = await usersModel.findUserByVerificationToken(verificationToken, ["user_id"]);

    if (!user) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Invalid verification token",
        },
        { status: 404 },
      );
    }

    try {
      // Decode and verify the token's validity
      const decodedToken = jwt.verify(verificationToken, process.env.VERIFICATION_TOKEN_SECRET!);

      // Check if the decoded token matches the user's ID
      if (
        typeof decodedToken === "object" &&
        decodedToken !== null &&
        "user_id" in decodedToken &&
        (decodedToken as JwtPayload).user_id !== user.user_id
      ) {
        return NextResponse.json(
          {
            statusText: httpStatusText.FAIL,
            message: "Invalid verification token",
          },
          { status: 409 },
        );
      }

      // Update the user's verification status and clear the token
      await usersModel.updateUser(user.user_id, { is_verified: true });
      await usersModel.setVerificationToken(user.user_id, "");

      return NextResponse.json(
        {
          statusText: httpStatusText.SUCCESS,
          message: "Account verified successfully.",
        } as ApiBodyResponse<VerifyAccountResponse>,
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message:
            "Verification token has expired. Go to the forgot password page to generate a new verification token.",
        },
        { status: 401 },
      );
    }
  } catch (err) {
    return handleApiError(err);
  }
};
