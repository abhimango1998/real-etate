import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()

    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        token: body.token,
        password: body.password,
        password_confirmation: body.password_confirmation
      })
    })

    const data = await apiResponse.json()

    if (!apiResponse.ok) {
      return NextResponse.json(data, { status: apiResponse.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Reset Password Error:', error)

    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 })
  }
}
