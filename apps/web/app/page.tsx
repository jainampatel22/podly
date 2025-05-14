'use client'
import Image, { type ImageProps } from "next/image";


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Update the path as needed

import { useState } from "react";
import { CustomCheckbox } from "@/components/ui/checkbox";
export default function LandingPage() {
  const [contentType, setContentType] = useState("");
  const options = [
    { id: "podcast", label: "Podcasts", value: "PODCAST" },
    { id: "interview", label: "Interview", value: "INTERVIEW" },
    { id: "videochat", label: "Video Chat", value: "VIDEOCHAT" },
    { id: "webinar", label: "Webinar", value: "WEBINAR" },
  ];
  return (
    
    <div className="bg-gray-200 min-h-screen">
<div className=" rounded-xl pt-5 mx-96 p-3">
  <div className="flex justify-between">
    <div>
      <h1 className="text-2xl text-blue-700 font-inter font-bold ml-3">Podly</h1>
    </div>
    <div className="flex font-inter font-semibold text-[#020202] text-xl gap-7">
      <h1><Link href='/pricing'>Pricing</Link></h1>
      <h1><Link href='/login'>Login</Link></h1>
    </div>
  </div>

  {/* Line below the navbar */}
  <div className="h-[1px] bg-gray-300 mt-3"></div>
</div>

  <div className="ml-[46%] mt-14 ">
  <Image
        src="https://shuttle.zip/images/homepage/icon.webp"
        alt="Shuttle Icon"
        width={90}
        height={90}
      />
     
    </div>
     <div className="ml-[28%] mt-5">
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
      <Button className="ml-48 mt-8 bg-blue-700 font-bold tracking-wide border-black text-xl pt-2 pb-2 rounded-lg font-inter">Start For Free</Button>
    </div>
      </div>
    </div>
  );
}
