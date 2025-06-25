import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

import { getServerSession } from "next-auth";
export async function GET(req:Request){
const prisma = new PrismaClient()

const session = await getServerSession(authOptions)
const {searchParams} = new URL(req.url)
const name = searchParams.get('name')
if (!name) return new Response('Name is required', { status: 400 })
 try {
    const inviteForMeet = await prisma.invitation.findMany({
    where:{
        reciverName:name
    }
 })
 return new Response(JSON.stringify(inviteForMeet), {
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