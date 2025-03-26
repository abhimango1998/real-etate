import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const contentType = req.headers.get('Content-Type')
    const token = req.headers.get('Authorization')

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': contentType,
        Authorization: token
      }
    })

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        {
          message: errorData.message || 'Unable to fetch settings'
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({ data })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const contentType = req.headers.get('Content-Type')
    const token = req.headers.get('Authorization')
    const body = await req.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        Authorization: token
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        {
          message: errorData.message || 'Unable to update settings'
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({ data })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

export const revalidate = 0
