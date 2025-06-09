'use client';

import { useState, useEffect, useRef, useContext } from "react";
import { Button } from "./ui/button";
import { SocketContext } from "../../app/Context/SocketContext";
export default function HostStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {socket} = useContext(SocketContext)
 
  const initRoom =()=>{
    console.log("initializing new room")
    socket.emit("create-room")
  }

  const showVideo = async () => {
    try {
  const mediaStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 30 },
  },
  audio: true,
});

      setStream(mediaStream); // Set state (causes rerender)
    } catch (error) {
      console.error("Camera permission denied or error:", error);
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      setTimeout(() => {
        videoRef.current?.play().catch((err) =>
          console.error("Play failed:", err)
        );
      }, 50);
    }
  }, [stream]);

  return (
    <div className="flex flex-col items-center mt-10">
     {
        !stream ? (<>
         <Button
        onClick={showVideo}
        className="w-96  -ml-[69%] font-inter text-lg bg-blue-700 hover:bg-blue-900"
      >
      Check
      </Button>
        </>):(<>
         <Button
        onClick={initRoom}
        className="w-96  -ml-[69%] font-inter text-lg bg-blue-700 hover:bg-blue-900" 
      >
      Join Studio
      </Button>
        </>)
     }

      {stream && (<>
      
      <div className="-mt-60  ml-96 w-[350px] h-[300px]  rounded-xl relative overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted style={{transform:"scaleX(-1)"}}
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
    <div className="absolute top-52 left-[57%] bg-black/60 font-inter text-white px-2 py-1 text-sm rounded-xl">
720p / 30fps
  </div>
      </>
         )}
         
    </div>
  );
}
