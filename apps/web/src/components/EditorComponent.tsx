'use client'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { toast } from "sonner"
import {  Dropzone,
  DropZoneArea,
DropzoneTrigger,
  DropzoneMessage,
useDropzone, } from '@/components/ui/dropzone';
import { redirect, useRouter } from 'next/navigation';

  import { useSession } from 'next-auth/react';
import { CloudUpload, CloudUploadIcon, Monitor, Pause, Play, Scissors, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from './ui/button';
export default function EditorComponent() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [start, setStart] = useState('0');
  const [duration, setDuration] = useState('5');
  const [premiumUser,setPremiumUser]=useState(false)
  const [allowed,setAllowed]=useState(true)
const[showTextInput,setShowTextInput]=useState(false)
  const [showTrimInputs, setShowTrimInputs] = useState(false);
  const [showScaleInput,setShowScaleInput]=useState(false)
  const [text, setText] = useState('');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [grayScale,setGrayScale]=useState(false)
  const {data:session}=useSession()
  const [processing,setProcessing]=useState(false)
  const [width,setWidth]=useState('')
    const [caption,setCaption]=useState(false)
    const  [height,setHeight]=useState('')
    const videoRef = useRef<HTMLVideoElement>(null)
    const [boxWidth, setBoxWidth] = useState(1920); 
 const [isPlaying, setIsPlaying] = useState(false);
 const [speedInput,setShowSpeedInput]=useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
const [timelineFrames, setTimelineFrames] = useState<{ time: number; url: string }[]>([]);
const [trimStartFrame, setTrimStartFrame] = useState(0);
const [trimEndFrame, setTrimEndFrame] = useState(5); 
const [clickCount, setClickCount] = useState(0);
const [tempStart, setTempStart] = useState<number | null>(null);
const [grayScaleCount , setGrayScaleCount]=useState(0)
const [speed,setSpeed] = useState(1)
const router = useRouter()
const handleFrameClick = (frameIndex: number) => {
  if (clickCount === 0) {
    setTempStart(frameIndex);
    setClickCount(1);
  } else if (clickCount === 1 && tempStart !== null) {
    const start = Math.min(tempStart, frameIndex);
    const end = Math.max(tempStart, frameIndex);
    setTrimStartFrame(start);
    setTrimEndFrame(end);
    setClickCount(0);
    setTempStart(null);
   
  }
};


   if (!session) { redirect(`/sign-in?callbackUrl=/studio/editor`) }
useEffect(() => {
  const checkUser = async () => {
    try {
      const user = session?.user?.email;

      if (!user) return; 

      const res = await axios.post('/api/check-premium-user', { email: user });
      
      setPremiumUser(res.data.plan === "PRO" || res.data.plan =="PROPlus");
    } catch (error) {
      // console.error("Failed to check premium status", error);
      setPremiumUser(false); 
    }
  };

  checkUser();
}, [session]);
useEffect(() => {
  const interval = setInterval(async () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = new Date().toLocaleDateString("en-CA", { timeZone });
const date = new Date(localDate + 'T00:00:00Z');
    try {
    
      await axios.post('/api/log-usage', {
        localDate,
        feature: '/studio/editor',
        seconds: 5, 
        timeZone,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      
      const res = await axios.get(`/api/log-usage?feature=/studio/editor&localDate=${localDate}`);
      //  console.log('Usage response:', res.data);
      if (!res.data.allowed) {
        
toast("You've reached your free limit for today. Come back tomorrow or upgrade to continue! 🚀")
        router.push('/');
      }
    } catch (err) {
      console.error('Usage tracking failed:', err);
    }
  }, 5000); 

  return () => clearInterval(interval);
}, []);


  
useEffect(() => {
  if (videoFile) {
    extractTimeLineFrame(videoFile, 1).then((frames) => {
      setTimelineFrames(frames);
    });
  }
}, [videoFile]);

useEffect(() => {
  const savedBlobUrl = localStorage.getItem('useruploadedfile');
  if (savedBlobUrl) {
    setVideoUrl(savedBlobUrl);
  }
}, []);


useEffect(() => {
  if (!videoFile) {
    setVideoUrl(null);
    return;
  }
  const url = URL.createObjectURL(videoFile);
  setVideoUrl(url);
  return () => {
    URL.revokeObjectURL(url);
  };
}, [videoFile]);
const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
 setProcessing(true)
 toast("it will take approx 1min to render your video in free plan")
    const fileStatus = dropzone.fileStatuses.find(f=>f.status =='success')
    if(!fileStatus){ 
        alert("select video")
         return
        }
        const blobUrl = URL.createObjectURL(fileStatus.file)
        localStorage.setItem('useruploadedfile',blobUrl)
 const videoFile = fileStatus.file
  const operations = [];

  if (trimStartFrame !=null && trimEndFrame !=null &&videoRef.current) {
    const startTime = timelineFrames[trimStartFrame]?.time ?? 0
    const endTime = timelineFrames[trimEndFrame]?.time?? 5
    const duration = endTime-startTime
    operations.push({ type: 'trim', start:startTime, duration });
  }

  if (text) {
    operations.push({ type: 'drawtext', text, x: 10, y: 10 }); // you can add x/y UI later
  }
  if(width && height){
    operations.push({type:'scale',width,height})
  }
  if(grayScale){
    operations.push({type:'grayscale'})
  }
  if(speed){
    operations.push({type:'speed',rate:speed})
  }
  if(caption){
    operations.push({type:"captions"})
  }
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('operations', JSON.stringify(operations));

  setLoading(true);
  try {
    const res = await axios.post('https://podly-editor.onrender.com/upload', formData, {
      responseType: 'blob',
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const videoBlob = new Blob([res.data], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);
    setOutputUrl(videoUrl);
    toast('🎉 Video processed successfully!',{
      duration:2000
    })
    setProcessing(false)
  } catch (error) {
    console.error(error);
   toast('❌ Video processing Failed!',{
    duration:2000
   })
  } finally {
    setLoading(false);
  }
};

const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVideoFile(file)
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        "video/*": ['mp4']
      },
      maxSize: 50 * 1024 * 1024,
      maxFiles:1
    },
  });
  
  useEffect(() => {
    if (!videoFile) return;

    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.src = URL.createObjectURL(videoFile);

    videoEl.onloadedmetadata = () => {
      const naturalWidth = videoEl.videoWidth;
      const maxWidth = 1400;
      const minWidth = 800;
      const newWidth = Math.min(Math.max(naturalWidth, minWidth), maxWidth);
      setBoxWidth(newWidth);
      URL.revokeObjectURL(videoEl.src);
    };
  }, [videoFile]);

  const togglePlay = () => {
  const video = videoRef.current;
  if (!video) return;

  if (video.paused) {
    video.play();
    setIsPlaying(true);
  } else {
    video.pause();
    setIsPlaying(false);
  }
};

