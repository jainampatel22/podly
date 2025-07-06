import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
export async function POST(req:NextRequest) {
   const {email} = await req.json()
   const getProfileData = await prisma.user.findFirst({
    where:{email},
    select:{subscription:true,subscriptionStartedAt:true,subscriptionEndsAt:true}
   })
   if(!getProfileData){
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
   }
      return NextResponse.json(getProfileData, { status: 200 });
}

