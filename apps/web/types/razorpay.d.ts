interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

interface Razorpay {
  new (options: RazorpayOptions): any;
  open(): void;
}

declare var Razorpay: {
  new (options: RazorpayOptions): Razorpay;
};
interface RazorpayInstance {
  open(): void
  // Optional: add more methods if needed
}