const extractTimeLineFrame = (file: File, fps = 1): Promise<{ time: number; url: string }[]> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const frames: { time: number; url: string }[] = [];

    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.crossOrigin = "anonymous";
    video.muted = true;

    video.onloadedmetadata = () => {
      const duration = video.duration;
      const step = 1 / fps;
      let currentTime = 0;

      canvas.width = video.videoWidth / 5;
      canvas.height = video.videoHeight / 5;

      const captureFrame = () => {
        if (currentTime > duration) {
          resolve(frames);
          return;
        }

        video.currentTime = currentTime;
      };

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push({
          time: currentTime,
          url: canvas.toDataURL("image/jpeg"),
        });

        currentTime += step;
        captureFrame();
      };

      captureFrame();
    };
  });
};
const downloadVideo=(blobUrl:string,fileName:string = 'rendered-video.mp4')=>{
const a = document.createElement('a')
a.href=blobUrl
a.download=fileName
document.body.appendChild(a)
a.click()
document.body.removeChild(a)
}
  return (
  <>
  <div className="min-h-screen  relative overflow-hidden">
      <div className="hidden bg-black md:block relative z-10">
        <header className="px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-sm bg-black/60 border border-white/20 rounded-2xl px-6 py-4 flex items-center space-x-4 shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <Link href='/'>Podler</Link>
              </h1>
              <div className="w-px h-8 bg-white/30"></div>
              <h2 className="text-white/90 font-medium">
                {session?.user?.name}'s Studio
              </h2>
            </div>
          </div>
        </header>
     <div className="flex min-h-screen bg-black text-white">

 {videoFile ? (
<div className="w-72 bg-black/60 backdrop-blur-md border-r border-white/20 p-6 shadow-lg">
  <div className=" pl-2">
    <div className='mb-20 p-5 text-2xl  '>🎬  Video Effects</div>
    <div className="flex -mt-7 ml-4 items-center gap-3 text-white">
      <h1 className="text-2xl mb-2 font-semibold cursor-pointer" onClick={() => {
        setShowScaleInput(false)
        setShowSpeedInput(false)
        setShowTextInput(false)
        setShowTrimInputs((prev) => !prev)}} >Trim</h1>
      
      <h1 className=''>✂️</h1>
      
    </div>
   
     {showTrimInputs && (
          <div className="mt-6 mb-4 space-y-4">
            <div className="flex flex-col text-white text-sm">
              <p className=" mb-2 ml-3 -mt-5 text-sm text-white/50 max-w-[180px]">
      Select a range to trim your video.
    </p>
              <label htmlFor="trimStart" className="mb-1 ml-3">Start Time</label>
              <input
                id="trimStart"
                type="number"
                value={trimStartFrame}
                onChange={(e) => setTrimStartFrame(Number(e.target.value))}
                placeholder="e.g. 0"
                className="bg-black/30 ml-3 border border-white/10 rounded px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col text-white text-sm">
              <label htmlFor="trimEnd" className="mb-1 ml-3">End Time</label>
              <input
                id="trimEnd"
                type="number"
                value={trimEndFrame}
                onChange={(e) => setTrimEndFrame(Number(e.target.value))}
                placeholder="e.g. 5"
                className="bg-black/30 border ml-3 border-white/10 rounded px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
       
     <div className="flex mt-5 ml-4 items-center gap-3 text-white">
      <h1 className="text-2xl  font-semibold cursor-pointer" onClick={()=>{
        toast("Premium subscription is required")
      }} >Merge</h1>
      
      <h1 className='-mt-2'>⚒</h1>
      
    </div>

        {
          premiumUser ?(<div className="flex items-center gap-3 text-white">
      <h1 className="text-2xl ml-4 ml-3 mt-7 font-semibold cursor-pointer" onClick={() =>{
        setShowTrimInputs(false)
        setShowTextInput((prev) => !prev)
        
        } } >Text</h1>
     <h1 className='mt-7 '>💬</h1>
    </div>
    ):(<div className="flex items-center gap-3 text-white">
      <h1 className="text-2xl ml-4 mt-7 font-semibold cursor-pointer" onClick={() =>{
        toast("premium subscription is required")
        
        } } >Text</h1>
     <h1 className='mt-7'>💬</h1>
    </div>
    )
        }
   
    {
      showTextInput && (
        <>
        <div className='mt-5'>
           <p className="mt-2 ml-3 mb-4 text-sm text-white/50 max-w-[180px]">
      Add a Text to your video.
    </p>
 <label htmlFor="Enter Text" className='ml-3'>Enter Text </label>
        <Input className='border ml-3 border-white/20 mt-2' onChange={(e)=>setText(e.target.value)}/>
        </div>
       
        </>
      )
    }

       <div className="flex items-center gap-3 text-white">
      <h1 className="text-2xl mt-7 ml-4 font-semibold cursor-pointer" onClick={() => {
        setShowTextInput(false)
        setShowSpeedInput(false)
        
        setShowScaleInput((prev) => !prev)} }>Scale</h1>
     <h1 className='mt-7'>📐</h1>
    </div>
    
    
    {
      showScaleInput && (
        <>
        <div className='mt-5'>
          <p className="mt-2 mb-4 ml-3 text-sm text-white/50 max-w-[180px]">
      Add a Scale to your video.
    </p>
 <label htmlFor="Enter Text" className='ml-3'>Enter Width </label>
        <Input className='border border-white/20 mt-2 mb-2 ml-3' onChange={(e)=>setWidth(e.target.value)}/>

        <label htmlFor="Enter Text" className='ml-3'>Enter Height </label>
        <Input className='border border-white/20 mt-2 ml-3' onChange={(e)=>setHeight(e.target.value)}/>

        </div>
       
        </>
      )
    }

     <div className="flex items-center gap-3 text-white">
    <h1
  className="text-2xl mt-7 ml-4 font-semibold cursor-pointer"
  onClick={() => {
    const newValue = !grayScale; // compute next state
    setGrayScale(newValue);

    toast(newValue ? '🌑 Grayscale has been added!' : '❌ Grayscale has been removed!', {
      duration: 2000,
    });
  }}
>
  Grayscale
</h1>
<h1 className="mt-7">🌑</h1>

    </div>
    
   

     <div className="flex items-center gap-3 text-white">
      <h1 className="text-2xl mt-7 ml-4 font-semibold cursor-pointer" onClick={()=>{
        setShowScaleInput(false)
        setShowTextInput(false)
        setShowTrimInputs(false)
        setShowSpeedInput(prev =>!prev)}} >Speed</h1>
     <h1 className='mt-7'>🚀</h1>
    </div>
    
    
    {
      speedInput && (
        <>
        <div className='mt-5'>
          <p className="mt-2 ml-3 mb-4 text-sm text-white/50 max-w-[180px]">
     Increase or decrease the playback speed 
    </p>
 <label htmlFor="Enter Text" className='ml-3'>Enter Speed </label>
        <Input className='border border-white/20 ml-3 mt-2' placeholder='Range 0.5 - 2.0'  onChange={(e) => setSpeed(parseFloat(e.target.value))}/>
        </div>
       
        </>
      )
    }

   {
    premiumUser ? ( <div className="flex items-center gap-3 text-white">
    <h1
  className="text-xl mt-7 ml-4 font-semibold cursor-pointer"
  onClick={() => {
    const newValue = !caption; // compute next state
    setCaption(newValue);

    toast(newValue ? '🌑 Live caption has been added!' : '❌ Live caption has been removed!', {
      duration: 2000,
    });
  }}
>
  Live Captions
</h1>
<h1 className="mt-7">🔴</h1>

    </div>):(
       <div className="flex items-center gap-3 text-white">
    <h1
  className="text-xl mt-7 ml-4 font-semibold cursor-pointer"
  onClick={() => {
    
    toast("Premium subscription is required")
  }}
>
  Live Captions
</h1>
<h1 className="mt-7">🔴</h1>

    </div>
    )
   }

     <div className="flex items-center gap-3 text-white">
    <h1
  className="text-xl mt-7 ml-4 font-semibold cursor-pointer"
  onClick={() => {
   if(outputUrl){
    downloadVideo(outputUrl)
   } 
   toast("✅ video downloaded successfully")
  }}
>
 Export 
</h1>
<h1 className="mt-7">💾</h1>

    </div>
    
    
  </div>
</div>

) : null}
 
       <div className="flex-1 flex flex-col">
            <form className="flex-1">
              {videoFile ? (
                <div className="flex-1 flex items-center justify-center p-10">
                  <div className="w-full max-w-6xl">
                   
                    <div 
                      className="mx-auto relative group"
                      style={{ width: `${boxWidth}px`, maxWidth: '100%' }}
                    >
                      <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative">
                    
                      {
                        outputUrl ? (
<video
                          ref={videoRef}
                          onClick={togglePlay}
                          src={outputUrl }
                          className="w-full h-full object-contain cursor-pointer"
                         
                          
                        />
                        ):(
                          <video
                          ref={videoRef}
                          onClick={togglePlay}
                          src={videoUrl ?? undefined}
                          className="w-full h-full object-contain cursor-pointer"
                         
                          
                        />
                        )
                      }
                        
                    
                      
                      </div>
                      <div className="mt-4  overflow-x-auto flex items-center gap-2  p-3 rounded-lg border border-white/20">
    {timelineFrames.length > 0 ? (
      timelineFrames.map(({ time, url }, i) => (
        <img
          key={i}
          src={url}
          className={`h-16  w-auto rounded cursor-pointer ${i>=trimStartFrame&& i<=trimEndFrame ?"ring-2 ring-blue-500":""} hover:scale-105 transition-transform`}
          onClick={() => {
            handleFrameClick(i)
            if (videoRef.current) {
              videoRef.current.currentTime = time;
            }
          }}
        />
      ))
    ) : (
      <p className="text-white/50 text-sm">Generating timeline thumbnails...</p>
    )}
  </div>

                
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50 -z-10"></div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="mt-8 flex justify-center">
                      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 ">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={togglePlay}
                            className="w-12 h-12 rounded-full -mt-2 border border-white/10 flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5 text-white" />
                            ) : (
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            )} 
                          </button>
                          
                       
                            <button
    type="button"
    onClick={handleUpload}
    className="px-4 py-2 rounded-full border border-white/10 text-md -mt-2  bg-gradient-to-r from-blue-500 to-purple-500 text-transparent  bg-clip-text  hover:brightness-110 transition-all shadow-lg"
  >
 {
  processing ? (<>Rendering..</>):(<>Render</>)
 }
  </button>
                          
                        </div>
                      </div>
                    </div>
                   
                  </div>
                </div>
              ) : (
                /* Upload Area with Enhanced Design */
                <div className=" items-center justify-center p-8">
                  
            <Dropzone {...dropzone}>
  <div className="flex flex-col items-center justify-center mt-52">
    <DropzoneMessage />

    <DropZoneArea>
      <DropzoneTrigger className="w-[500px] hover:bg-black hover:text-white flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm rounded-xl">
        <CloudUploadIcon className="size-8" />
        <div>
          <p className="font-semibold">Upload video</p>
          <p className="text-sm text-muted-foreground">
            Click here or drag and drop to upload
          </p>
        </div>
      </DropzoneTrigger>
    </DropZoneArea>
  </div>
</Dropzone>
                </div>
              )}
            </form>
          </div>

</div>

</div>
      <div className="md:hidden relative z-10 min-h-screen flex flex-col">
      
        <header className="backdrop-blur-sm bg-white/40 border-b border-white/60">
          <div className="px-4 py-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Podler
            </h1>
            <div className="w-px h-6 bg-slate-300"></div>
            <h2 className="text-slate-700 text-sm font-medium truncate">
              {session?.user?.name}'s Studio
            </h2>
          </div>
        </header>

      
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
          <div className="backdrop-blur-sm bg-white/40 border border-white/60 rounded-3xl p-8 max-w-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              Desktop Required
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Studio access requires a desktop device for the best experience.
            </p>
            <div className="mt-6">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
  </div>
    </>
  );
}