import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@example.com'
      }
    ]
  })
}