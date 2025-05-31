import { useEffect, useRef } from "react"

export default function UserFleedPlayer({stream}:{stream:MediaStream}){
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(()=>{
        if(videoRef.current && stream){
            videoRef.current.srcObject=stream
        }
    },[stream])
return (
    <>
   <div className="rounded-xl overflow-hidden" >
  <video
    ref={videoRef} style={{ width: "500px", height: "500px" }}
    className=" object-cover"
    muted
    autoPlay
  />
</div>
    </>
)
}