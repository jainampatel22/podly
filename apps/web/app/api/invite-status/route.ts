import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export async function PUT(req:Request) {
    try {
        const {id,status} = await req.json()
        const updated = await prisma.invitation.update({
            where:{
                id:id,
                
            },
            data:{
                status
            }
        })
        return new Response(JSON.stringify({
      success: true,
      message: `Invite ${status}`,
      data: updated,
    }), { status: 200 })
    } catch (error) {
    console.error('Update failed:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Could not update invite',
    }), { status: 500 })
}}