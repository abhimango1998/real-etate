import { NextRequest, NextResponse } from "next/server";

export function publicMiddleware(req) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  if (token) {
    return NextResponse.redirect(
      new URL(role === "admin" || role === "superadmin" ? "/admin/dashboard" : "/home", req.url)
    );
  }

  return NextResponse.next();
}
