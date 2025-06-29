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
   <div className="min-h-screen px-3 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-center items-center pt-12 pb-8 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16">
        {/* Main Heading */}
        <h1 className="text-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 sm:mb-8 lg:mb-10 px-2">
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent block">
            Explore all your Scheduled
          </span>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent block mt-1 sm:mt-0 sm:inline">
            Meetings
          </span>
        </h1>

        {/* Description */}
        <p className="text-base xs:text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-xs xs:max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 lg:mb-16 text-center px-4 sm:px-6">
          Check the status of your scheduled meetings.
          <span className="text-slate-500 italic block mt-2 sm:inline sm:mt-0 sm:ml-1">
            Hopefully they've been accepted!
          </span>
        </p>

        {/* Main CTA Button */}
        <div className="flex justify-center items-center mb-8 sm:mb-10 lg:mb-12 w-full max-w-sm sm:max-w-none px-4 sm:px-0">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
            text-white font-semibold text-base xs:text-lg sm:text-xl px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 
            rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
            transition-all duration-300 hover:scale-105 group relative overflow-hidden w-full sm:w-auto
            min-h-[48px] xs:min-h-[56px] sm:min-h-[64px]">
            <span className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3">
              <Link href="/explore/meetings" className="no-underline">Check</Link>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        </div>

        {/* Secondary Action */}
        <div className="flex justify-center items-center w-full">
          <div className="px-4 sm:px-6 max-w-xs xs:max-w-md sm:max-w-2xl lg:max-w-4xl">
            <p className="text-base  xs:text-lg sm:text-xl lg:text-2xl text-slate-600 mx-auto leading-relaxed text-center">
              Still not accepted?
              <span className="text-slate-500 italic block mt-2 sm:inline sm:mt-0 sm:ml-1 ">
                Go and schedule{' '}
                <Link 
                  href="/schedule" 
                  className="underline cursor-pointer hover:text-slate-700 transition-colors duration-200 underline-offset-2"
                >
                  again
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
        <Demo/>
        <Footer/>
        </>
    )
}
