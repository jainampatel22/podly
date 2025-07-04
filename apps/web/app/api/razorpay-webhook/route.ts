// import { NextRequest } from 'next/server';
// import { PrismaClient, UserSubscription } from '@prisma/client';
// import crypto from 'crypto';

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   try {
//     // Get webhook secret from environment variables (SECURITY FIX)
//     const secret = '1210Jainam';
    
//     if (!secret) {
//       console.error('❌ Webhook secret not configured');
//       return new Response(
//         JSON.stringify({ success: false, error: 'Webhook not configured' }), 
//         { status: 500 }
//       );
//     }

//     const signature = req.headers.get('x-razorpay-signature') ?? '';
//     const rawBody = await req.text();

//     // Verify webhook signature
//     const generatedSignature = crypto
//       .createHmac('sha256', secret)
//       .update(rawBody)
//       .digest('hex');

//     if (signature !== generatedSignature) {
//       console.error('❌ Invalid webhook signature');
//       return new Response(
//         JSON.stringify({ success: false, error: 'Invalid signature' }), 
//         { status: 400 }
//       );
//     }

//     // Parse the event data
//     let eventData;
//     try {
//       eventData = JSON.parse(rawBody);
//     } catch (parseError) {
//       console.error('❌ Failed to parse webhook payload:', parseError);
//       return new Response(
//         JSON.stringify({ success: false, error: 'Invalid JSON payload' }), 
//         { status: 400 }
//       );
//     }

//     // Handle payment.captured event
//     if (eventData.event === 'payment.captured') {
//       const paymentEntity = eventData.payload?.payment?.entity;
      
//       if (!paymentEntity) {
//         console.error('❌ Invalid payment entity structure');
//         return new Response(
//           JSON.stringify({ success: false, error: 'Invalid payment data' }), 
//           { status: 400 }
//         );
//       }

//       const email = paymentEntity.email;
//       const rawType = paymentEntity.notes?.subscriptionType;
//       const paymentId = paymentEntity.id;
//       const amount = paymentEntity.amount;

//       // Validate subscription type
//       const validSubscriptions: UserSubscription[] = ['FREE', 'PRO', 'PROPlus'];
      
//       if (!rawType || !validSubscriptions.includes(rawType as UserSubscription)) {
//         console.error('❌ Invalid subscription type:', rawType);
//         return new Response(
//           JSON.stringify({ success: false, error: 'Invalid subscription type' }), 
//           { status: 400 }
//         );
//       }

//       if (!email) {
//         console.error('❌ No email found in Razorpay payload');
//         return new Response(
//           JSON.stringify({ success: false, error: 'Missing email in payment' }), 
//           { status: 400 }
//         );
//       }

//       const subscriptionType = rawType as UserSubscription;

//       // Find user
//       const user = await prisma.user.findUnique({ where: { email } });
      
//       if (!user) {
//         console.error('❌ User not found for email:', email);
//         return new Response(
//           JSON.stringify({ success: false, error: 'User not found' }), 
//           { status: 400 }
//         );
//       }

//       // Update user subscription
//       console.log('🔔 Processing payment:', {
//         email,
//         subscriptionType,
//         paymentId,
//         amount,
//       });

//       await prisma.user.update({
//         where: { email },
//         data: {
//           subscription: subscriptionType,
//           // Consider adding subscription start/end dates
//           // subscriptionStartDate: new Date(),
//           // subscriptionEndDate: calculateEndDate(subscriptionType),
//         },
//       });

//       // Optional: Log payment to database
//       // Uncomment if you have a Payment model
//       /*
//       await prisma.payment.create({
//         data: {
//           userId: user.id,
//           razorpayPaymentId: paymentId,
//           amount: amount,
//           subscriptionType: subscriptionType,
//           status: 'captured',
//           createdAt: new Date(),
//         },
//       });
//       */

//       console.log('✅ Subscription updated successfully for:', email);
//       return new Response(JSON.stringify({ success: true }), { status: 200 });

//     } else {
//       // Handle other event types or log for debugging
//       console.log('ℹ️ Unhandled event type:', eventData.event);
//       return new Response(
//         JSON.stringify({ success: false, error: 'Unhandled event type' }), 
//         { status: 400 }
//       );
//     }

//   } catch (error) {
//     console.error('❌ Webhook processing error:', error);
//     return new Response(
//       JSON.stringify({ success: false, error: 'Internal server error' }), 
//       { status: 500 }
//     );
//   }
// }

// // Helper function to calculate subscription end date
// // function calculateEndDate(subscriptionType: UserSubscription): Date {
// //   const now = new Date();
// //   switch (subscriptionType) {
// //     case 'PRO':
// //       return new Date(now.setMonth(now.getMonth() + 1)); // 1 month
// //     case 'PROPlus':
// //       return new Date(now.setFullYear(now.getFullYear() + 1)); // 1 year
// //     default:
// //       return new Date(now.setFullYear(now.getFullYear() + 100)); // Forever for FREE
// //   }
// // }