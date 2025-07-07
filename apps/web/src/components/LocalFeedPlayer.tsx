'use client'
type UserFleedPlayerProps = {
  stream: MediaStream | null;
  muted?: boolean;
};

import { useContext, useEffect, useRef } from "react"
import { SocketContext } from "../../app/Context/SocketContext"
export default function LocalFeedPlayer({stream}:UserFleedPlayerProps){
    
    const videoRef = useRef<HTMLVideoElement>(null)
    const {socket,totalParticipants} =useContext(SocketContext)
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
    
     const getVideoClass = () => {
        switch(totalParticipants) {
            case 1:
            case 2:
                return 'h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh]'
            case 3:
                return 'h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] xl:h-[65vh]'
            default:
                return 'h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh]'
        }
    }

    // console.log("Rendering video", { stream });

return (
    <>
   <div className="rounded-xl overflow-hidden" >
    
        <video
    ref={videoRef} style={{transform:"scaleX(-1)"}}
    className={`object-cover ${getVideoClass()}`}
    muted
    autoPlay
  />
        
  
</div>
    </>
)
}