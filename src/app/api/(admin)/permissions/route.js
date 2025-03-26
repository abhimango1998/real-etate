import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const authHeader = req.headers.get('Authorization')
    const contentType = req.headers.get('Content-Type')

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': contentType,
        Authorization: authHeader
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Couldn't fetch permissions"
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching permissions', error)

    return NextResponse.json({
      status: 500,
      message: 'Error fetching permissions'
    })
  }
}

export const dynamic = 'force-dynamic' // Ensure this API route runs dynamically
