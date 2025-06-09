'use client'

import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../Context/SocketContext"
import UserFleedPlayer from "@/components/UserFleedPlayer"
import Link from "next/link"
 
import { Mic, MicOff, Video, PhoneOff, VideoOff } from 'lucide-react';
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
export default function room(){
    const [roomName,setRoomName] = useState("untitled")
    const {id} = useParams()
    const {myPeerId,socket,user,stream,peers,totalParticipants} = useContext(SocketContext)
    const {data:session} = useSession()
      const [isMuted, setIsMuted] = useState(false);
        const [isVideoOff,setIsVideoOff] = useState(false);
    useEffect(()=>{
       
       if(user) socket.emit("joined-room",{roomId:id,peerId:user._id})
    },[id,user,socket])

    const getGridClass = () => {
        switch(totalParticipants) {
            case 1:
            case 2:
                return 'grid-cols-1 md:grid-cols-2'
            case 3:
                return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            default:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
    }

    
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

    const toggleMute =()=>{
        if(stream){
            const audioTrack = stream.getAudioTracks()[0]
            if(audioTrack){
                audioTrack.enabled = !audioTrack.enabled
                setIsMuted(!audioTrack.enabled)
            }
        }
    }
   const toggleVideo = () => {
  if (stream) {
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const newVideoState = !videoTrack.enabled;
                videoTrack.enabled = newVideoState;
                const newIsVideoOff = !newVideoState; // if enabled is false, then video is off
                setIsVideoOff(newIsVideoOff);
            
                // Emit the correct video status to other users
                socket.emit('video-toggle',{
                    peerId: myPeerId,
                    isVideoOff: newIsVideoOff
                })
    }
  }
};
const username = session?.user?.name
useEffect(() => {
  if (myPeerId && username) {
    socket.emit('username', {
      peerId: myPeerId,
      username: username
    });
  }
}, [myPeerId, username]);

    return (
<>

<div className="min-h-screen bg-black">
    
<div className="header gap-3 flex ml-10 p-5">
  <img
            src="https://shuttle.zip/images/homepage/icon.webp"
            width={35}
            height={35}
            alt=""
          />
          <Link href="/"><h1 className="cursor-pointer text-2xl font-semibold  font-inter text-white">PODLY</h1></Link>
          <div className="w-[2px] h-8 bg-gray-400"></div>
          
          <h1 className="text-md mt-1 cursor-pointer font-inter text-white">{session?.user?.name}'s STUDIO</h1>
 <input
      type="text"
      value={roomName}
      onChange={(e) => setRoomName(e.target.value)}
      className="text-xl ml-3 -mt-1 font-inter bg-transparent text-white border-none focus:bg-black/60 cursor-pointer outline-none"
    />
    
</div>
<div>

<div className={`grid gap-4 ${getGridClass()} p-6`}>
  {/* Local user */}
  <div className="rounded-xl relative -mt-5 overflow-hidden  bg-black flex items-center justify-start  ">
    {isVideoOff ? (
      <div className="text-white">Video is Off</div>
    ) : (<>
      <UserFleedPlayer stream={stream} />
   <div className="absolute bottom-3 bg-black/60 px-4 py-1 rounded-xl left-5 text-white font-inter">
{session?.user?.name}
   </div>
    </>
     )}
  </div>

  {/* Other users */}
  {Object.keys(peers).map((peerId) => (
    <div
      key={peerId}
      className="rounded-xl relative -mt-5 overflow-hidden  bg-black flex items-center justify-start "
    >
      {peers[peerId]?.isVideoOff ? (
        <div className="text-white">Video is Off</div>
      ) : (
        <>
        <UserFleedPlayer stream={peers[peerId].stream} />
      <div className="absolute bottom-3 bg-black/60 px-4 py-1 rounded-xl left-5 text-white font-inter">{peers[peerId]?.username ?? "anonymous"}</div>

        </>
        )}
    </div>
  ))}
</div>


  <div className="ml-96 flex items-center gap-4 mt-7">
  <Button className="rounded-xl bg-red-500 hover:bg-red-700 text-white font-inter px-8 py-4">
    Record
  </Button>

  <Button
    className="rounded-xl bg-white/10 text-white font-inter flex items-center justify-center p-4"
    onClick={toggleMute}
  >
    {isMuted ? <MicOff size={30} className="text-red-600"/> : <Mic size={30} />}
  </Button>

  <Button
    className="rounded-xl bg-white/10 text-white font-inter flex items-center justify-center p-4"
    onClick={toggleVideo}
  >
    {isVideoOff ? <VideoOff size={30} className="text-red-600"/> : <Video size={30}/>}
  </Button>
  <Button
    className="rounded-xl bg-white/10 text-white font-inter flex items-center justify-center p-4"
 
  >
    <PhoneOff className="text-red-500" size={30}/>
  </Button>
</div>

    </div>
</div>
</>
    )
}