import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const contentType = req.headers.get("Content-Type") || "application/json";
    const { email, password } = await req.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      return NextResponse.json(
        { message: errorData.message || "Invalid credentials" },
        { status: response.status },
      );
    }

    const data = await response.json();

    console.log("data login: ", data?.data?.user?.role?.name);

    const responseObj = NextResponse.json({
      message: "Login successful",
      data: data.data,
    });

    const cookiesConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    if (data.data.token) {
      responseObj.cookies.set("token", data.data.token, cookiesConfig);
      responseObj.cookies.set(
        "role",
        data?.data?.user?.role?.name,
        cookiesConfig,
      );
      responseObj.cookies.set(
        "permissions",
        JSON.stringify(data.data.permissions),
        {
          ...cookiesConfig,
          httpOnly: false,
        },
      );
    }

    return responseObj;
  } catch (error) {
    console.error("Error in /api/auth/login:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
