import { Socket } from "socket.io"
import {v4 as UUIDv4} from 'uuid'
const roomHandler = (socket:Socket)=> {

const createRoom = ()=>{  
    const roomId = UUIDv4()
    socket.join(roomId)
    socket.emit('room-created',{roomId})
    console.log('room created with id ',roomId)
}
const joinedRoom =({roomId}:{roomId:string})=> {
    console.log("new user has joined room ",roomId)
}
socket.on("create-room",createRoom)

socket.on("joined-room",joinedRoom)

}

export default roomHandler