'use client'

import { useParams } from "next/navigation"
import { useContext, useEffect } from "react"
import { SocketContext } from "../../Context/SocketContext"

export default function room(){
    const {id} = useParams()
    const {socket,user} = useContext(SocketContext)
    
    useEffect(()=>{
       
       if(user) socket.emit("joined-room",{roomId:id,peerId:user._id})
    },[id,user,socket])
    return (
<>
room : {id}
</>
    )
}