'use client'
import Image, { type ImageProps } from "next/image";


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Update the path as needed

import { useContext, useState } from "react";
import { CustomCheckbox } from "@/components/ui/checkbox";
import { SocketContext } from "./Context/SocketContext";
import Header from "@/components/Header";
export default function LandingPage() {
const {socket} = useContext(SocketContext)
  const [contentType, setContentType] = useState("");
  const options = [
    { id: "podcast", label: "Podcasts", value: "PODCAST" },
    { id: "interview", label: "Interview", value: "INTERVIEW" },
    { id: "videochat", label: "Video Chat", value: "VIDEOCHAT" },
    { id: "webinar", label: "Webinar", value: "WEBINAR" },
  ];
  const initRoom =()=>{
    console.log("initializing new room")
    socket.emit("create-room")
  }
  return (
    
    <div className="bg-gray-200 min-h-screen">
<Header/>

  <div className="ml-[45%] mt-14 ">
  <Image
        src="https://shuttle.zip/images/homepage/icon.webp"
        alt="Shuttle Icon"
        width={90}
        height={90}
      />
     
    </div>
     <div className="ml-[22%] mt-5">
     <h1 className="text-7xl font-bold tracking-tighter font-inter">Create Your Ultimate</h1>
     <h1 className="text-7xl -mt-3 font-bold tracking-tighter font-inter"> <span className="text-blue-700"> piece </span> of content <span className="text-blue-700">.</span></h1>
<p className="mt-5 text-2xl font-light font-inter tracking-tight">Your online studio to record in high quality,  edit in a flash, and go
<br /> live with a bang. Not necessarily in that order.</p>

<p className="mt-8 text-md underline font-light font-inter tracking-tight">What would you like to start creating?</p>
    <div>
    <div className=" mt-5">
      

      <div className="flex gap-3">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
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
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <span className="font-inter uppercase  text-md">{option.label}</span>
            </Label>
          </div>
        ))}
      </div>
    </div>
    </div>
    <div>
      <Button className="ml-48 mt-8 bg-blue-700 font-bold tracking-tight border-black text-xl pt-4 pb-4 rounded-lg font-inter" onClick={initRoom}>Start For Free</Button>
    </div>
      </div>
    </div>
  );
}
