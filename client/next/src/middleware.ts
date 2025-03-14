import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("=============== middleware ===============");

  const accessToken = request.cookies.get("accessToken")?.value;

  console.log("middleware: accessToken", accessToken);

  // If no access token, redirect to auth
  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    // Verify token using jose
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
    const { payload } = await jwtVerify(accessToken, secret);

    // Token is valid, proceed with request
    const response = NextResponse.next();

    console.log("middleware: payload", payload);

    // Pass payload and accessToken via headers
    response.headers.set("x-user-info", JSON.stringify(payload.userInfo));
    response.headers.set("x-access-token", accessToken); // Set accessToken in headers

    console.log("middleware: valid accessToken");

    return response;
  } catch (error) {
    console.log("middleware: expired accessToken");

    // Redirect to /auth/refresh with the current route as a query parameter
    const currentRoute = request.nextUrl.pathname;
    return NextResponse.redirect(new URL(`/auth/refresh?from=${currentRoute}`, request.url));
  }
}

export const config = {
  matcher: [
    // Protected paths
    // "/explore",
    // "/users/:userId/overview",
  ],
};

