import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const getUserUsage = await prisma.usage_logs.findMany({
    where: { email },
    select: {
      feature: true,
      durationSeconds: true,
      date: true
    }
  });

  if (getUserUsage.length === 0) {
    return NextResponse.json(
      { error: "No usage found for this user" },
      { status: 404 }
    );
  }

  return NextResponse.json(getUserUsage, { status: 200 });
}
