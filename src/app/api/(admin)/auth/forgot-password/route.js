import { NextResponse } from 'next/server'

export async function POST(req) {
  const contentType = req.headers.get('Content-Type')

  try {
    const body = await req.json()
    const { email } = body
    const reset_url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType
      },
      body: JSON.stringify({
        email,
        reset_url
      })
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
