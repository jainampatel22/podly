import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
export async function POST(req:NextRequest) {
   const {email} = await req.json()
   const getUserUsage = await prisma.usage_logs.findFirst({
    where:{email},
   
select:{
    feature:true,
    durationSeconds:true,
    date:true
}
})
   if(!getUserUsage){
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
   }
      return NextResponse.json(getUserUsage, { status: 200 });
}