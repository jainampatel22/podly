'use client'
import { ArrowRight, Globe } from "lucide-react";
import { Button } from "./ui/button";
import Razorpay from 'razorpay'
import Link from "next/link";
import Pricing from "./Pricing";
import axios from 'axios'
import { useEffect } from "react";
import Demo from "./Demo";
import Footer from "./Footer";
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function HomeComponent(){




    
    return (
        <>
        <Pricing/>
       <div className="min-h-screen">
  <div className="justify-center items-center mt-14">
    <h1 className="text-center text-4xl sm:text-5xl mb-10 md:text-6xl lg:text-6xl font-bold tracking-tight leading-tight">
      <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
        Explore all your Scheduled
      </span>
      <span className="ml-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
        Meetings
      </span>
    </h1>
      <p className="text-lg sm:mr-56 sm:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-16">
         Check the status of your scheduled meetings.
            <span className="text-slate-500 italic"> Hopefully they've been accepted!</span>
          </p>
          <div className="flex justify-center item-center">

          
          <Button className=" bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
    text-white font-semibold text-lg px-8 py-4 rounded-2xl
    shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
    transition-all duration-300 hover:scale-105
    group relative overflow-hidden"><span className="relative z-10 flex items-center space-x-2">
    <Link href="/explore/meetings">Check</Link>
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
  </span></Button></div>

  <div className="flex justify-center item-center">
    <div className="mt-10">
        <p className="text-lg  sm:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">Still not accepted? <span className="text-slate-500 italic ">Go and schedule <Link href="/schedule" className="underline cursor-pointer">again</Link></span>. </p>
    </div>
    
  </div>
  </div>
</div>
<Demo/>
<Footer/>


        </>
    )
}