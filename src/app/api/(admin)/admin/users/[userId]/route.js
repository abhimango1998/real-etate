import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
  const { userId } = params

  try {
    const data = await req.json()
    const contentType = req.headers.get('Content-Type')
    const acceptType = req.headers.get('Accept')
    const authHeader = req.headers.get('Authorization')

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        Accept: acceptType,
        Authorization: authHeader
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: responseData.message || 'Failed to update user' },
        { status: response.status }
      )
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('error', error)
  }
}

export async function DELETE(req, { params }) {
  const { userId } = params

  try {
    const authHeader = req.headers.get('Authorization')

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader
      }
    })

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ message: data.message || 'Failed to delete user' }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
