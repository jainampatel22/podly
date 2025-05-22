'use client'

import { useParams } from "next/navigation"
import { useContext, useEffect } from "react"
import { SocketContext } from "../../Context/SocketContext"
import UserFleedPlayer from "@/components/UserFleedPlayer"

export default function room(){
    const {id} = useParams()
    const {socket,user,stream} = useContext(SocketContext)
    
    useEffect(()=>{
       
       if(user) socket.emit("joined-room",{roomId:id,peerId:user._id})
    },[id,user,socket])
    return (
<>
room : {id}
<UserFleedPlayer stream={stream}/>
</>
    )
}