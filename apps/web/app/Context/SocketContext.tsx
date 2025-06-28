'use client'
import SocketIoClient from 'socket.io-client'
import { createContext, useEffect, useReducer, useState } from 'react'
import { useRouter } from 'next/navigation'
import {v4 as UUIDv4} from 'uuid'
import Peer from 'peerjs'
import { peerReducer } from '../Reducers/peerReducer'
import { addPeerAction } from '../Actions/peerAction'

const ws_local = "https://podly-j8p7.onrender.com"

export const SocketContext = createContext<any | null>(null)

const socket = SocketIoClient(ws_local)

interface Props {
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({children}) => {
    const [myPeerId, setMyPeerId] = useState<string | null>(null);
    const [user, SetUser] = useState<Peer>()
    const [stream, SetStream] = useState<MediaStream>()
    const [peers, dispatch] = useReducer(peerReducer, {});

    const totalParticipants = Object.keys(peers).length + 1
 const [processedStream, setProcessedStream] = useState<MediaStream | null>(null);
   
    const fetchUserStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
        SetStream(stream)
    }

    const router = useRouter()

    useEffect(() => {
        const userId = UUIDv4()
        const newPeer = new Peer(userId, {
            host: "0.peerjs.com",
            port: 443,
            path: "/",
            secure: true,
        })
        SetUser(newPeer)
        setMyPeerId(userId)
        fetchUserStream()

        const enterRoom = ({roomId}: {roomId: string}) => {
            router.push(`/room/${roomId}`)
        }

        socket.on("room-created", enterRoom)

        return () => {
            socket.off("room-created", enterRoom)
        }
    }, [])

    
    useEffect(() => {
        const handlePeerUsername = ({ peerId, username }: { peerId: string; username: string }) => {
            console.log('Received peer username:', { peerId, username })
            dispatch({
                type: "UPDATE_PEER_USERNAME",
                payload: { peerId, username },
            });
        };

        
        const handleExistingUsers = (existingUsers: {peerId: string, username?: string}[]) => {
            console.log('Received existing users:', existingUsers)
            existingUsers.forEach(user => {
                if (user.username) {
                    dispatch({
                        type: "UPDATE_PEER_USERNAME",
                        payload: { peerId: user.peerId, username: user.username },
                    });
                }
            })
        }

        socket.on('peer-username', handlePeerUsername);
        socket.on('existing-users', handleExistingUsers);

        return () => {
            socket.off('peer-username', handlePeerUsername);
            socket.off('existing-users', handleExistingUsers);
        };
    }, [socket]);

    useEffect(() => {
        if (!user || !stream) return

        const localStream = processedStream || stream;

        const handleUserJoined = ({peerId}: {peerId: string}) => {
            const call = user.call(peerId, localStream)
            console.log("calling the new peer", peerId)
            call.on('stream', (remoteStream) => {
                dispatch(addPeerAction(peerId, remoteStream))
            })
        }

        const handleCall = (call: any) => {
            call.answer(localStream)
            call.on('stream', (remoteStream: MediaStream) => {
                dispatch(addPeerAction(call.peer, remoteStream))
            })
        }

        const handleVideoToggle = ({peerId, isVideoOff}: {peerId: string, isVideoOff: boolean}) => {
            dispatch({
                type: "UPDATE_PEER_VIDEO_STATUS",
                payload: {peerId, isVideoOff}
            })
        }

        const handleUserLeft = ({peerId}: {peerId: string}) => {
            dispatch({
                type: "REMOVE_PEER",
                payload: {peerId}
            })
        }

        socket.on('user-joined', handleUserJoined)
        socket.on('video-toggle', handleVideoToggle)
        socket.on('user-left', handleUserLeft)
        user.on("call", handleCall)

        socket.emit('ready')

        return () => {
            socket.off('user-joined', handleUserJoined);
            socket.off('video-toggle', handleVideoToggle);
            socket.off('user-left', handleUserLeft);
            user.off('call', handleCall);
        };
    }, [user, stream,processedStream])

    return (
        <SocketContext.Provider value={{setProcessedStream,myPeerId,processedStream, socket, user, dispatch,stream, peers, totalParticipants}}>
            {children}
        </SocketContext.Provider>
    )
}