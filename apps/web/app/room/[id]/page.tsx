'use client'

import { useParams } from "next/navigation"
import { useContext, useEffect } from "react"
import { SocketContext } from "../../Context/SocketContext"
import UserFleedPlayer from "@/components/UserFleedPlayer"

export default function room(){
    const {id} = useParams()
    const {socket,user,stream,peers} = useContext(SocketContext)
    
    useEffect(()=>{
       
       if(user) socket.emit("joined-room",{roomId:id,peerId:user._id})
    },[id,user,socket])
    return (
<>
<div>
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
</div></div>

</>
    )
}