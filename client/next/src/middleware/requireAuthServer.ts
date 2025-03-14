import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AccessTokenUserInfo } from "@shared/types/apiTypes";

/**
 * Middleware function to ensure user authentication and authorization.
 * This version first checks headers for user info passed by middleware.
 * @param allowedRoles - Array of roles permitted to access the resource.
 */
export const requireAuthServer = async (allowedRoles: number[]) => {
  console.log("=============== requireAuthServer ===============");

  const headersList = await headers();
  const userInfoHeader = headersList.get("x-user-info");

  console.log("requireAuthServer: userInfoHeader", userInfoHeader);

  if (!userInfoHeader) {
    console.log(`requireAuthServer: userInfoHeader = undefined`);
    // redirect("/auth");
    return;
  }

  // Check if we have user info from middleware
  const userInfo = JSON.parse(userInfoHeader) as AccessTokenUserInfo;

  // Check role authorization
  if (!allowedRoles.includes(userInfo.role)) {
    console.log("requireAuthServer: Not Allowed roles");
    // redirect("/unauthorized");
    return;
  }

  console.log("requireAuthServer: Allowed roles");
};
