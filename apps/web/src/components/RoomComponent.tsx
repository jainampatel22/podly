'use client'

import { redirect, useParams } from "next/navigation"
import { use, useContext, useEffect, useRef, useState } from "react"
import { SocketContext } from "../../app/Context/SocketContext"
import UserFleedPlayer from "@/components/UserFleedPlayer"
import Link from "next/link"
import { AuthOptions } from "next-auth"
import { Mic, MicOff, Video, PhoneOff, VideoOff, Monitor, Sparkles, Users } from 'lucide-react';
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import * as bodyPix from '@tensorflow-models/body-pix'
import '@tensorflow/tfjs';
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
type RoomId = {
    params: string
}

export default function RoomComponent({ params }: RoomId) {
    const router= useRouter()
    const [hasUploaded, setHasUploaded] = useState(false);
    const [roomName, setRoomName] = useState("untitled")
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const { setProcessedStream: setContextProcessedStream } = useContext(SocketContext);
    const [processedStream, setProcessedStream] = useState<MediaStream | null>(null)
    const [modelLoaded, setModelLoaded] = useState(false)
    const [modelError, setModelError] = useState<string | null>(null)
    const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)
    const [backgroundType, setBackgroundType] = useState<'blur' | 'image'>('blur')
    const [backgroundEffectEnabled, setBackgroundEffectEnabled] = useState(false)
    const { myPeerId, socket, user, dispatch, stream, peers, setPeers, totalParticipants } = useContext(SocketContext)
    const MediaRecorderRef = useRef<MediaRecorder | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [recording, setRecording] = useState(false);
    const { data: session } = useSession()

 
    const animationFrameRef = useRef<number | null>(null)
    const netRef = useRef<bodyPix.BodyPix | null>(null)
    const lastProcessTimeRef = useRef<number>(0)
 const backgroundImages = [

  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca'
];
const [selectedImage, setSelectedImage] = useState<string | null>(null);
const [customImage, setCustomImage] = useState<string | null>(null);


const debugImageExists = async (imagePath: string) => {
    try {
        const response = await fetch(imagePath);
        console.log(`Image ${imagePath} - Status: ${response.status}, Size: ${response.headers.get('content-length')} bytes`);
        return response.ok;
    } catch (error) {
        console.error(`Failed to fetch image ${imagePath}:`, error);
        return false;
    }
};

