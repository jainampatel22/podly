import { Socket } from "socket.io"
import {v4 as UUIDv4} from 'uuid'
import IRoomParams from "../interfaces/IRoomParams"

// Store room data with peer info including usernames
const rooms: Record<string, {peerId: string, username?: string, socketId: string}[]> = {}

const roomHandler = (socket: Socket) => {
    let currentRoom: string | null = null;
    let currentPeerId: string | null = null;

    const createRoom = () => {
        const roomId = UUIDv4()
        socket.join(roomId)
        rooms[roomId] = []
        currentRoom = roomId;
        socket.emit('room-created', {roomId})
        console.log('room created with id ', roomId)
    }

    const joinedRoom = ({roomId, peerId}: IRoomParams) => {
        if (rooms[roomId]) {
            console.log("new user has joined room ", roomId, "with peer id as", peerId)
            
            // Add user to room
            rooms[roomId].push({
                peerId: peerId,
                socketId: socket.id,
                username: undefined
            })
            
            socket.join(roomId)
            currentRoom = roomId;
            currentPeerId = peerId;
            
            socket.on("ready", () => {
                // Send existing users to new user
                const existingUsers = rooms[roomId]
                    .filter(user => user.peerId !== peerId)
                    .map(user => ({
                        peerId: user.peerId,
                        username: user.username
                    }))
                
                socket.emit('existing-users', existingUsers)
                
                // Notify others about new user
                socket.to(roomId).emit('user-joined', {peerId})
            })
        }
    }

    const handleUsername = ({peerId, username}: {peerId: string, username: string}) => {
        console.log(`Username received: peerId=${peerId}, username=${username}, room=${currentRoom}`)
        
        if (currentRoom && rooms[currentRoom]) {
            // Find and update the peer's username
            const peer = rooms[currentRoom].find(p => p.peerId === peerId)
            if (peer) {
                peer.username = username
                console.log(`Updated username for peer ${peerId}: ${username}`)
                
                // Broadcast username to all other users in the room
                socket.to(currentRoom).emit('peer-username', { peerId, username })
                console.log(`Broadcasting username to room ${currentRoom}`)
            } else {
                console.log(`Peer ${peerId} not found in room ${currentRoom}`)
            }
        }
    }

    const handleVideoToggle = ({peerId, isVideoOff}: {peerId: string, isVideoOff: boolean}) => {
        console.log(`Video toggle received: peerId=${peerId}, isVideoOff=${isVideoOff}, room=${currentRoom}`)
        
        if (currentRoom) {
            socket.to(currentRoom).emit('video-toggle', {peerId, isVideoOff})
            console.log(`Broadcasting video toggle to room ${currentRoom}`)
        }
    }

    const handleDisconnect = () => {
        if (currentRoom && rooms[currentRoom] && currentPeerId) {
            console.log(`User disconnecting: peerId=${currentPeerId}, room=${currentRoom}`)
            
            // Remove user from room
            rooms[currentRoom] = rooms[currentRoom].filter(user => user.peerId !== currentPeerId)
            
            // Notify other users
            socket.to(currentRoom).emit('user-left', {peerId: currentPeerId})
            console.log(`User ${currentPeerId} disconnected from room ${currentRoom}`)
        }
    }

    // Register all event listeners
    socket.on("create-room", createRoom)
    socket.on("joined-room", joinedRoom)
    socket.on("username", handleUsername)
    socket.on("video-toggle", handleVideoToggle)
    socket.on("disconnect", handleDisconnect)
}

export default roomHandler