

import { PrismaClient } from '@prisma/client'
import { authOptions } from '../../lib/authOptions'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const name = session?.user?.name

  if (!name) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  try {
    const allInvites = await prisma.invitation.findMany({
      where: {
        senderName: name,
      },
    })

    return new Response(JSON.stringify(allInvites), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
    })
  }
}
