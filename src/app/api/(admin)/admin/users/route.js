import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const searchQuery = searchParams.get('search') || ''
    const page = searchParams.get('page') || 1
    const limit = searchParams.get('limit') || 10

    const contentType = req.headers.get('Content-Type')
    const acceptType = req.headers.get('Accept')
    const authHeader = req.headers.get('Authorization')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users?search=${searchQuery}&page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': contentType,
          Accept: acceptType,
          Authorization: authHeader
        }
      }
    )

    const users = await response.json()

    return NextResponse.json(users)
  } catch (error) {
    console.error('error', error)

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req) {
  const contentType = req.headers.get('Content-Type')
  const token = req.headers.get('Authorization')
  const acceptType = req.headers.get('Accept')

  try {
    const data = await req.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Accept: acceptType,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('error', error)
  }
}
