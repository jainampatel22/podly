'use client'
import SocketIoClient from 'socket.io-client'
import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {v4 as UUIDv4} from 'uuid'
import Peer from 'peerjs'
const ws_local = "http://localhost:8080"
export const SocketContext = createContext<any |null >(null)
const socket = SocketIoClient(ws_local)


interface Props {
    children: React.ReactNode
}

export const SocketProvider:React.FC<Props>=({children})=>{

const [user,SetUser]=useState<Peer>()
const [stream,SetStream]=useState<MediaStream>()

const fetchUserStream =async ()=>{
 const stream=   await navigator.mediaDevices.getUserMedia({video:true,audio:false})
 SetStream(stream)
}

const router = useRouter()
useEffect(()=>{
    const userId = UUIDv4()
    const newPeer  = new Peer(userId)
    SetUser(newPeer)
fetchUserStream()
const enterRoom =({roomId}:{roomId:string})=>{
    router.push(`/room/${roomId}`)
}
socket.on("room-created",enterRoom)
},[])
return (
<SocketContext.Provider value={{socket,user,stream}}>
  {children}
</SocketContext.Provider>
    )
}