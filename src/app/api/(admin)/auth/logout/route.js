import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const contentType = req.headers.get("Content-Type");
    const acceptType = req.headers.get("Accept");
    const authHeader = req.headers.get("Authorization");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Accept: acceptType,
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    const nextResponse = NextResponse.json(data);

    nextResponse.cookies.delete("token");
    nextResponse.cookies.delete("permissions");
    nextResponse.cookies.delete("role");

    return nextResponse;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
