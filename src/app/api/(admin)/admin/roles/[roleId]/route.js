import { NextResponse } from 'next/server'

export async function DELETE(req, { params }) {
  const authHeader = req.headers.get('Authorization')
  const { roleId } = params

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/roles/${roleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader
      }
    })

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('error', error)

    return NextResponse.json({ error: 'An error occurred while deleting the role.' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const { roleId } = params
    const authHeader = req.headers.get('Authorization')
    const contentType = req.headers.get('Content-Type')
    const body = await req.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/roles/${roleId}`, {
      method: 'PUT',
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
