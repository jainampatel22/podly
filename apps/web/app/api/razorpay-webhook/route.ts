import  { Request } from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
interface RazorpayPaymentCapturedEvent {
  event: 'payment.captured';
  payload: {
    payment: {
      entity: {
        email: string;
        id: string;
        amount: number;
        [key: string]: any; // To cover extra fields
      };
    };
  };
  [key: string]: any;
}
const prisma = new PrismaClient()
export async function POST(req:Request) {
    const secret = '1210Jainam'
    const signature = req.headers['x-razorpay-signature'] as string;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
       
    if(signature == generatedSignature){
        const eventData  = req.body as RazorpayPaymentCapturedEvent
        if(eventData.event == 'payment.captured'){
             const email = eventData.payload.payment.entity.email;
             const subscriptionType = eventData.payload.payment.entity.notes?.subscriptionType 
            await prisma.user.update({
                where:{
                    email
                },
                data:{
                  subscription:subscriptionType 
                }
            })
        }
        else {
        console.warn('Email not found in payment data.');
      }
 return new Response(JSON.stringify({
      success: true,
     
    }), { status: 200 })
    }
     return new Response(JSON.stringify({
      success: false,
     
    }), { status: 500 })
}