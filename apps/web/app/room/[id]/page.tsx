'use client'

import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../Context/SocketContext"
import UserFleedPlayer from "@/components/UserFleedPlayer"
import Link from "next/link"
 
import { Mic, MicOff, Video, PhoneOff, VideoOff } from 'lucide-react';
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Room(){
    const [roomName, setRoomName] = useState("untitled")
    const {id} = useParams()
    const {myPeerId, socket, user, dispatch ,stream, peers, setPeers, totalParticipants} = useContext(SocketContext)
    const {data: session} = useSession()
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)

    // Join room when user is available
    useEffect(() => {
        if (user && socket) {
            socket.emit("joined-room", {roomId: id, peerId: user._id})
        }
    }, [id, user, socket])

    // Send username when we have all required data
    useEffect(() => {
        if (socket && user && session?.user?.name) {
            console.log('Sending username:', {peerId: user._id, username: session.user.name})
            socket.emit('username', {
                peerId: user._id,
                username: session.user.name
            })
        }
    }, [socket, user, session?.user?.name])

  
    // ... other useEffects remain the same

    // Update the socket event handlers
    useEffect(() => {
        if (socket && session?.user?.name) {

        const handlePeerUsername = ({peerId, username}: {peerId: string, username: string}) => {
            console.log('Received peer username:', {peerId, username})
            dispatch({
                type: "UPDATE_PEER_USERNAME",
                payload: { peerId, username }
            })
        }

        const handleExistingUsers = (existingUsers: {peerId: string, username?: string}[]) => {
            console.log('Received existing users:', existingUsers)
            existingUsers.forEach(user => {
                if (user.username) {
                    dispatch({
                        type: "UPDATE_PEER_USERNAME",
                        payload: { peerId: user.peerId, username: user.username }
                    })
                }
            })
        }

        const handleVideoToggle = ({peerId, isVideoOff}: {peerId: string, isVideoOff: boolean}) => {
            console.log('Received video toggle:', {peerId, isVideoOff})
            dispatch({
                type: "UPDATE_PEER_VIDEO_STATUS",
                payload: { peerId, isVideoOff }
            })
        }

        socket.on('peer-username', handlePeerUsername)
        socket.on('existing-users', handleExistingUsers)
        socket.on('video-toggle', handleVideoToggle)

        return () => {
            socket.off('peer-username', handlePeerUsername)
            socket.off('existing-users', handleExistingUsers)
            socket.off('video-toggle', handleVideoToggle)
        }}
    }, [socket, dispatch]) // Change setPeers to dispatch

    // ... rest of your component remains the same


    const getGridClass = () => {
        switch(totalParticipants) {
            case 1:
            case 2:
                return 'grid-cols-1 md:grid-cols-2'
            case 3:
                return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            default:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
    }

    const getVideoClass = () => {
        switch(totalParticipants) {
            case 1:
            case 2:
                return 'h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh]'
            case 3:
                return 'h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] xl:h-[65vh]'
            default:
                return 'h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh]'
        }
    }

    const toggleMute = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsMuted(!audioTrack.enabled)
            }
        }
    }

    const toggleVideo = () => {
        if (stream && user) {
            const videoTrack = stream.getVideoTracks()[0]
            if (videoTrack) {
                const newVideoState = !videoTrack.enabled
                videoTrack.enabled = newVideoState
                const newIsVideoOff = !newVideoState
                setIsVideoOff(newIsVideoOff)
                
                // Emit video status to server
                socket.emit('video-toggle', {
                    peerId: user._id,
                    isVideoOff: newIsVideoOff
                })
            }
        }
    }

    return (
        <>
            <div className="min-h-screen bg-black">
                <div className="header gap-3 flex ml-10 p-5">
                    <img
                        src="https://shuttle.zip/images/homepage/icon.webp"
                        width={35}
                        height={35}
                        alt=""
                    />
                    <Link href="/">
                        <h1 className="cursor-pointer text-2xl font-semibold font-inter text-white">PODLY</h1>
                    </Link>
                    <div className="w-[2px] h-8 bg-gray-400"></div>
                    <h1 className="text-md mt-1 cursor-pointer font-inter text-white">
                        {session?.user?.name}'s STUDIO
                    </h1>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="text-xl ml-3 -mt-1 font-inter bg-transparent text-white border-none focus:bg-black/60 cursor-pointer outline-none"
                    />
                </div>

                <div>
                    <div className={`grid gap-4 ${getGridClass()} p-6`}>
                        {/* Local user */}
                        <div className="rounded-xl relative -mt-5 overflow-hidden bg-black flex items-center justify-start">
                            {isVideoOff ? (
                                <div className="text-white flex items-center justify-center w-full h-[300px]">
                                    Video is Off
                                </div>
                            ) : (
                                <>
                                    <UserFleedPlayer stream={stream} />
                                    <div className="absolute bottom-3 bg-black/60 px-4 py-1 rounded-xl left-5 text-white font-inter">
                                        {session?.user?.name || 'You'}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Other users */}
                        {Object.keys(peers).map((peerId) => (
                            <div
                                key={peerId}
                                className="rounded-xl relative -mt-5 overflow-hidden bg-black flex items-center justify-start"
                            >
                                {peers[peerId]?.isVideoOff ? (
                                    <div className="text-white flex items-center justify-center w-full h-[300px]">
                                        Video is Off
                                    </div>
                                ) : (
                                    <>
                                        <UserFleedPlayer stream={peers[peerId]?.stream} />
                                        <div className="absolute bottom-3 bg-black/60 px-4 py-1 rounded-xl left-5 text-white font-inter">
                                            {peers[peerId]?.username || "Loading..."}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="ml-96 flex items-center gap-4 mt-7">
                        <Button className="rounded-xl bg-red-500 hover:bg-red-700 text-white font-inter px-8 py-4">
                            Record
                        </Button>

                        <Button
                            className="rounded-xl bg-white/10 text-white font-inter flex items-center justify-center p-4"
                            onClick={toggleMute}
                        >
                            {isMuted ? <MicOff size={30} className="text-red-600"/> : <Mic size={30} />}
                        </Button>

                        <Button
                            className="rounded-xl bg-white/10 text-white font-inter flex items-center justify-center p-4"
                            onClick={toggleVideo}
                        >
                            {isVideoOff ? <VideoOff size={30} className="text-red-600"/> : <Video size={30}/>}
                        </Button>

                        <Button className="rounded-xl bg-white/10 text-white font-inter flex items-center justify-center p-4">
                            <PhoneOff className="text-red-500" size={30}/>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}