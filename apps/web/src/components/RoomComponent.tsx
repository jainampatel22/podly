'use client'

import { redirect, useParams } from "next/navigation"
import { use, useContext, useEffect, useRef, useState } from "react"
import { SocketContext } from "../../app/Context/SocketContext"
import UserFleedPlayer from "@/components/UserFleedPlayer"
import Link from "next/link"
import { AuthOptions } from "next-auth"
import { Mic, MicOff, Video, PhoneOff, VideoOff } from 'lucide-react';
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import * as bodyPix from '@tensorflow-models/body-pix'
import '@tensorflow/tfjs';

type RoomId = {
    params: string
}

export default function RoomComponent({ params }: RoomId) {
    const [roomName, setRoomName] = useState("untitled")
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const { setProcessedStream: setContextProcessedStream } = useContext(SocketContext);
    const [processedStream, setProcessedStream] = useState<MediaStream | null>(null)
    const [modelLoaded, setModelLoaded] = useState(false)
    const [modelError, setModelError] = useState<string | null>(null)
    const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)
    const [backgroundType, setBackgroundType] = useState<'blur' | 'image' | 'gradient'>('gradient')
    
    const { myPeerId, socket, user, dispatch, stream, peers, setPeers, totalParticipants } = useContext(SocketContext)
    const MediaRecorderRef = useRef<MediaRecorder | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [recording, setRecording] = useState(false);
    const { data: session } = useSession()

    // Refs for cleanup
    const animationFrameRef = useRef<number | null>(null)
    const netRef = useRef<bodyPix.BodyPix | null>(null)
    const lastProcessTimeRef = useRef<number>(0)

    // Debug function to check if image exists
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
                await loadBackgroundImages();
                await setupVideo();

            } catch (error: any) {
                console.error('Error loading model:', error);
                if (isMounted) {
                    setModelError(error.message || 'Failed to load AI model');
                }
            }
        };

        const loadBackgroundImages = async () => {
            const backgroundUrls = [
                'https://imgs.search.brave.com/24FMZfs6O3ZVYzAaSbeyzaLvJKiLFS-24yHBTTeJNpQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvdmly/dHVhbC1tZWV0aW5n/LWJhY2tncm91bmQt/anJyYzlpZjR4YWkz/NnEzOS5qcGc',
                '/bg1.webp',
                '/x_banner.jpeg',
                '/bg1.jpg',
                '/bg2.jpg',
                '/default-bg.png'
            ];

            console.log('Starting background image loading...');

            for (const url of backgroundUrls) {
                try {
                    // First check if the image exists
                    const exists = await debugImageExists(url);
                    if (!exists) {
                        console.warn(`Image ${url} does not exist, skipping...`);
                        continue;
                    }

                    const img = new Image();
                    img.crossOrigin = 'anonymous'; // Handle CORS if needed
                    const loadPromise = new Promise<void>((resolve, reject) => {
                        img.onload = () => {
                            console.log(`✅ Background image loaded: ${url} (${img.naturalWidth}x${img.naturalHeight})`);
                            resolve();
                        };
                        img.onerror = (error) => {
                            console.warn(`❌ Failed to load image ${url}:`, error);
                            reject(error);
                        };
                        setTimeout(() => reject(new Error('Image load timeout')), 5000);
                    });

                    img.src = url;
                    await loadPromise;

                    if (isMounted) {
                        setBackgroundImage(img);
                        console.log('✅ Background image set successfully');
                        return;
                    }
                } catch (error) {
                    console.warn(`Failed to load background image from ${url}:`, error);
                    continue;
                }
            }
            
            console.warn('⚠️ All background images failed to load, using gradient fallback');
            if (isMounted) {
                setBackgroundImage(null);
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

                // Wait for video dimensions
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

                // Start processing
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
            
            // Create processed stream
            const processed = canvas.captureStream(25); // Reduced FPS for better performance
            setProcessedStream(processed);
            setContextProcessedStream(processed);
            const processInterval = 1000 / 25; // 25 FPS

            const renderFrame = async (currentTime: number) => {
                if (!isMounted || !video || video.readyState < 2) {
                    if (isMounted) {
                        animationFrameRef.current = requestAnimationFrame(renderFrame);
                    }
                    return;
                }

                // Throttle processing
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
                        // Get segmentation
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
                        // No background processing, just draw video
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    }

                } catch (error) {
                    console.warn('Error in renderFrame:', error);
                    // Fallback: draw video directly
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
            // Step 1: Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Step 2: Draw background
            drawBackground(ctx, canvas, video);
            
            // Step 3: Apply person mask using pixel manipulation
            const backgroundImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const backgroundData = backgroundImageData.data;
            
            // Get video frame data
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const videoImageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
            const videoData = videoImageData.data;
            
            // Create final image data
            const finalImageData = ctx.createImageData(canvas.width, canvas.height);
            const finalData = finalImageData.data;
            
            // Apply mask: person pixels from video, background pixels from background
            for (let i = 0; i < segmentation.data.length; i++) {
                const pixelIndex = i * 4;
                
                if (segmentation.data[i] === 1) {
                    // Person pixel - use video
                    finalData[pixelIndex] = videoData[pixelIndex] ?? 0;         // R
                    finalData[pixelIndex + 1] = videoData[pixelIndex + 1] ?? 0; // G
                    finalData[pixelIndex + 2] = videoData[pixelIndex + 2] ?? 0; // B
                    finalData[pixelIndex + 3] = 255;                       // A
                } else {
                    // Background pixel - use background
                    finalData[pixelIndex] = backgroundData[pixelIndex]??0;         // R
                    finalData[pixelIndex + 1] = backgroundData[pixelIndex + 1] ?? 0 ; // G
                    finalData[pixelIndex + 2] = backgroundData[pixelIndex + 2] ?? 0; // B
                    finalData[pixelIndex + 3] = backgroundData[pixelIndex + 3] ?? 0; // A
                }
            }
            
            // Draw the final composited image
            ctx.putImageData(finalImageData, 0, 0);
        };

        const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
            switch (backgroundType) {
                case 'image':
                    if (backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
                        try {
                            // Calculate aspect ratio and scaling
                            const imgAspect = backgroundImage.naturalWidth / backgroundImage.naturalHeight;
                            const canvasAspect = canvas.width / canvas.height;
                            
                            let drawWidth, drawHeight, drawX, drawY;
                            
                            if (imgAspect > canvasAspect) {
                                // Image is wider - fit to height
                                drawHeight = canvas.height;
                                drawWidth = drawHeight * imgAspect;
                                drawX = (canvas.width - drawWidth) / 2;
                                drawY = 0;
                            } else {
                                // Image is taller - fit to width
                                drawWidth = canvas.width;
                                drawHeight = drawWidth / imgAspect;
                                drawX = 0;
                                drawY = (canvas.height - drawHeight) / 2;
                            }
                            
                            ctx.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight);
                            console.log('🖼️ Background image drawn successfully');
                        } catch (error) {
                            console.error('Error drawing background image:', error);
                            drawGradientBackground(ctx, canvas);
                        }
                    } else {
                        console.warn('Background image not ready, using gradient');
                        drawGradientBackground(ctx, canvas);
                    }
                    break;
                    
                case 'blur':
                    ctx.filter = 'blur(20px) brightness(0.8)';
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    ctx.filter = 'none';
                    break;
                    
                case 'gradient':
                default:
                    drawGradientBackground(ctx, canvas);
                    break;
            }
        };

        const drawGradientBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
            const time = Date.now() * 0.001;
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            
            const hue1 = (time * 20) % 360;
            const hue2 = (time * 30 + 120) % 360;
            
            gradient.addColorStop(0, `hsl(${hue1}, 70%, 20%)`);
            gradient.addColorStop(0.5, `hsl(${(hue1 + hue2) / 2}, 50%, 15%)`);
            gradient.addColorStop(1, `hsl(${hue2}, 70%, 20%)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        loadModelAndStart();

        return () => {
            isMounted = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [stream, backgroundType]);

    const toggleBackground = () => {
        const types: Array<'blur' | 'image' | 'gradient'> = ['gradient', 'blur', 'image'];
        const currentIndex = types.indexOf(backgroundType);
        const nextIndex = (currentIndex + 1) % types.length;
        setBackgroundType(types[nextIndex] as 'blur' | 'image' | 'gradient');
        console.log('🔄 Background type changed to:', types[nextIndex]);
    };

    // Debug logs
    useEffect(() => {
        console.log('🎨 Background state:', {
            backgroundType,
            imageLoaded: !!backgroundImage,
            imageComplete: backgroundImage?.complete,
            imageDimensions: backgroundImage ? `${backgroundImage.naturalWidth}x${backgroundImage.naturalHeight}` : 'N/A',
            imageSrc: backgroundImage?.src
        });
    }, [backgroundType, backgroundImage]);

    useEffect(() => {
        console.log('📊 Component state:', {
            stream: !!stream,
            processedStream: !!processedStream,
            modelLoaded,
            modelError,
            isVideoOff,
            backgroundType
        });
    }, [stream, processedStream, modelLoaded, modelError, isVideoOff, backgroundType]);

    if (!session) {
        redirect(`/sign-in?callbackUrl=/room/${params}`)
    }

    // Join room when user is available
    useEffect(() => {
        if (user && socket) {
            socket.emit("joined-room", { roomId: params, peerId: user._id })
        }
    }, [params, user, socket])

    // Send username when we have all required data
    useEffect(() => {
        if (socket && user && session?.user?.name) {
            console.log('Sending username:', { peerId: user._id, username: session.user.name })
            socket.emit('username', {
                peerId: user._id,
                username: session.user.name
            })
        }
    }, [socket, user, session?.user?.name])

    // Update the socket event handlers
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
    };

    const stopRecording = () => {
        if (MediaRecorderRef.current && MediaRecorderRef.current.state === 'recording') {
            MediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const handleStartRecording = async () => {
        const success = await RecordStream();
        if (success) {
            startRecording();
        }
    };

    useEffect(() => {
        if (!recording && recordedChunks.length > 0) {
            console.log('Processing recorded chunks:', recordedChunks.length);

            const blob = new Blob(recordedChunks, { type: 'video/webm' });

            if (blob.size === 0) {
                alert("No video recorded, please try again");
                return;
            }

            console.log('Blob size:', blob.size);

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${roomName || 'recording'}.webm`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
    }, [recording, recordedChunks, roomName]);

    const renderVideoContent = () => {
        if (isVideoOff) {
            return (
                <div className="text-white bg-gray-900 flex flex-col items-center justify-center w-full h-full">
                    <VideoOff size={48} className="mb-2 text-gray-400" />
                    <span className="text-sm text-gray-400">Camera is off</span>
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
                        {backgroundType === 'image' ? 'Loading background image...' : 'Initializing AI model...'}
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
                        <div className={`rounded-lg lg:rounded-xl relative overflow-hidden bg-gray-900 flex items-center justify-center ${getVideoClass()}`}>
                            {renderVideoContent()}
                            
                            {totalParticipants === 1 ? (
                                <div className="absolute bottom-2 sm:bottom-3 bg-black/70 px-2 sm:px-4 py-1 rounded-md sm:rounded-xl left-2 ml-80 text-white font-inter text-xs sm:text-sm">
                                    {session?.user?.name || 'You'}
                                </div>
                            ) : (
                                <div className="absolute bottom-2 sm:bottom-3 bg-black/70 px-2 sm:px-4 py-1 rounded-md sm:rounded-xl left-2 sm:left-5 text-white font-inter text-xs sm:text-sm">
                                    {session?.user?.name || 'You'}
                                </div>
                            )}
                        </div>

                        {/* Other users */}
                        {Object.keys(peers).map((peerId) => (
                            <div
                                key={peerId}
                                className={`rounded-lg lg:rounded-xl relative overflow-hidden bg-gray-900 flex items-center justify-center ${getVideoClass()}`}
                            >
                                {peers[peerId]?.isVideoOff ? (
                                    <div className="text-white flex bg-black/50 flex-col items-center justify-center w-full h-full">
                                        <VideoOff size={48} className="mb-2 text-gray-400" />
                                        <div className="absolute bottom-2 sm:bottom-3 px-2 sm:px-4 py-1 rounded-md sm:rounded-xl bg-black/80 left-2 sm:left-5 text-white font-inter text-xs sm:text-sm">
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
                        <Button
                            onClick={handleStartRecording}
                            disabled={recording}
                            className="rounded-lg sm:rounded-xl bg-red-500 hover:bg-red-700 text-white font-inter px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-base"
                        >
                            {recording ? "Recording..." : "Start Recording"}
                        </Button>

                        {recording && (
                            <Button
                                onClick={stopRecording}
                                className="rounded-lg sm:rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-inter px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-base"
                            >
                                Stop Recording
                            </Button>
                        )}

                        <Button
                            onClick={toggleBackground}
                            className="rounded-lg sm:rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-inter px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-base"
                        >
                            BG: {backgroundType}
                        </Button>

                        <Button
                            className="rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white font-inter flex items-center justify-center p-3 sm:p-4"
                            onClick={toggleVideo}
                        >
                            {isVideoOff ? (
                                <VideoOff size={24} className="text-red-600 sm:w-7 sm:h-7" />
                            ) : (
                                <Video size={24} className="sm:w-7 sm:h-7" />
                            )}
                        </Button>

                        <Button className="rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white font-inter flex items-center justify-center p-3 sm:p-4">
                            <PhoneOff className="text-red-500" size={24} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="md:hidden bg-black/90 backdrop-blur-md min-h-screen flex flex-col">
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