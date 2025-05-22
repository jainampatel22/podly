'use client'

import { useParams } from "next/navigation"
import { useContext, useEffect } from "react"
import { SocketContext } from "../../Context/SocketContext"

export default function room(){
    const {id} = useParams()
    const {socket} = useContext(SocketContext)
    
    useEffect(()=>{
        socket.emit("joined-room",{roomId:id})
    },[])
    return (
<>
room : {id}
</>
    )
}