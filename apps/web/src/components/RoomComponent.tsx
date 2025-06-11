'use client'

import { redirect, useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../app/Context/SocketContext"
import UserFleedPlayer from "@/components/UserFleedPlayer"
import Link from "next/link"
import { AuthOptions } from "next-auth"
import { Mic, MicOff, Video, PhoneOff, VideoOff } from 'lucide-react';
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"

export default function RoomComponent(){
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
    }, [socket, dispatch])

    const getGridClass = () => {
        switch(totalParticipants) {
            case 1:
                return 'grid-cols-1'
            case 2:
                return 'grid-cols-1 md:grid-cols-2'
            case 3:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            case 4:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'
            default:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
    }

    const getVideoClass = () => {
        switch(totalParticipants) {
            case 1:
                return 'h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]'
            case 2:
                return 'h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh]'
            case 3:
                return 'h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh]'
            default:
                return 'h-[25vh] sm:h-[35vh] md:h-[45vh] lg:h-[55vh]'
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
        <div className="hidden sm:block min-h-screen bg-black flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 px-4 sm:px-6 lg:px-10 py-3 sm:py-5">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <img
                        src="https://shuttle.zip/images/homepage/icon.webp"
                        width={35}
                        height={35}
                        alt=""
                        className="flex-shrink-0"
                    />
                    <Link href="/">
                        <h1 className="cursor-pointer text-xl sm:text-2xl font-semibold font-inter text-white">
                            PODLY
                        </h1>
                    </Link>
                    <div className="w-[2px] h-6 sm:h-8 bg-gray-400 hidden sm:block"></div>
                    <h1 className="text-sm sm:text-md cursor-pointer font-inter text-white truncate">
                        {session?.user?.name}'s STUDIO
                    </h1>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="text-lg sm:text-xl font-inter bg-transparent text-white border-none focus:bg-black/60 cursor-pointer outline-none min-w-0 flex-1 sm:flex-initial"
                        placeholder="Room name"
                    />
                </div>
            </div>

            {/* Video Grid */}
            <div className="mt-10 flex-1 px-3 sm:px-4 lg:px-6">
                <div className={`grid gap-2 sm:gap-3 lg:gap-4 ${getGridClass()} h-full`}>
                    {/* Local user */}
                    <div className={`rounded-lg lg:rounded-xl relative overflow-hidden  flex items-center justify-center ${getVideoClass()}`}>
                        {isVideoOff ? (
                            <div className="text-white   bg-black flex flex-col items-center justify-center w-full h-full">
                                <VideoOff size={48} className="mb-2 text-gray-400" />
                               {
                                totalParticipants ===1?(<>
                                <div className="absolute bottom-2 sm:bottom-3 bg-black/70 px-2 sm:px-4 py-1 rounded-md sm:rounded-xl left-2 ml-80 text-white font-inter text-xs sm:text-sm">
                                    {session?.user?.name || 'You'}
                                </div>
                                </>):(<>
                                <div className="absolute bottom-2 sm:bottom-3 bg-black/70 px-2 sm:px-4 py-1 rounded-md sm:rounded-xl left-2 sm:left-5 text-white font-inter text-xs sm:text-sm">
                                    {session?.user?.name || 'You'}
                                </div>
                                </>)
                             }

                            </div>
                        ) : (
                            <>
                                <UserFleedPlayer stream={stream} />
                                  {
                                totalParticipants ===1?(<>
                                <div className="absolute bottom-2 sm:bottom-3 bg-black/70 px-2 sm:px-4 py-1 rounded-md sm:rounded-xl left-2 ml-80 text-white font-inter text-xs sm:text-sm">
                                    {session?.user?.name || 'You'}
                                </div>
                                </>):(<>
                                <div className="absolute bottom-2 sm:bottom-3 bg-black/70 px-2 sm:px-4 py-1 rounded-md sm:rounded-xl left-2 sm:left-5 text-white font-inter text-xs sm:text-sm">
                                    {session?.user?.name || 'You'}
                                </div>
                                </>)
                             }
                            </>
                        )}
                    </div>

                    {/* Other users */}
                    {Object.keys(peers).map((peerId) => (
                        <div
                            key={peerId}
                            className={`rounded-lg lg:rounded-xl relative overflow-hidden  flex items-center justify-center ${getVideoClass()}`}
                        >
                            {peers[peerId]?.isVideoOff ? (
                                <div className="text-white flex bg-black/50  flex-col items-center justify-center w-full h-full">
                                    <VideoOff size={48} className="mb-2 text-gray-400" />
                                  <div className="absolute bottom-2 sm:bottom-3  px-2 sm:px-4 py-1 rounded-md sm:rounded-xl bg-black/80 left-2 sm:left-5 text-white font-inter text-xs sm:text-sm">
                                        {peers[peerId]?.username || "Loading..."}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <UserFleedPlayer stream={peers[peerId]?.stream} />
                                    <div className="absolute bottom-2 sm:bottom-3 bg-black/70 px-2 sm:px-4 py-1 rounded-md sm:rounded-xl left-2 sm:left-5 text-white font-inter text-xs sm:text-sm">
                                        {peers[peerId]?.username || "Loading..."}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Control Panel */}
            <div className="flex-shrink-0 p-4 sm:p-6">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <Button className="rounded-lg sm:rounded-xl bg-red-500 hover:bg-red-700 text-white font-inter px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-base">
                        Record
                    </Button>

                    <Button
                        className="rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white font-inter flex items-center justify-center p-3 sm:p-4"
                        onClick={toggleMute}
                    >
                        {isMuted ? (
                            <MicOff size={24} className="text-red-600 sm:w-7 sm:h-7"/>
                        ) : (
                            <Mic size={24} className="sm:w-7 sm:h-7" />
                        )}
                    </Button>

                    <Button
                        className="rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white font-inter flex items-center justify-center p-3 sm:p-4"
                        onClick={toggleVideo}
                    >
                        {isVideoOff ? (
                            <VideoOff size={24} className="text-red-600 sm:w-7 sm:h-7"/>
                        ) : (
                            <Video size={24} className="sm:w-7 sm:h-7"/>
                        )}
                    </Button>

                    <Button className="rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white font-inter flex items-center justify-center p-3 sm:p-4">
                        <PhoneOff className="text-red-500" size={24} />
                    </Button>
                </div>
            </div>
        </div>
        <div className="md:hidden bg-black/90 backdrop-blur-md  min-h-screen flex flex-col">
  <div className="bg-black text-white header gap-3 flex items-center px-4 sm:px-6 md:px-10 py-5">
    <img
      src="https://shuttle.zip/images/homepage/icon.webp"
      width={25}
      height={25}
      alt="logo"
    />
    <Link href="/">
      <h1 className="cursor-pointer text-lg sm:text-2xl font-semibold font-inter text-white">
        PODLY
      </h1>
    </Link>
    <div className="w-[2px] h-6 sm:h-8 bg-gray-400"></div>
    <h1 className="text-sm sm:text-md cursor-pointer font-inter text-white truncate">
      {session?.user?.name}'s STUDIO
    </h1>
  </div>

  <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
    <h1 className="text-white font-inter text-2xl sm:text-3xl font-semibold mb-4">
      You can't access this via mobile device
    </h1>
    <h1 className="text-white mt-4 font-inter text-xl sm:text-2xl">
      Please switch to a desktop device to continue
    </h1>
  </div>
</div>

        </>
    )
}