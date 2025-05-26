'use client'
import SocketIoClient from 'socket.io-client'
import { createContext, useEffect, useReducer, useState } from 'react'
import { useRouter } from 'next/navigation'
import {v4 as UUIDv4} from 'uuid'
import Peer from 'peerjs'
import { peerReducer } from '../Reducers/peerReducer'
import { addPeerAction } from '../Actions/peerAction'
const ws_local = "http://localhost:8080"
export const SocketContext = createContext<any |null >(null)
const socket = SocketIoClient(ws_local)


interface Props {
    children: React.ReactNode
}

export const SocketProvider:React.FC<Props>=({children})=>{

const [user,SetUser]=useState<Peer>()
const [stream,SetStream]=useState<MediaStream>()
    const [peers, dispatch] = useReducer(peerReducer, {}); 


const fetchUserStream =async ()=>{
 const stream=   await navigator.mediaDevices.getUserMedia({video:true,audio:false})
 SetStream(stream)
}

const router = useRouter()
useEffect(()=>{
    const userId = UUIDv4()
    const newPeer  = new Peer(userId,{
         host: "0.peerjs.com",
          port: 443,
          path: "/",
          secure: true,

    })
    SetUser(newPeer)
fetchUserStream()
const enterRoom =({roomId}:{roomId:string})=>{
    router.push(`/room/${roomId}`)
}
socket.on("room-created",enterRoom)
},[])

useEffect(()=>{
if(!user || !stream) return
socket.on('user-joined',({peerId})=>{
const call = user.call(peerId,stream)
console.log("calling the new peer",peerId)
call.on('stream',()=>{
    dispatch(addPeerAction(peerId,stream))
})
})
user.on("call",(call)=>{
    call.answer(stream)
    call.on('stream',()=>{
        dispatch(addPeerAction(call.peer,stream))
    })
})
socket.emit('ready')
},[user,stream])
return (
<SocketContext.Provider value={{socket,user,stream,peers}}>
  {children}
</SocketContext.Provider>
    )
}