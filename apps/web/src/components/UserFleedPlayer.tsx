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
    <video
    ref={videoRef} style={{width:"500px",height:"500px"}}
    muted autoPlay
    />
    </>
)
}