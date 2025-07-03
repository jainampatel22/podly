import { NextRequest } from 'next/server';
import { PrismaClient, UserSubscription } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const secret = '1210Jainam';
  const signature = req.headers.get('x-razorpay-signature') ?? '';

  const rawBody = await req.text(); // read raw body as string
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (signature !== generatedSignature) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid signature' }), { status: 400 });
  }

  const eventData = JSON.parse(rawBody);

  if (eventData.event === 'payment.captured') {
    const email = eventData.payload.payment.entity.email;
    const rawType = eventData.payload.payment.entity.notes?.subscriptionType;
    const validSubscriptions: UserSubscription[] = ['FREE', 'PRO', 'PROPlus'];

    if (!rawType || !validSubscriptions.includes(rawType as UserSubscription)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid subscription type' }), { status: 400 });
    }

    const subscriptionType = rawType as UserSubscription;
if (!email) {
  console.error('❌ No email found in Razorpay payload.');
  return new Response(JSON.stringify({ success: false, error: 'Missing email in payment' }), { status: 400 });
}

    try {

      console.log('🔔 Payment event received:', {
  email,
  subscriptionType: rawType,
  paymentId: eventData.payload.payment.entity.id,
});


      await prisma.user.update({
        where: { email },
        data: {
          subscription: subscriptionType,
        
        },
      });

      // // Optional: log the payment
      // await prisma..create({
      //   data: {
      //     user: { connect: { email } },
      //     type: subscriptionType,
      //     razorpayId: eventData.payload.payment.entity.id,
      //     amount: eventData.payload.payment.entity.amount,
      //   },
      // });

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ success: false, error: 'Database update failed' }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ success: false, error: 'Invalid event type' }), { status: 400 });
}
