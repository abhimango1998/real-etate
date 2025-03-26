import { NextRequest, NextResponse } from "next/server";

export function authMiddleware(req) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const permissions = req.cookies.get("permissions")?.value;
  const userPermissions = permissions ? JSON.parse(permissions) : [];

  const adminProtectedRoutes = [
    { path: "/admin/dashboard", permission: "dashboard" },
    { path: "/admin/users", permission: "users" },
    { path: "/admin/roles", permission: "roles" },
    { path: "/admin/settings", permission: "settings" },
  ];

  const matchedAdminRoute = adminProtectedRoutes.find((route) =>
    req.nextUrl.pathname.startsWith(route.path),
  );

  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    role !== "admin" &&
    role !== "superadmin" &&
    req.nextUrl.pathname !== "/admin/login"
  ) {
    return NextResponse.redirect(new URL("/401-not-authorized", req.url));
  }

  if (!token) {
    return NextResponse.redirect(
      new URL(
        req.nextUrl.pathname.startsWith("/admin") ? "/admin/login" : "/login",
        req.url,
      ),
    );
  }

  if (
    matchedAdminRoute &&
    !userPermissions.includes(matchedAdminRoute.permission)
  ) {
    return NextResponse.redirect(new URL("/admin/401-not-authorized", req.url));
  }

  return NextResponse.next();
}
