import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { addMonths, addYears } from 'date-fns'; 
import { BillingCycle } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, plan ,isYearly} = await req.json(); 

    if (!email || !plan) {
      return new Response(JSON.stringify({ success: false, error: "Missing email or plan" }), { status: 400 });
    }

const now = new Date();
let endsAt: Date;
let billingCycle: BillingCycle;
    if(isYearly){
      endsAt = addYears(now,1)
       billingCycle = BillingCycle.YEARLY;
    }
    else{
      endsAt = addMonths(now,1)
       billingCycle = BillingCycle.MONTHLY;
    }

    await prisma.user.update({
      where: { email },
      data: { subscription: plan ,
        subscriptionUpdatedAt:new Date(),
        subscriptionStartedAt:new Date(),
       subscriptionEndsAt:endsAt,
       billingCycle:{set:billingCycle}
      }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: "Database update failed" }), { status: 500 });
  }
}