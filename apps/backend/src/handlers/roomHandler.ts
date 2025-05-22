import { Socket } from "socket.io"
import {v4 as UUIDv4} from 'uuid'
import IRoomParams from "../interfaces/IRoomParams"
const rooms : Record<string,string[]>={}

const roomHandler = (socket:Socket)=> {

const createRoom = ()=>{  
    const roomId = UUIDv4()
    socket.join(roomId)
    rooms[roomId]=[]
    socket.emit('room-created',{roomId})
    console.log('room created with id ',roomId)
}
const joinedRoom = ({roomId,peerId}:IRoomParams)=> {
    if(rooms[roomId]){
    console.log("new user has joined room ",roomId,"with peer id as",peerId)
    rooms[roomId].push(peerId)
    socket.join(roomId)
    }
    
}
socket.on("create-room",createRoom)

socket.on("joined-room",joinedRoom)

}

export default roomHandler