useEffect(() => {
    if (!backgroundEffectEnabled) {
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
    }
    setProcessedStream(null);
    setContextProcessedStream(stream); // 
    
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    return; 
}

    let isMounted = true;

    const loadModelAndStart = async () => {
        try {
            console.log('Loading BodyPix model...');
            
            // Try ResNet50 first for better quality
            let net;
            try {
                net = await bodyPix.load({
                    architecture: 'ResNet50',
                    outputStride: 16,
                    quantBytes: 2
                });
                console.log('ResNet50 model loaded successfully');
            } catch (resnetError) {
                console.warn('ResNet50 failed, falling back to MobileNet:', resnetError);
                net = await bodyPix.load({
                    architecture: 'MobileNetV1',
                    outputStride: 16,
                    multiplier: 0.75,
                    quantBytes: 2
                });
                console.log('MobileNetV1 model loaded successfully');
            }
            
            if (!isMounted) return;
            
            netRef.current = net;
            setModelLoaded(true);

            // Load background images
           if (backgroundType === 'image') {
    const img = await loadBackgroundImages();
    if (!img || !img.complete) {
        await new Promise<void>((resolve) => {
            const checkLoaded = () => {
                if (img && img.complete) {
                    resolve();
                } else {
                    setTimeout(checkLoaded, 50);
                }
            };
            checkLoaded();
        });
    }
}
        await setupVideo();
        } catch (error: any) {
            console.error('Error loading model:', error);
            if (isMounted) {
                setModelError(error.message || 'Failed to load AI model');
            }
        }
    };

   

const loadBackgroundImages = async () => {
  if (!selectedImage) return null;
  try {
    const exists = await debugImageExists(selectedImage);
    if (!exists) throw new Error('Image does not exist');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const loadPromise = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      setTimeout(() => reject(new Error('Image load timeout')), 5000);
    });
    img.src = selectedImage;
    await loadPromise;
    setBackgroundImage(img);
    return img;
  } catch (error) {
    setBackgroundImage(null);
    return null;
  }
};
    const setupVideo = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
            console.error('Video or canvas ref not available');
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get canvas context');
            return;
        }

        try {
            let mediaStream = stream;
            
            if (!mediaStream) {
                console.log('Getting user media...');
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280, min: 640 },
                        height: { ideal: 720, min: 480 },
                        frameRate: { ideal: 30, min: 15 }
                    },
                    audio: true
                });
            }

            if (!video.srcObject) {
                video.srcObject = mediaStream;
                
                await new Promise((resolve, reject) => {
                    video.onloadedmetadata = resolve;
                    video.onerror = reject;
                    setTimeout(reject, 10000);
                });

                await video.play();
            }

           
            let attempts = 0;
            while ((video.videoWidth === 0 || video.videoHeight === 0) && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                throw new Error('Video has no dimensions after timeout');
            }

            console.log('📹 Video setup complete:', video.videoWidth, 'x', video.videoHeight);
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            startProcessing(video, canvas, ctx);

        } catch (error: any) {
            console.error('Error setting up video:', error);
            if (isMounted) {
                setModelError('Failed to access camera: ' + error.message);
            }
        }
    };

    const startProcessing = (video: HTMLVideoElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        console.log('🎬 Starting video processing...');
        
       
        const processed = canvas.captureStream(25); 
        setProcessedStream(processed);
        setContextProcessedStream(processed);
        const processInterval = 1000 / 25; // 

        const renderFrame = async (currentTime: number) => {
            if (!isMounted || !video || video.readyState < 2) {
                if (isMounted) {
                    animationFrameRef.current = requestAnimationFrame(renderFrame);
                }
                return;
            }

   
            if (currentTime - lastProcessTimeRef.current < processInterval) {
                if (isMounted) {
                    animationFrameRef.current = requestAnimationFrame(renderFrame);
                }
                return;
            }

            lastProcessTimeRef.current = currentTime;

            try {
                const net = netRef.current;
                
                if (net) {
               
                    const segmentation = await net.segmentPerson(video, {
                        flipHorizontal: false,
                        internalResolution: 'medium',
                        segmentationThreshold: 0.7,
                        maxDetections: 1,
                        scoreThreshold: 0.4,
                        nmsRadius: 20
                    });

                    // Check person detection quality
                    const personPixels = segmentation.data.filter(pixel => pixel === 1).length;
                    const totalPixels = segmentation.data.length;
                    const personRatio = personPixels / totalPixels;

                    if (personRatio < 0.01) {
                        // Very low person detection, just show original video
                        console.warn('⚠️ Low person detection, showing original video');
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    } else {
                        // Apply background with person mask
                        applyBackgroundWithMask(ctx, canvas, segmentation, video);
                    }
                } else {
      
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                }

            } catch (error) {
                console.warn('Error in renderFrame:', error);
                
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            if (isMounted) {
                animationFrameRef.current = requestAnimationFrame(renderFrame);
            }
        };

        renderFrame(0);
    };

    const applyBackgroundWithMask = (
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        segmentation: any,
        video: HTMLVideoElement
    ) => {
       
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawBackground(ctx, canvas, video);
        
     
        const backgroundImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const backgroundData = backgroundImageData.data;
        
    
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const videoImageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
        const videoData = videoImageData.data;
        
        
        const finalImageData = ctx.createImageData(canvas.width, canvas.height);
        const finalData = finalImageData.data;
        

        for (let i = 0; i < segmentation.data.length; i++) {
            const pixelIndex = i * 4;
            
            if (segmentation.data[i] === 1) {
                
                finalData[pixelIndex] = videoData[pixelIndex] ?? 0;         // R
                finalData[pixelIndex + 1] = videoData[pixelIndex + 1] ?? 0; // G
                finalData[pixelIndex + 2] = videoData[pixelIndex + 2] ?? 0; // B
                finalData[pixelIndex + 3] = 255;                       // A
            } else {
               
                finalData[pixelIndex] = backgroundData[pixelIndex]??0;         // R
                finalData[pixelIndex + 1] = backgroundData[pixelIndex + 1] ?? 0 ; // G
                finalData[pixelIndex + 2] = backgroundData[pixelIndex + 2] ?? 0; // B
                finalData[pixelIndex + 3] = backgroundData[pixelIndex + 3] ?? 0; // A
            }
        }
        

        ctx.putImageData(finalImageData, 0, 0);
    };

    const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
        switch (backgroundType) {
            case 'image':
                if (backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
                    try {
                       
                        const imgAspect = backgroundImage.naturalWidth / backgroundImage.naturalHeight;
                        const canvasAspect = canvas.width / canvas.height;
                        
                        let drawWidth, drawHeight, drawX, drawY;
                        
                        if (imgAspect > canvasAspect) {
                           
                            drawHeight = canvas.height;
                            drawWidth = drawHeight * imgAspect;
                            drawX = (canvas.width - drawWidth) / 2;
                            drawY = 0;
                        } else {
                        
                            drawWidth = canvas.width;
                            drawHeight = drawWidth / imgAspect;
                            drawX = 0;
                            drawY = (canvas.height - drawHeight) / 2;
                        }
                        
                        ctx.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight);
                        console.log('🖼️ Background image drawn successfully');
                    } catch (error) {
                        console.error('Error drawing background image:', error);
                      
                    }
                } else {
                    console.warn('Background image not ready, using gradient');
                   
                }
                break;
                
            case 'blur':
                ctx.filter = 'blur(20px) brightness(0.8)';
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.filter = 'none';
                break;
                
           
            default:
             
                break;
        }
    };

    

    loadModelAndStart();

    return () => {
        isMounted = false;
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
}, [stream, backgroundType,backgroundEffectEnabled,selectedImage]);

 

    // Debug logs
    // useEffect(() => {
    //     console.log('🎨 Background state:', {
    //         backgroundType,
    //         imageLoaded: !!backgroundImage,
    //         imageComplete: backgroundImage?.complete,
    //         imageDimensions: backgroundImage ? `${backgroundImage.naturalWidth}x${backgroundImage.naturalHeight}` : 'N/A',
    //         imageSrc: backgroundImage?.src
    //     });
    // }, [backgroundType, backgroundImage]);

    // useEffect(() => {
    //     // console.log('📊 Component state:', {
    //     //     stream: !!stream,
    //     //     processedStream: !!processedStream,
    //     //     modelLoaded,
    //     //     modelError,
    //     //     isVideoOff,
    //     //     backgroundType
    //     });
    // }, [stream, processedStream, modelLoaded, modelError, isVideoOff, backgroundType]);

    if (!session) {
        redirect(`/sign-in?callbackUrl=/room/${params}`)
    }

    useEffect(() => {
        if (user && socket) {
            socket.emit("joined-room", { roomId: params, peerId: user._id })
        }
    }, [params, user, socket])


    useEffect(() => {
        if (socket && user && session?.user?.name) {
            console.log('Sending username:', { peerId: user._id, username: session.user.name })
            socket.emit('username', {
                peerId: user._id,
                username: session.user.name
            })
        }
    }, [socket, user, session?.user?.name])


    useEffect(() => {
        if (socket && session?.user?.name) {
            const handlePeerUsername = ({ peerId, username }: { peerId: string, username: string }) => {
                console.log('Received peer username:', { peerId, username })
                dispatch({
                    type: "UPDATE_PEER_USERNAME",
                    payload: { peerId, username }
                })
            }

            const handleExistingUsers = (existingUsers: { peerId: string, username?: string }[]) => {
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

            const handleVideoToggle = ({ peerId, isVideoOff }: { peerId: string, isVideoOff: boolean }) => {
                console.log('Received video toggle:', { peerId, isVideoOff })
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
            }
        }
    }, [socket, dispatch])

    const getGridClass = () => {
        switch (totalParticipants) {
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
        switch (totalParticipants) {
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
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
            const newAudioState = !audioTrack.enabled;
            audioTrack.enabled = newAudioState;
            setIsMuted(!newAudioState);

            // ✅ Toast feedback
            toast(newAudioState ? "✅ 🎙️ Mic unmuted" : "❌ 🎙️ Mic muted"
            );
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
                 toast(newIsVideoOff ? "🚫 📷 Video turned off" : "✅ 📷 Video turned on");
            }
        }
    }

    const RecordStream = async () => {
        try {
            const fullScreenStream = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: true
            });

            setRecordedChunks([]);

            MediaRecorderRef.current = new MediaRecorder(fullScreenStream);

            MediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    setRecordedChunks(prev => [...prev, e.data]);
                }
            };

            MediaRecorderRef.current.onstop = () => {
                fullScreenStream.getTracks().forEach(track => track.stop());
            };

            return true;
        } catch (error) {
            console.error('Error accessing display media:', error);
            alert('Failed to access screen recording. Please try again.');
            return false;
        }
    };

    const startRecording = () => {
        if (MediaRecorderRef.current && MediaRecorderRef.current.state === 'inactive') {
            setRecording(true);
            MediaRecorderRef.current.start(1000);
        }
        toast('🎙️ Recording has been started.')
    };

    const stopRecording = () => {
        if (MediaRecorderRef.current && MediaRecorderRef.current.state === 'recording') {
            MediaRecorderRef.current.stop();
            setRecording(false);
        }
         toast('🛑 Recording has been stoped.')
    };

    const handleStartRecording = async () => {
        const success = await RecordStream();
        if (success) {
            startRecording();
        }
    };

  useEffect(() => {
    const uploadToS3 = async (blob: Blob) => {
        try {
            if (!session) throw new Error('User not authenticated');
            const res = await fetch('/api/upload-url', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileType: blob.type,
                    userName: session.user?.name,
                    roomId: params
                })
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to get signed URL: ${errorText}`);
            }
            const { signedUrl, fileName } = await res.json();
            if (!signedUrl || !fileName) {
                throw new Error("Missing signedUrl or fileName from server");
            }
            const uploadRes = await fetch(signedUrl, {
                method: "PUT",
                headers: { "Content-Type": blob.type },
                body: blob,
            });
            if (!uploadRes.ok) throw new Error("Upload failed");
            console.log('uploaded to s3 successfully', fileName);
            const url ='/explore/projects'
            toast(`🚀 Your video has been recorded successfully`)
            setRecordedChunks([]); // Clear after successful upload
        } catch (error) {
            console.error("❌ Upload failed:", error);
           toast("❌ error recording video")
        }
    };

    if (!recording && recordedChunks.length > 0 && !hasUploaded) {
        setHasUploaded(true); // Set BEFORE upload to prevent double call
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        uploadToS3(blob);
    }
    if (recording && hasUploaded) {
        setHasUploaded(false); // Reset when starting a new recording
    }
}, [recording, recordedChunks, roomName, hasUploaded, session, params]);

    const renderVideoContent = () => {
        if(!backgroundEffectEnabled && stream ){
            return <UserFleedPlayer stream={stream} />;
        }
        if (isVideoOff) {
            return (
                <div className="text-white bg-gray-400 flex flex-col items-center justify-center w-full h-full">
                    <VideoOff size={48} className="mb-2 text-black" />
                    <span className="text-sm text-black">Camera is off</span>
                </div>
            );
        }

        if (modelError) {
            return (
                <div className="text-white bg-red-900/20 flex flex-col items-center justify-center w-full h-full">
                    <VideoOff size={48} className="mb-2 text-red-400" />
                    <span className="text-sm text-red-400 text-center px-4">{modelError}</span>
                    {stream && (
                        <div className="mt-2 w-full h-full">
                            <UserFleedPlayer stream={stream} />
                        </div>
                    )}
                </div>
            );
        }

        if (!modelLoaded) {
            return (
                <div className="text-white bg-blue-900/20 flex flex-col items-center justify-center w-full h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-2"></div>
                    <span className="text-sm text-gray-300">Loading camera effects...</span>
                    <span className="text-xs text-gray-400 mt-1">
                        {backgroundType === 'image' ? 'Loading background image...' : 'Please wait turning on model...'}
                    </span>
                </div>
            );
        }

        if (processedStream) {
            return <UserFleedPlayer stream={processedStream} />;
        }

        if (stream) {
            return <UserFleedPlayer stream={stream} />;
        }

        return (
            <div className="text-white bg-gray-900 flex flex-col items-center justify-center w-full h-full">
                <VideoOff size={48} className="mb-2 text-gray-400" />
                <span className="text-sm text-gray-400">No camera available</span>
                
            </div>
        );
    };
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    toast('❌ Failed uploading image. apply blur filter for now and then try for uploading image again.')
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const url = event.target?.result as string;
    setCustomImage(url);
    setSelectedImage(url);
    setBackgroundType('image');
    setBackgroundEffectEnabled(true);
  };
  reader.readAsDataURL(file);

};

    return (
        <>
            {/* Hidden video and canvas for processing */}
            <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                style={{ 
                    position: 'absolute', 
                    left: '-9999px', 
                    top: '-9999px', 
                    width: '1px', 
                    height: '1px' 
                }} 
            />
            <canvas 
                ref={canvasRef} 
                style={{ 
                    position: 'absolute', 
                    left: '-9999px', 
                    top: '-9999px', 
                    width: '1px', 
                    height: '1px' 
                }} 
            />

           <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl"></div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:block min-h-screen flex flex-col relative z-10">
                {/* Header */}
                <div className="flex-shrink-0 px-4 sm:px-6 lg:px-10 py-5">
                    <div className="backdrop-blur-sm bg-white/60 border border-white/80 rounded-2xl p-4 shadow-lg shadow-blue-100/50">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <a href="/">
                                <h1 className="cursor-pointer text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Podler
                                </h1>
                            </a>
                            <div className="w-px h-8 bg-gradient-to-b from-slate-200 to-slate-400"></div>
                            <h1 className="text-sm sm:text-md font-medium text-slate-700 truncate">
                                {session?.user?.name}'s Studio
                            </h1>
                            <input
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="text-lg font-medium bg-transparent text-slate-700 border-none focus:bg-white/40 cursor-pointer outline-none min-w-0 flex-1 sm:flex-initial rounded-lg px-2 py-1 transition-all duration-300"
                                placeholder="Room name"
                            />
                        </div>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="flex-1 px-4 sm:px-6 lg:px-10 pb-6">
                    <div className={`grid gap-4 ${getGridClass()} h-full`}>
                        {/* Local user */}
                        <div className={`backdrop-blur-sm bg-white/20 border border-white/30 rounded-3xl relative overflow-hidden shadow-lg shadow-blue-100/50 flex items-center justify-center ${getVideoClass()}`}>
                            <div className="w-full h-full rounded-3xl overflow-hidden">
                                {renderVideoContent()}
                            </div>
                            
                            <div className="absolute bottom-4 left-4 backdrop-blur-sm bg-black/60 border border-white/20 px-4 py-2 rounded-xl text-white font-medium text-sm">
                                {session?.user?.name || 'You'}
                            </div>

                            {/* Participant count indicator */}
                            <div className="absolute top-4 right-4 backdrop-blur-sm bg-black/60 border border-white/20 px-3 py-2 rounded-xl flex items-center gap-2">
                                <Users size={16} className="text-white" />
                                <span className="text-white text-sm font-medium">{totalParticipants}</span>
                            </div>
                        </div>

                        {/* Other users placeholder */}
                        {Object.keys(peers).map((peerId) => (
                            <div
                                key={peerId}
                                className={`backdrop-blur-sm bg-white/20 border border-white/30 rounded-3xl relative overflow-hidden shadow-lg shadow-blue-100/50 flex items-center justify-center ${getVideoClass()}`}
                            >
                                <div className="w-full h-full rounded-3xl overflow-hidden">
                                    <UserFleedPlayer stream={peers[peerId]?.stream} />
                                </div>
                                <div className="absolute bottom-4 left-4 backdrop-blur-sm bg-black/60 border border-white/20 px-4 py-2 rounded-xl text-white font-medium text-sm">
                                    {peers[peerId]?.username || "Loading..."}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Control Panel */}
                <div className="flex-shrink-0 p-4 sm:p-6">
                    <div className="backdrop-blur-sm bg-white/40 border border-white/60 rounded-3xl p-6 shadow-lg shadow-blue-100/50">
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                onClick={handleStartRecording}
                                disabled={recording}
                                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Monitor className="w-5 h-5" />
                                    {recording ? "Recording..." : " Record"}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Button>

                            {recording && (
                                <Button
                                    onClick={stopRecording}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                                >
                                    <span className="relative z-10">Stop </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Button>
                            )}
  
<Dialog>
  <DialogTrigger asChild>
    <Button className="backdrop-blur-sm pt-2 bg-white/20 hover:bg-white/30 border border-white/30 text-slate-700 hover:text-slate-900 font-medium rounded-2xl p-4 transition-all duration-300 hover:scale-105 shadow-lg">
      <Sparkles size={24} />
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Virtual Background Settings</DialogTitle>
      <DialogDescription>
        Choose your preferred background effect for the video call.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-3">
        <Label htmlFor="background-type">Background Effect</Label>
        <div className="grid grid-cols-2 gap-3">
          {/* Image Background Option */}
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              backgroundType === 'image' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setBackgroundType('image')}
          >
     <div className="flex flex-col items-center text-center">
  <label
    className={`w-32 h-24 flex flex-col items-center justify-center cursor-pointer rounded-xl border-2 transition-all duration-200
      ${backgroundType === 'image' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
    `}
    title="Upload custom background"
  >
    {customImage ? (
      <img
        src={customImage}
        alt="Custom background"
        className="w-32 h-24 object-cover rounded-lg"
      />
    ) : (
      <>
        <span className="text-3xl text-blue-400 mb-1">+</span>
        <span className="text-xs text-gray-500">Upload</span>
      </>
    )}
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleImageUpload}
    />
  </label>
  <span className="text-sm font-medium mt-2">Custom Image</span>
  <span className="text-xs text-gray-500 mt-1">Upload your own background</span>
</div>
          </div>

          {/* Blur Background Option */}
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              backgroundType === 'blur' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {setBackgroundType('blur')
                toast('✅ Blur effect added')
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Blur Effect</span>
              <span className="text-xs text-gray-500 mt-1">Blur your background</span>
            </div>
          </div>
       
        </div>
      </div>
      
      {/* Preview Section */}
      <div className="grid gap-3">
        <Label>Preview</Label>
        <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center border">
          {backgroundType === 'image' ? (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Custom Background Image</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-200 to-cyan-200 rounded blur-sm"></div>
              <span className="text-sm">Blurred Background</span>
            </div>
          )}
        </div>
      </div>
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button 
          type="button"
        onClick={()=>setBackgroundEffectEnabled(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Apply Background
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>


                            <Button
                                className="backdrop-blur-sm  pt-2 bg-white/20 hover:bg-white/30 border border-white/30 text-slate-700 hover:text-slate-900 font-medium rounded-2xl p-4 transition-all   duration-300 hover:scale-105 shadow-lg"
                                onClick={toggleVideo}
                            >
                                {isVideoOff ? (
                                    
                                    <VideoOff size={24} className="text-red-500" />
                                ) : (
                                    <Video size={24} />
                                )}
                            </Button>

                            <Button
                                className="backdrop-blur-sm pt-2 bg-white/20 hover:bg-white/30 border border-white/30 text-slate-700 hover:text-slate-900 font-medium rounded-2xl p-4 transition-all  duration-300 hover:scale-105 shadow-lg"
                                onClick={toggleMute}
                            >
                                {isMuted ? (
                                    <MicOff size={24} className="text-red-500" />
                                ) : (
                                    <Mic size={24} />
                                )}
                            </Button>

                            <Button onClick={()=>{
                                 {toast("Meeting has been ended ✅ ")}
                                 router.push(`/studio/${session.user?.name}-studio`)
                            }} className="backdrop-blur-sm bg-white/20 hover:bg-red-500/20 border border-white/30 hover:border-red-500/30 text-slate-700 hover:text-red-500 font-medium  rounded-2xl p-4 transition-all duration-300 hover:scale-105 shadow-lg">
                              
                            <PhoneOff size={24} />
                               
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden backdrop-blur-md min-h-screen flex flex-col relative z-10">
                <div className="backdrop-blur-sm bg-white/60 border-b border-white/80 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <a href="/">
                            <h1 className="cursor-pointer text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Podler
                            </h1>
                        </a>
                        <div className="w-px h-6 bg-gradient-to-b from-slate-200 to-slate-400"></div>
                        <h1 className="text-sm font-medium text-slate-700 truncate">
                            {session?.user?.name}'s Studio
                        </h1>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
                    <div className="backdrop-blur-sm bg-white/40 border border-white/60 rounded-3xl p-8 max-w-sm shadow-lg shadow-blue-100/50">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25">
                            <Monitor className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                            Desktop Required
                        </h1>
                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                            Studio access requires a desktop device for the best experience.
                        </p>
                        <Button 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                            onClick={() => window.location.href = '/'}
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}