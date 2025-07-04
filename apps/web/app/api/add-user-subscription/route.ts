import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json(); // <-- Use req.json() instead of req.body

    if (!email || !plan) {
      return new Response(JSON.stringify({ success: false, error: "Missing email or plan" }), { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: { subscription: plan }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: "Database update failed" }), { status: 500 });
  }
}