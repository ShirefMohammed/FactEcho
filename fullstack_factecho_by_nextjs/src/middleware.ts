import { ROLES_LIST, httpStatusText } from "@/utils/constants";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { authAPIs } from "./axios/apis/authAPIs";
import { ApiBodyResponse } from "./types/apiTypes";

const authPages = [
  "/auth/register",
  "/auth/login",
  "/auth/forget-password",
  "/auth/verify-account",
  "/auth/reset-password",
];

const protectedPages = [
  { route: "/articles/create", allowedRoles: [ROLES_LIST.Author, ROLES_LIST.Admin] },
  { route: "/articles/:articleId/update", allowedRoles: [ROLES_LIST.Author, ROLES_LIST.Admin] },
  { route: "/users/:userId", allowedRoles: [ROLES_LIST.User, ROLES_LIST.Author, ROLES_LIST.Admin] },
  { route: "/users/:userId/overview", allowedRoles: [ROLES_LIST.Admin] },
  { route: "/admin", allowedRoles: [ROLES_LIST.Admin] },
];

const protectedApiRoutes = [
  // Users routes
  { route: "GET:/api/users", allowedRoles: [ROLES_LIST.Admin] },
  { route: "GET:/api/users/search", allowedRoles: [ROLES_LIST.Admin] },
  { route: "GET:/api/users/count", allowedRoles: [ROLES_LIST.Admin] },
  { route: "DELETE:/api/users/unverified-cleanup", allowedRoles: [ROLES_LIST.Admin] },
  {
    route: "GET:/api/users/:userId",
    allowedRoles: [ROLES_LIST.User, ROLES_LIST.Author, ROLES_LIST.Admin],
  },
  {
    route: "DELETE:/api/users/:userId",
    allowedRoles: [ROLES_LIST.User, ROLES_LIST.Author, ROLES_LIST.Admin],
  },
  {
    route: "PATCH:/api/users/:userId/details",
    allowedRoles: [ROLES_LIST.User, ROLES_LIST.Author, ROLES_LIST.Admin],
  },
  { route: "PATCH:/api/users/:userId/role", allowedRoles: [ROLES_LIST.Admin] },
  {
    route: "PATCH:/api/users/:userId/password",
    allowedRoles: [ROLES_LIST.User, ROLES_LIST.Author, ROLES_LIST.Admin],
  },
  {
    route: "PATCH:/api/users/:userId/avatar",
    allowedRoles: [ROLES_LIST.Author, ROLES_LIST.Admin],
  },
  // Authors routes
  { route: "GET:/api/authors", allowedRoles: [ROLES_LIST.Admin] },
  { route: "GET:/api/authors/search", allowedRoles: [ROLES_LIST.Admin] },
  { route: "GET:/api/authors/count", allowedRoles: [ROLES_LIST.Admin] },
  { route: "PATCH:/api/authors/:authorId/permissions", allowedRoles: [ROLES_LIST.Admin] },
  // Categories routes
  { route: "POST:/api/categories", allowedRoles: [ROLES_LIST.Admin] },
  { route: "PATCH:/api/categories/:categoryId", allowedRoles: [ROLES_LIST.Admin] },
  { route: "DELETE:/api/categories/:categoryId", allowedRoles: [ROLES_LIST.Admin] },
  // Articles routes
  { route: "POST:/api/articles", allowedRoles: [ROLES_LIST.Admin, ROLES_LIST.Author] },
  {
    route: "GET:/api/articles/saved",
    allowedRoles: [ROLES_LIST.User, ROLES_LIST.Author, ROLES_LIST.Admin],
  },
  { route: "PATCH:/api/articles/:articleId", allowedRoles: [ROLES_LIST.Admin, ROLES_LIST.Author] },
  { route: "DELETE:/api/articles/:articleId", allowedRoles: [ROLES_LIST.Admin, ROLES_LIST.Author] },
  {
    route: "GET:/api/articles/:articleId/save",
    allowedRoles: [ROLES_LIST.User, ROLES_LIST.Author, ROLES_LIST.Admin],
  },
  {
    route: "POST:/api/articles/:articleId/save",
    allowedRoles: [ROLES_LIST.User, ROLES_LIST.Author, ROLES_LIST.Admin],
  },
  {
    route: "DELETE:/api/articles/:articleId/save",
    allowedRoles: [ROLES_LIST.User, ROLES_LIST.Author, ROLES_LIST.Admin],
  },
];

function isPageRouteMatch(routePattern: string, pathname: string): boolean {
  const routeParts = routePattern.split("/");
  const pathParts = pathname.split("/");

  if (routeParts.length !== pathParts.length) {
    return false;
  }

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(":")) {
      if (!pathParts[i]) return false;
      continue;
    }
    if (routeParts[i] !== pathParts[i]) return false;
  }

  return true;
}

function isApiRouteMatch(
  routeWithMethod: string,
  requestMethod: string,
  requestPath: string,
): boolean {
  const [routeMethod, routePath] = routeWithMethod.split(/:(.+)/);

  if (routeMethod !== requestMethod) {
    return false;
  }

  const formattedRoutePath = routePath.startsWith("/") ? routePath : `/${routePath}`;
  const formattedRequestPath = requestPath.startsWith("/") ? requestPath : `/${requestPath}`;

  const routeSegments = formattedRoutePath.split("/").filter(Boolean);
  const requestSegments = formattedRequestPath.split("/").filter(Boolean);

  if (routeSegments.length !== requestSegments.length) {
    return false;
  }

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const requestSegment = requestSegments[i];

    if (routeSegment.startsWith(":")) {
      if (!requestSegment) {
        return false;
      }
      continue;
    }

    if (routeSegment !== requestSegment) {
      return false;
    }
  }

  return true;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;
  const isAuthPage = authPages.includes(pathname);
  const isApiRoute = pathname.startsWith("/api");
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // console.log("================ Start Middleware ===============");
  // console.log("pathname:", pathname);
  // console.log("method:", method);
  // console.log("isAuthPage:", isAuthPage);
  // console.log("isApiRoute:", isApiRoute);
  // console.log("Token:", token);
  // console.log("================================================");

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const matchedPage = protectedPages.find((page) => isPageRouteMatch(page.route, pathname));
  if (matchedPage) {
    if (!token || !token?.id || !token?.role) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (!matchedPage.allowedRoles.includes(Number(token.role))) {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  if (isApiRoute) {
    const matchedRoute = protectedApiRoutes.find((route) =>
      isApiRouteMatch(route.route, method, pathname),
    );
    // console.log("Matched Route:", matchedRoute);

    if (matchedRoute) {
      if (!token || !token?.id || !token?.role) {
        return NextResponse.json(
          {
            statusText: httpStatusText.FAIL,
            message: "Invalid or expired access token",
          } as ApiBodyResponse<null>,
          { status: 401 },
        );
      }

      if (!matchedRoute.allowedRoles.includes(Number(token.role))) {
        return NextResponse.json(
          {
            statusText: httpStatusText.FAIL,
            message: "You don't have access to this resource",
          } as ApiBodyResponse<null>,
          { status: 403 },
        );
      }

      await authAPIs.checkUserExistence({
        user_id: token.id as string,
        role: Number(token.role),
      });

      const headers = new Headers(req.headers);
      headers.set("user_id", token.id as string);
      headers.set("role", String(token.role));

      return NextResponse.next({
        request: {
          headers: headers,
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/auth/:path*",
    "/users/:path*",
    "/articles/create",
    "/articles/:path*/update",
    "/admin",
    "/admin/:path*",
  ],
};
