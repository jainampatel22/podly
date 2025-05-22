'use client'
import SocketIoClient from 'socket.io-client'
import { createContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
const ws_local = "http://localhost:8080"
export const SocketContext = createContext<any |null >(null)
const socket = SocketIoClient(ws_local)


interface Props {
    children: React.ReactNode
}

export const SocketProvider:React.FC<Props>=({children})=>{

const router = useRouter()
useEffect(()=>{
const enterRoom =({roomId}:{roomId:string})=>{
    router.push(`/room/${roomId}`)
}
socket.on("room-created",enterRoom)
},[])
return (
<SocketContext.Provider value={{socket}}>
  {children}
</SocketContext.Provider>
    )
}