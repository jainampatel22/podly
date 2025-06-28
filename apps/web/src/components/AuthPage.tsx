"use client"
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Sparkles, ArrowRight } from "lucide-react";
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
export default function AuthPage(){
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter()
  const {data:session }=useSession()
const searchParams = useSearchParams()
const callbackUrl = searchParams.get('callbackUrl') || '/explore/home'
  const handleGoogleSignIn = () => {
    setIsSigningIn(true);
  signIn("google",{callbackUrl:callbackUrl})
    console.log("Signing in with Google...");
  };
useEffect(()=>{
      if(session){
        router.replace(callbackUrl)
      }
    },[session,callbackUrl,router])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PODLY
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="backdrop-blur-sm bg-white/60 border border-white/80 rounded-2xl p-8 shadow-lg shadow-blue-100/50 animate-fade-in">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome to PODLY
              </h1>
              <p className="text-slate-600 text-sm">
                Access your workspace — sign in to get started!
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-t border-slate-200" />
              <span className="mx-4 text-slate-500 text-sm font-medium">SIGN IN WITH</span>
              <hr className="flex-grow border-t border-slate-200" />
            </div>

            {/* Google Sign In Button */}
            <Button 
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md group"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isSigningIn ? 'Signing in...' : 'Continue with Google'}
                {!isSigningIn && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                )}
              </div>
            </Button>

            {/* Terms */}
            <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
              By signing in, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
