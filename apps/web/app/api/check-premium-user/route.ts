import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
export async function POST(req:NextRequest) {
    const {email}=await req.json()
    const checkUser= await prisma.user.findFirst({
    where:{
        email:email
    },
    select:{subscription:true}
    }
    
    )
     if (!checkUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
    const { subscription } = checkUser;
    if(subscription === 'PRO'){
        return NextResponse.json({ premium: true, plan: 'PRO' }); 
    }
    else if (subscription == 'PROPlus'){
        return NextResponse.json({ premium: true, plan: 'PROPlus' }); 
    }
    else if (subscription == 'FREE'){
        return NextResponse.json({ premium: false, plan: 'FREE' }); 
    }
    else{
         return NextResponse.json({ premium: false, plan: 'NONE' }); 
    }
}