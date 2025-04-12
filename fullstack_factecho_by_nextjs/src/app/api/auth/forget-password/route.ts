import { connectDB, usersModel } from "@/database";
import { ApiBodyResponse, ForgetPasswordRequest, ForgetPasswordResponse } from "@/types/apiTypes";
import { httpStatusText } from "@/utils/constants";
import { generateResetPasswordToken } from "@/utils/generateResetPasswordToken";
import { handleApiError } from "@/utils/handleApiError";
import { sendResetPasswordEmail } from "@/utils/sendResetPasswordEmail";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const { email } = (await req.json()) as ForgetPasswordRequest;

    // Check if the email field is provided
    if (!email) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Email is required",
        },
        { status: 400 },
      );
    }

    // Retrieve the user by their email
    const user = await usersModel.findUserByEmail(email, [
      "user_id",
      "provider",
      "provider_user_id",
    ]);

    // Return 404 if no user is found
    if (!user) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // Return 403 if user registered via OAuth
    if (user.provider && user.provider_user_id) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "This action is not available for users who registered with OAuth",
        },
        { status: 403 },
      );
    }

    // Generate a reset password token and save it to the user's account
    const resetPasswordToken = generateResetPasswordToken(user.user_id);
    await usersModel.setResetPasswordToken(user.user_id, resetPasswordToken);

    // Send the reset password email
    await sendResetPasswordEmail(email, resetPasswordToken);

    // Respond with a success message
    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Check your email for the reset password link",
      } as ApiBodyResponse<ForgetPasswordResponse>,
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
