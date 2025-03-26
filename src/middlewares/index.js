import { NextResponse } from "next/server";

import { authMiddleware } from "./authMiddleware";
import { publicMiddleware } from "./publicMiddleware";

const adminProtectedRoutes = [
  { path: "/admin/dashboard", permission: "dashboard" },
  { path: "/admin/users", permission: "users" },
  { path: "/admin/roles", permission: "roles" },
  { path: "/admin/settings", permission: "settings" },
];

const publicRoutes = ["/", "/login", "/admin/login"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (pathname === "/admin") {
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicPath = publicRoutes.includes(pathname);

  const matchedAdminRoute = adminProtectedRoutes.find((route) =>
    pathname.startsWith(route.path),
  );

  if (isPublicPath) return publicMiddleware(req);
  if (isAdminRoute || matchedAdminRoute) return authMiddleware(req);

  return NextResponse.next();
}
