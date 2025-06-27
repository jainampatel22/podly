'use client'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {  Dropzone,
  DropZoneArea,
DropzoneTrigger,
  DropzoneMessage,
useDropzone, } from '@/components/ui/dropzone';
  import { useSession } from 'next-auth/react';
import { CloudUpload, CloudUploadIcon, Pause, Play, Scissors, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
export default function UploadForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [start, setStart] = useState('0');
  const [duration, setDuration] = useState('5');
const[showTextInput,setShowTextInput]=useState(false)
  const [showTrimInputs, setShowTrimInputs] = useState(false);
  const [showScaleInput,setShowScaleInput]=useState(false)
  const [text, setText] = useState('');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {data:session}=useSession()
    const [width,setWidth]=useState('')
    const  [height,setHeight]=useState('')
    const videoRef = useRef<HTMLVideoElement>(null)
    const [boxWidth, setBoxWidth] = useState(1920); 
 const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
const [timelineFrames, setTimelineFrames] = useState<{ time: number; url: string }[]>([]);
const [trimStartFrame, setTrimStartFrame] = useState(0);
const [trimEndFrame, setTrimEndFrame] = useState(5); 
const [clickCount, setClickCount] = useState(0);
const [tempStart, setTempStart] = useState<number | null>(null);
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

useEffect(() => {
  if (videoFile) {
    extractTimeLineFrame(videoFile, 1).then((frames) => {
      setTimelineFrames(frames);
    });
  }
}, [videoFile]);

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
 
    const fileStatus = dropzone.fileStatuses.find(f=>f.status =='success')
    if(!fileStatus){ 
        alert("select video")
         return
        }
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

  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('operations', JSON.stringify(operations));

  setLoading(true);
  try {
    const res = await axios.post('http://localhost:4000/upload', formData, {
      responseType: 'blob',
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const videoBlob = new Blob([res.data], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);
    setOutputUrl(videoUrl);
  } catch (error) {
    console.error(error);
    alert('Upload failed');
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
        "video/*": []
      },
      maxSize: 10 * 1024 * 1024,
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

  return (
  <>
  <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl"></div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block relative z-10">
      
     <div className="flex min-h-screen bg-black text-white">

 {videoFile ? (
<div className="w-64 bg-black/60 backdrop-blur-md border-r border-white/20 p-6 shadow-lg">
  <div className="pt-32 pl-2">
    <div className="flex items-center gap-3 text-white">
      <h1 className="text-2xl font-semibold cursor-pointer" onClick={() => setShowTrimInputs((prev) => !prev)} >Trim</h1>
      
      <h1 className='mt-1'>✂️</h1>
      
    </div>
    <p className="mt-2 mb-4 text-sm text-white/50 max-w-[180px]">
      Select a range to trim your video.
    </p>
     {showTrimInputs && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col text-white text-sm">
              <label htmlFor="trimStart" className="mb-1">Start Time</label>
              <input
                id="trimStart"
                type="number"
                value={trimStartFrame}
                onChange={(e) => setTrimStartFrame(Number(e.target.value))}
                placeholder="e.g. 0"
                className="bg-black/30 border border-white/10 rounded px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col text-white text-sm">
              <label htmlFor="trimEnd" className="mb-1">End Time</label>
              <input
                id="trimEnd"
                type="number"
                value={trimEndFrame}
                onChange={(e) => setTrimEndFrame(Number(e.target.value))}
                placeholder="e.g. 5"
                className="bg-black/30 border border-white/10 rounded px-3 py-2 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
       
    

        <div className="flex items-center gap-3 text-white">
      <h1 className="text-2xl font-semibold cursor-pointer" onClick={() => setShowTextInput((prev) => !prev)} >Text</h1>
     <h1 className='mt-1'>💬</h1>
    </div>
    
    <p className="mt-2 mb-4 text-sm text-white/50 max-w-[180px]">
      Add a Text to your video.
    </p>
    {
      showTextInput && (
        <>
        <div className='mt-5'>
 <label htmlFor="Enter Text">Enter Text </label>
        <Input className='border border-white/20 mt-2' onChange={(e)=>setText(e.target.value)}/>
        </div>
       
        </>
      )
    }

       <div className="flex items-center gap-3 text-white">
      <h1 className="text-2xl font-semibold cursor-pointer" onClick={() => setShowScaleInput((prev) => !prev)} >Scale</h1>
     <h1 className='mt-1'>📐</h1>
    </div>
    
    <p className="mt-2 text-sm text-white/50 max-w-[180px]">
      Add a Scale to your video.
    </p>
    {
      showScaleInput && (
        <>
        <div className='mt-5'>
 <label htmlFor="Enter Text">Enter Width </label>
        <Input className='border border-white/20 mt-2 mb-2' onChange={(e)=>setWidth(e.target.value)}/>

        <label htmlFor="Enter Text">Enter Height </label>
        <Input className='border border-white/20 mt-2' onChange={(e)=>setHeight(e.target.value)}/>

        </div>
       
        </>
      )
    }
  </div>
</div>

) : null}
 
       <div className="flex-1 flex flex-col">
            <form className="flex-1">
              {videoFile ? (
                <div className="flex-1 flex items-center justify-center p-36">
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
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
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
    className="px-4 py-2 rounded-full border border-white/10 text-sm text-white bg-gradient-to-r from-blue-600 to-purple-700 hover:brightness-110 transition-all shadow-lg"
  >
    Process
  </button>
                          
                        </div>
                      </div>
                    </div>
                   
                  </div>
                </div>
              ) : (
                /* Upload Area with Enhanced Design */
                <div className="flex-1 flex items-center justify-center p-8">
              <Dropzone {...dropzone}>
        <div>
          <div className="flex justify-between mt-72">
          
            <DropzoneMessage />
          </div>
          <DropZoneArea>
            <DropzoneTrigger className="flex flex-col hover:bg-blac hover:text-white items-center gap-4 bg-transparent p-10 text-center text-sm" >
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
  </div>
    </>
  );
}