'use client'

import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../Context/SocketContext"
import UserFleedPlayer from "@/components/UserFleedPlayer"
import Link from "next/link"
import { useSession } from "next-auth/react"
export default function room(){
    const [roomName,setRoomName] = useState("untitled")
    const {id} = useParams()
    const {socket,user,stream,peers,totalParticipants} = useContext(SocketContext)
    const {data:session} = useSession()
    useEffect(()=>{
       
       if(user) socket.emit("joined-room",{roomId:id,peerId:user._id})
    },[id,user,socket])

    const getGridCols =(count:number)=>{
        if(count<=1) return "grid-cols-1"
        if(count==2) return "grid-cols-2"
        if(count<=4) return "grid-cols-2"
        if (count <= 6) return "grid-cols-3";
        if (count <= 9) return "grid-cols-3";
        return "grid-cols-4"; // For >9    
    }
    return (
<>
{/* <div>
room : {id} <br />
<UserFleedPlayer stream={stream}/>
<div>
    other user feed:
    {
        Object.keys(peers).map((peerId)=>(
            <>
<UserFleedPlayer stream={peers[peerId].stream} key={peerId}/>
            </>
   ) )
    }
</div></div> */}
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

    <div className={`-mt-5 grid gap-4 ${getGridCols(totalParticipants)} p-4 `}>
        <UserFleedPlayer stream={stream}/>
        {
        Object.keys(peers).map((peerId)=>(
            <UserFleedPlayer stream={peers[peerId].stream} key={peerId} />
        ))
        }

    </div>
</div>
</div>
</>
    )
}