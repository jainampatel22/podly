'use client'
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useContext, useState } from "react";
import { CustomCheckbox } from "@/components/ui/checkbox";
import { SocketContext } from "./Context/SocketContext";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
export default function LandingPage() {
  const router = useRouter();
  const {socket} = useContext(SocketContext)
  const [contentType, setContentType] = useState("");
  const options = [
    { id: "podcast", label: "Podcasts", value: "PODCAST" },
    { id: "interview", label: "Interview", value: "INTERVIEW" },
    { id: "videochat", label: "Video Chat", value: "VIDEOCHAT" },
    { id: "webinar", label: "Webinar", value: "WEBINAR" },
  ];
  
  const initRoom = () => {
    console.log("initializing new room")
    socket.emit("create-room")
  }
  
  return (
    <div className="bg-gray-200 min-h-screen">
      <Header/>
      
      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Icon Section */}
        <div className="flex justify-center pt-8 sm:pt-12 lg:pt-14">
          <Image
            src="https://shuttle.zip/images/homepage/icon.webp"
            alt="Shuttle Icon"
            width={90}
            height={90}
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[90px] lg:h-[90px]"
          />
        </div>
        
        {/* Main Content Section */}
        <div className="text-center px-4 sm:px-8 lg:px-16 xl:px-32 mt-8 sm:mt-12 lg:mt-16">
          
          {/* Main Heading */}
          <div className="space-y-2 sm:space-y-1 lg:space-y-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter font-inter leading-tight">
              Create Your Ultimate
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter font-inter leading-tight">
              <span className="text-blue-700">piece</span> of content <span className="text-blue-700">.</span>
            </h1>
          </div>
          
          {/* Subtitle */}
          <p className="mt-6 sm:mt-8 lg:mt-10 text-base sm:text-lg md:text-xl lg:text-2xl font-light font-inter tracking-tight max-w-4xl mx-auto leading-relaxed">
            Your online studio to record in high quality, edit in a flash, and go live with a bang. Not necessarily in that order.
          </p>
          
          {/* Content Type Selection */}
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <p className="text-sm sm:text-base lg:text-md underline font-light font-inter tracking-tight mb-4 sm:mb-5">
              What would you like to start creating?
            </p>
            
            {/* Checkbox Options */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 min-w-fit">
                  <CustomCheckbox
                    id={option.id}
                    checked={contentType === option.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setContentType(option.value);
                      }
                    }}
                  />
                  <Label
                    htmlFor={option.id}
                    className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span className="font-inter uppercase text-sm sm:text-base lg:text-md">
                      {option.label}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="mt-12 sm:mt-16 lg:mt-20 pb-8 sm:pb-12 lg:pb-16">
            <Button 
              onClick={()=>router.push("/explore/home")}
              className="bg-blue-700 hover:bg-blue-800 font-bold tracking-tight text-base sm:text-lg lg:text-xl px-8 sm:px-12 lg:px-16 py-3 sm:py-4 rounded-lg font-inter transition-colors duration-200"
            >
              Explore
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}