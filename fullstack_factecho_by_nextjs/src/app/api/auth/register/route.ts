import { connectDB, usersModel } from "@/database";
import { ApiBodyResponse, RegisterRequest, RegisterResponse } from "@/types/apiTypes";
import { RgxList, httpStatusText } from "@/utils/constants";
import { generateVerificationToken } from "@/utils/generateVerificationToken";
import { handleApiError } from "@/utils/handleApiError";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const { name, email, password } = (await req.json()) as RegisterRequest;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    // Validate name format
    if (!RgxList.NAME_REGEX.test(name)) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Invalid name format",
        },
        { status: 400 },
      );
    }

    // Validate email format
    if (!RgxList.EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Enter a valid email",
        },
        { status: 400 },
      );
    }

    // Validate password format
    if (!RgxList.PASS_REGEX.test(password)) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "Invalid password format",
        },
        { status: 400 },
      );
    }

    // Check if email already exists
    const user = await usersModel.findUserByEmail(email, ["user_id"]);
    if (user) {
      return NextResponse.json(
        {
          statusText: httpStatusText.FAIL,
          message: "User with the same email already exists",
        },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await usersModel.createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Generate and send verification token
    const verificationToken = generateVerificationToken(newUser.user_id!);
    await usersModel.setVerificationToken(newUser.user_id!, verificationToken);
    await sendVerificationEmail(email, verificationToken);

    // Success response
    return NextResponse.json(
      {
        statusText: httpStatusText.SUCCESS,
        message: "Registration succeeded. Check email for verification link",
      } as ApiBodyResponse<RegisterResponse>,
      { status: 201 },
    );
  } catch (err) {
    return handleApiError(err);
  }
};
