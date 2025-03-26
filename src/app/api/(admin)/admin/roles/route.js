import { NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const searchQuery = searchParams.get('search') || ''
  const page = searchParams.get('page') || 1
  const limit = searchParams.get('limit') || 10

  const token = req.headers.get('Authorization')
  const contentType = req.headers.get('Content-Type')

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/roles?search=${searchQuery}&page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': contentType,
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('Authorization')
    const contentType = req.headers.get('Content-Type')
    const body = await req.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: authHeader
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Couldn't create role"
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)

    return NextResponse.json({
      status: 500,
      message: 'Error creating role'
    })
  }
}
