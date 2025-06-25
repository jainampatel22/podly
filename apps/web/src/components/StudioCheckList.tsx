'use client'

import { useSession } from "next-auth/react"

import { redirect } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import HostStream from "@/components/hostStream"
import { Monitor, Sparkles } from "lucide-react"

export default  function StudioCheckList() {
 const {data:session} = useSession()
  if (!session) { redirect('/sign-in?callbackUrl=/studio') }
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl"></div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block relative z-10">
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-sm bg-white/40 border border-white/60 rounded-2xl px-6 py-4 flex items-center space-x-4 shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PODLY
              </h1>
              <div className="w-px h-8 bg-slate-300"></div>
              <h2 className="text-slate-700 font-medium">
                {session?.user?.name}'s Studio
              </h2>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 pt-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Welcome Section */}
            <div className="space-y-4 mb-12">
              <p className="text-slate-600 text-lg">
                You're about to join <span className="font-semibold text-slate-900">{session?.user?.name}'s Studio</span>
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                <span className="block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Let's check your
                </span>
                <span className="block mt-2">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    camera
                  </span>
                  <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                    {" "}and{" "}
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    mic
                  </span>
                </span>
              </h1>
            </div>
            
            {/* Input Section */}
            <div className="mb-12">
              <div className="relative max-w-md mx-auto">
                <Input
                  placeholder={session?.user?.name || "Your Name"}
                  className="backdrop-blur-sm bg-white/40 border border-white/60 rounded-2xl h-14 px-6 text-lg placeholder:text-slate-500 focus:bg-white/60 focus:border-blue-200 focus:ring-2 focus:ring-blue-100 transition-all duration-300 pr-20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-xl text-sm font-semibold">
                  HOST
                </div>
              </div>
            </div>

            {/* Host Stream Component */}
            <HostStream />
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative z-10 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="backdrop-blur-sm bg-white/40 border-b border-white/60">
          <div className="px-4 py-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PODLY
            </h1>
            <div className="w-px h-6 bg-slate-300"></div>
            <h2 className="text-slate-700 text-sm font-medium truncate">
              {session?.user?.name}'s Studio
            </h2>
          </div>
        </header>

        {/* Mobile Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
          <div className="backdrop-blur-sm bg-white/40 border border-white/60 rounded-3xl p-8 max-w-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              Desktop Required
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Studio access requires a desktop device for the best experience.
            </p>
            <div className="mt-6">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}