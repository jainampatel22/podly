'use client'
import { Tabs,TabsTrigger,TabsList } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from 'axios'
import { toast } from "sonner"
type PricingSwitchProps = {
  onSwitch: (value: string) => void
}

type PricingCardProps = {
  isYearly?: boolean
  isSelected?: boolean
  title: string
  monthlyPrice?: number
  yearlyPrice?: number
  description: string
  features: string[]
  actionLabel: string
  popular?: boolean
  exclusive?: boolean
  href:  string
}

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="text-center pt-1">
     <span className="ml-2 text-3xl sm:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
        {title}
      </span>
    <p className="text-xl text-slate-500 italic pt-1">{subtitle}.</p>
    <br />
  </section>
)

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base">
        Monthly
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        Yearly
      </TabsTrigger>
    </TabsList>
  </Tabs>
)

const PricingCard = ({ isYearly, isSelected,href, title, monthlyPrice, yearlyPrice, description, features, actionLabel, popular, exclusive }: PricingCardProps) => {
 const router = useRouter()
  const {data:session} = useSession()
 const handleTest=async()=>{
 try {
    const price = isYearly ? yearlyPrice : monthlyPrice;
    if(title=='Basic'){
      router.push('/')
      
    }
    if(!price) return 
    const res = await axios.post("https://podly-h9la.onrender.com/create-order", {
      amount: price * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      
    });
            
   const order= await res.data
     if (typeof window === "undefined" || !(window as any).Razorpay) {
      alert("Razorpay SDK not loaded yet. Please try again.");
      return;
    }
            const options = {
              key:'rzp_test_e0ieOqhIqhit07',
              amount:order.amount,
              currency:order.currency,
              name:"PODLER",
              title:title,
              description:description,
              order_id:order.id,
              handler:function (response:any){
                alert("payment succesfull! payment id"+response.razorpay_payment_id)
              },
              notes:{
                user_id:session?.user?.name,
                plan_name:title,
                billing_cycle:isYearly?"Yearly":"Monthly",
                
                description:description
              },
              theme:{
                 color: "#3399cc"
              }
            }
            const rzp = new(window as any). Razorpay(options);
    rzp.open();

        } catch (error) {
              console.error('Payment error:', error);
    alert('Payment initialization failed. Please try again.');
        }
 }

      
 return (
    <Card
    className={cn(`w-72 flex flex-col justify-between py-1 border-2 mx-auto sm:mx-0`, {
      "border-purple-500": isSelected,
      "border-zinc-300": popular && !isSelected,
      "border-zinc-400": !popular && !isSelected,
      "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors": exclusive,
    })}>
    <div>
      <CardHeader className="pb-8 pt-4">
        {isYearly && yearlyPrice && monthlyPrice ? (
          <div className="flex justify-between">
            <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">{title}</CardTitle>
            <div
              className={cn("px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white", {
                "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ": popular,
              })}>
              Save ₹{monthlyPrice * 12 - yearlyPrice}
            </div>
          </div>
        ) : (
          <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">{title}</CardTitle>
        )}
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">{yearlyPrice && isYearly ? "₹" + yearlyPrice : monthlyPrice ? "₹" + monthlyPrice : "Free"}</h3>
          <span className="flex flex-col justify-end text-sm mb-1">{yearlyPrice && isYearly ? "/year" : monthlyPrice ? "/month" : null}</span>
        </div>
        <CardDescription className="pt-1.5 h-12">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {features.map((feature: string) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className="mt-2">
      <Button onClick={()=>{
        toast('Premium features are still in development, but you’re welcome to buy early if you’d like to support us. 😊')
        handleTest()
      }} 
      
      className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium  dark:text-black transition-colors focus:outline-none ">
        <div  className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
        {actionLabel}
      </Button>
    </CardFooter>
  </Card>
)
}
const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
)

export default function Pricing(){
    const [isselected,setIsSelected] = useState("Basic")
    const plans = [
       {
      title: "Basic",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Everything will be limited to 15 minutes of total usage per day",
      features: ["Video Calling", "schedule meetings","Pro version for 5 minutes"],
      actionLabel: "Get Started",
      href:'/sign-in'
    },
    {
      title: "Pro",
      monthlyPrice: 199,
      yearlyPrice: 2000,
      description: "Everything will be limited to 30 minutes of total usage per day",
      features: [ "Editor", "captions in video","Enable Virtual Backgrounds"],
      actionLabel: "Get Started",
      href:'/pro'
    },
    {
      title: "Pro ++",
      monthlyPrice: 499,
      yearlyPrice: 4500,
      description: "You can clock unlimited hours.",
      features: ["pre build virtual backgrounds", "Live call Transcription", "Editor Pro"],
      actionLabel: "Under Development",
      popular: true,
      href:"/pro++"
    },
  
  ]


    const [isYearly, setIsYearly] = useState(false)
    const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1)
    
    return(
    <div className="py-8">
        <PricingHeader title="Pricing" subtitle="Choose the plan that's right for you"  />
        <PricingSwitch onSwitch={togglePricingPeriod}/>
        <section className="mb-20 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
          {plans.map((plan) => {
            const isSelected = isselected === plan.title;

            return (
              <div
                key={plan.title}
                onClick={() => setIsSelected(plan.title)}
                className="cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <PricingCard {...plan} isYearly={isYearly} isSelected={isSelected} />
              </div>
            );
          })}
        </section>
    </div>
    )
}