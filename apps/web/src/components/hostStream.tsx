'use client';

import { useState, useEffect, useRef, useContext } from "react";
import { Button } from "./ui/button";
import { SocketContext } from "../../app/Context/SocketContext";
import { Mic, Monitor, Video } from "lucide-react";
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
    <div className="flex flex-col items-center mt-8">
      {!stream ? (
        <div className="space-y-6">
  <Button
  onClick={showVideo}
  className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg px-12 py-6 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 group"
>
  {/* Overlay UNDERNEATH and non‑blocking */}
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

  <span className="relative z-10 flex items-center space-x-2 py-2">
    <Video className="w-6 h-6" />
    <span>Check Camera &amp; Mic</span>
  </span>
</Button>


          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-4 text-center">
              <Video className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-black text-sm">Camera Ready</p>
            </div>
            <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-4 text-center">
              <Mic className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-black text-sm">Mic Ready</p>
            </div>
          </div> */}
        </div>
      ) : (
        <div className="space-y-6">
          <Button
            onClick={initRoom}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg px-12 py-6 rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>Join Studio</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>

          <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-4 w-[450px] h-[320px] relative overflow-hidden shadow-xl">
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{ transform: "scaleX(-1)" }}
              playsInline
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
