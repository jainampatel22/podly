import { Socket } from "socket.io"
import {v4 as UUIDv4} from 'uuid'
import IRoomParams from "../interfaces/IRoomParams"

const rooms : Record<string,string[]>={}

const roomHandler = (socket:Socket)=> {
    let currentRoom: string | null = null; // Track which room this socket is in

    const createRoom = ()=>{
        const roomId = UUIDv4()
        socket.join(roomId)
        rooms[roomId]=[]
        currentRoom = roomId; // Set current room
        socket.emit('room-created',{roomId})
        console.log('room created with id ',roomId)
    }

    const joinedRoom = ({roomId,peerId}:IRoomParams)=> {
        if(rooms[roomId]){
            console.log("new user has joined room ",roomId,"with peer id as",peerId)
            rooms[roomId].push(peerId)
            socket.join(roomId)
            currentRoom = roomId; // Set current room
            
            socket.on("ready",()=>{
                socket.to(roomId).emit('user-joined',{peerId})
            })
        }
    }

    // Add video toggle handler
    const handleVideoToggle = ({peerId, isVideoOff}: {peerId: string, isVideoOff: boolean}) => {
        console.log(`Video toggle received: peerId=${peerId}, isVideoOff=${isVideoOff}, room=${currentRoom}`)
        
        if(currentRoom) {
            // Broadcast to all other users in the same room
            socket.to(currentRoom).emit('video-toggle', {peerId, isVideoOff})
            console.log(`Broadcasting video toggle to room ${currentRoom}`)
        } else {
            console.log('No current room found for video toggle')
        }
    }

    // Handle user leaving/disconnecting
    const handleDisconnect = () => {
        if(currentRoom && rooms[currentRoom]) {
            // Remove user from room
            const socketPeerId = socket.id; // or however you track the peer ID
            rooms[currentRoom] = rooms[currentRoom].filter(peerId => peerId !== socketPeerId)
            
            // Notify other users
            socket.to(currentRoom).emit('user-left', {peerId: socketPeerId})
            console.log(`User disconnected from room ${currentRoom}`)
        }
    }
   const handleUsername = ({peerId,username}:{peerId:string,username:string}) => {
  if (currentRoom ) {
    socket.to(currentRoom).emit('peer-username', { peerId, username });
  }
};

    // Register all event listeners
    socket.on("create-room", createRoom)
    socket.on("joined-room", joinedRoom)
    socket.on("video-toggle", handleVideoToggle)
    socket.on("disconnect", handleDisconnect)
socket.on('username',handleUsername)
}

export default roomHandler