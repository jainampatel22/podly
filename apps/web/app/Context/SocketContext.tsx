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
const [myPeerId, setMyPeerId] = useState<string | null>(null);

const [user,SetUser]=useState<Peer>()
const [stream,SetStream]=useState<MediaStream>()
    const [peers, dispatch] = useReducer(peerReducer, {}); 
const totalParticipants =Object.keys(peers).length+1

const fetchUserStream =async ()=>{
 const stream=   await navigator.mediaDevices.getUserMedia({video:true,audio:true})
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
    setMyPeerId(userId)
fetchUserStream()
const enterRoom =({roomId}:{roomId:string})=>{
    router.push(`/room/${roomId}`)
}
socket.on("room-created",enterRoom)
},[])

useEffect(() => {
  const handleUsername = ({ peerId, username }: { peerId: string; username: string }) => {
    dispatch({
      type: "UPDATE_PEER_USERNAME",
      payload: { peerId, username },
    });
    console.log(username)
  };    

  socket.on('username', handleUsername);

  return () => {
    socket.off('username', handleUsername); // wrap in arrow function to return `void`
  };
}, [socket]);


useEffect(()=>{
if(!user || !stream) return
socket.on('user-joined',({peerId})=>{
const call = user.call(peerId,stream)
console.log("calling the new peer",peerId)
call.on('stream',(remoteStream)=>{
    dispatch(addPeerAction(peerId,remoteStream))
})
})
user.on("call",(call)=>{
    call.answer(stream)
    call.on('stream',(remoteStream)=>{
        dispatch(addPeerAction(call.peer,remoteStream))
    })
})
socket.on('video-toggle',({peerId,isVideoOff})=>{
    dispatch({
        type:"UPDATE_PEER_VIDEO_STATUS",
        payload:{peerId,isVideoOff}
    })
})


socket.emit('ready')
return () => {
    socket.off('user-joined');
    socket.off('video-toggle');
    user.off('call');
  };
},[user,stream])
return (
<SocketContext.Provider value={{myPeerId,socket,user,stream,peers,totalParticipants}}>
  {children}
</SocketContext.Provider>
    )
}