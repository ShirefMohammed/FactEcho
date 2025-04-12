import { connectDB, usersModel } from "@/database";
import { ApiBodyResponse, ResetPasswordRequest, ResetPasswordResponse } from "@/types/apiTypes";
import { RgxList, httpStatusText } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const { resetPasswordToken, newPassword } = (await req.json()) as ResetPasswordRequest;

    // Validate input fields
    if (!resetPasswordToken) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Reset password token is required",
        },
        { status: 400 },
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "New password is required",
        },
        { status: 400 },
      );
    }

    // Find the user by the reset password token
    const user = await usersModel.findUserByResetPasswordToken(resetPasswordToken, ["user_id"]);

    // Return 404 if the token is invalid or the user is not found
    if (!user) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Invalid reset password token",
        },
        { status: 404 },
      );
    }

    try {
      // Verify the reset password token
      const decodedToken = jwt.verify(resetPasswordToken, process.env.RESETPASSWORD_TOKEN_SECRET!);

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
            message: "Invalid reset password token",
          },
          { status: 409 },
        );
      }

      // Validate the new password format
      if (!RgxList.PASS_REGEX.test(newPassword)) {
        return NextResponse.json(
          {
            statusText: httpStatusText.FAIL,
            message:
              "Password must be in english, 8 to 24 characters, Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: !, @, #, $, %",
          },
          { status: 400 },
        );
      }

      // Update the user's password and clear tokens
      await usersModel.updateUser(user.user_id, {
        password: await bcrypt.hash(newPassword, 10),
        is_verified: true,
      });
      await usersModel.setVerificationToken(user.user_id, "");
      await usersModel.setResetPasswordToken(user.user_id, "");

      return NextResponse.json(
        {
          statusText: httpStatusText.SUCCESS,
          message: "Password reset successfully. You can now login with your new password.",
        },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Reset password token has expired. Please request a new password reset link.",
        } as ApiBodyResponse<ResetPasswordResponse>,
        { status: 401 },
      );
    }
  } catch (err) {
    return handleApiError(err);
  }
};
