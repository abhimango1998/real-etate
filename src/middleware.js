export { middleware } from "./middlewares/index";

export const config = {
  matcher: [
    "/",
    "/login",
    "/admin",
    "/admin/login",
    "/home",
    "/about",
    "/profile",
    "/settings",
    "/admin/dashboard/:path*",
    "/admin/users/:path*",
    "/admin/roles/:path*",
    "/admin/settings/:path*",
  ],
};
