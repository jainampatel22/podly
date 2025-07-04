import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/authOptions";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name;

  if (!userName) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { feature, seconds, localDate, timeZone } = body;
  const date = new Date(localDate + 'T00:00:00');

  try {
    await prisma.usage_logs.upsert({
      where: {
        userName_date_feature: { userName, feature, date },
      },
      update: {
        durationSeconds: { increment: seconds },
        timeZone,
      },
      create: {
        userName,
        feature,
        date,
        durationSeconds: seconds,
        timeZone,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Usage log error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name;

  if (!userName) {
    return NextResponse.json({ allowed: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const feature = searchParams.get('feature')!;
  const localDate = searchParams.get('localDate')!;
  const date = new Date(localDate + 'T00:00:00');

    const user = await prisma.user.findFirst({
        where:{
            name:userName

        },
        select:{
            subscription:true
        }
    })

    const planLimits :Record<string,number|null>={
        FREE:10*60,
        PRO:30*60,
        PROPlus:100*60
    }
  const plan = user?.subscription ?? "FREE";
console.log("User subscription:", plan);
const max = planLimits[plan] ?? 10 * 60;
console.log("Max allowed seconds:", max);
 
  const usage = await prisma.usage_logs.findUnique({
    where: {
      userName_date_feature: { userName, feature, date },
    }
  });

 
  const used = usage?.durationSeconds || 0;
  const allowed = used < max;

  return NextResponse.json({ allowed, remaining: max - used });
}
