import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/authOptions";
import { getServerSession } from "next-auth";
import { prisma } from "../../lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { feature, seconds, localDate, timeZone } = body;
  const date = new Date(localDate + 'T00:00:00Z');

  try {
    console.log(`Logging usage - Email: ${email}, Feature: ${feature}, Date: ${date.toISOString()}, Seconds: ${seconds}`);
    
    await prisma.usage_logs.upsert({
      where: {
        email_date_feature: { email, date, feature },
      },
      update: {
        durationSeconds: { increment: seconds },
        timeZone,
      },
      create: {
        email,
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
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ allowed: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const feature = searchParams.get('feature')!;
  const localDate = searchParams.get('localDate')!;

  // Validate localDate format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

const date = new Date(localDate + 'T00:00:00Z'); // UTC date from client-sent local day

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
 

  const user = await prisma.user.findFirst({
    where: {
      email: email // Fixed: query by email, not name
    },
    select: {
      subscription: true
    }
  });

  const planLimits: Record<string, number | null> = {
    FREE: 10* 60,
    PRO: 30 * 60,
    PROPlus: 100 * 60
  };

  const plan = user?.subscription ?? "FREE";
  console.log("User subscription:", plan);
  const max = planLimits[plan] ?? 10 * 60;
  console.log("Max allowed seconds:", max);

  const usage = await prisma.usage_logs.findUnique({
    where: {
      email_date_feature: { email, date, feature },
    }
  });

  const used = usage?.durationSeconds || 0;
  const allowed = used < max;

  console.log(`Usage check - Email: ${email}, Feature: ${feature}, Date: ${date.toISOString()}, Used: ${used}, Max: ${max}, Allowed: ${allowed}`);

  return NextResponse.json({ used, allowed, remaining: max - used });
}
