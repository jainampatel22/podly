'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {CustomCheckbox} from "@/components/ui/checkbox";
import { Play, Mic, Video, Users, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export default function Index() {
  const [contentType, setContentType] = useState("");
  const router = useRouter();
const { data: sessionData, status } = useSession();
  const userInitial = sessionData?.user?.name?.charAt(0).toUpperCase() || "U";
  const options = [
    { 
      id: "podcast", 
      label: "Podcasts", 
      value: "PODCAST",
      icon: Mic,
      description: "Audio conversations that inspire"
    },
    { 
      id: "interview", 
      label: "Interview", 
      value: "INTERVIEW",
      icon: Users,
      description: "One-on-one meaningful discussions"
    },
    { 
      id: "videochat", 
      label: "Video Chat", 
      value: "VIDEOCHAT",
      icon: Video,
      description: "Face-to-face connections"
    },
    { 
      id: "webinar", 
      label: "Webinar", 
      value: "WEBINAR",
      icon: Play,
      description: "Educational presentations"
    },
  ];
  
  const handleExplore = () => {
    console.log("Exploring with content type:", contentType);
  };
  
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
              Podler
            </span>
          </div>
          
<div className="ml-2">
  {status === "loading" ? (
    // Optional loading spinner
    <div>Loading...</div>
  ) : status === "authenticated" && sessionData ? (
    // ✅ Show user dropdown if signed in
    sessionData.user?.image ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="p-0 rounded-full bg-gray-300 hover:bg-gray-200 shadow-xl">
            <img
              src={sessionData.user.image}
              alt={userInitial}
              className="w-8 h-8 rounded-full object-cover"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>
            <p className="font-inter tracking-normal">My Account</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <p className="font-inter">Profile</p>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button className="font-inter" onClick={() => signOut()}>
              Log out
            </button>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
        {userInitial}
      </div>
    )
  ) : (
    // ✅ Show Sign In if not signed in
    <Button
      onClick={() => router.push('/sign-in')}
      variant="ghost"
      className="text-slate-600 hover:text-slate-900 ml-2"
    >
      Sign In
    </Button>
  )}
</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Hero Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Play className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Create Your Ultimate
              </span>
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  piece
                </span>
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  {" "}of content
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  .
                </span>
              </span>
            </h1>
          </div>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-16">
            Your online studio to record in high quality, edit in a flash, and go live with a bang. 
            <span className="text-slate-500 italic"> Not necessarily in that order.</span>
          </p>
          
          {/* Content Type Selection */}
          <div className="mb-16">
            <p className="text-slate-600 mb-8 text-lg">
              What would you like to start creating?
            </p>
            
            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
              {options.map((option) => {
                const IconComponent = option.icon;
                const isSelected = contentType === option.value;
                
                return (
                  <div
                    key={option.id}
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      isSelected ? 'scale-105' : 'hover:scale-102'
                    }`}
                    onClick={() => setContentType(option.value)}
                  >
                    <div className={`
                      backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300
                      ${isSelected 
                        ? 'bg-white/80 border-blue-200 shadow-lg shadow-blue-100/50' 
                        : 'bg-white/40 border-white/60 hover:bg-white/60 hover:border-white/80'
                      }
                    `}>
                      <div className="flex items-center space-x-3 mb-3">
                        <CustomCheckbox
                          id={option.id}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setContentType(option.value);
                            }
                          }}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                          ${isSelected 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }
                        `}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <Label
                          htmlFor={option.id}
                          className={`
                            font-semibold text-base cursor-pointer transition-colors duration-300
                            ${isSelected ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}
                          `}
                        >
                          {option.label}
                        </Label>
                        <p className="text-sm text-slate-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-scale-in">
                        <ArrowRight className="w-3 h-3 text-white rotate-45" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="pb-20">
            <Button 
              onClick={handleExplore}
              size="lg"
              className={`
                bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                text-white font-semibold text-lg px-8 py-4 rounded-2xl
                shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                transition-all duration-300 hover:scale-105
                group relative overflow-hidden
              `}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Start Creating</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            <p className="text-slate-500 text-sm mt-4">
              No credit card required • Free to start
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}