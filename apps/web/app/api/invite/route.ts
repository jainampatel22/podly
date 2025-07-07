import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // console.log('👉 Incoming request body:', body)

    const { reciverName, senderName, date, time, email, subject } = body

    if (!reciverName || !senderName || !date || !time || !email || !subject) {
      console.warn('⚠️ Missing fields in request')
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const addUser = await prisma.invitation.create({
      data: {
        senderName,
        reciverName,
        date: new Date(date), // this might be the breaking point!
        time,
        email,
        subject
      }
    })

    return new Response(
      JSON.stringify({ success: true, message: 'Invite created successfully!', data: addUser }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('❌ Invite creation error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
