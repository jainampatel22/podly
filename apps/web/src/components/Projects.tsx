
"use client";
import { Sparkles, Play, Download, Calendar, Clock, FileVideo, Grid3X3, List, Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";



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

import { Label } from "@/components/ui/label"
import { redirect } from "next/navigation";
import { div } from "@tensorflow/tfjs";


export default function Projects() {
  type Video = {
    fileName: string;
    url: string;
    lastModified: string | number | Date;
    duration?: string;
    size?: string;
    thumbnail?: string;
  };

  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const { data: session } = useSession();
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);


  

   if (!session) { redirect(`/sign-in?callbackUrl=/explore/projects`) }
  useEffect(() => {
    // Simulate API call
 fetch("/api/get-user-video", { credentials: "include" })
      .then(res => res.json())
       .then(data => {
         console.log("Fetched videos:", data);
         if (data.error) setError(data.error);
         else setVideos(data);
   });
   }, []);
const downloadVideo = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName; // e.g., "video.webm"
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Error downloading video:", err);
  }
};



  const filteredVideos = videos
    .map((video, index) => ({
    ...video,
    displayTitle: `Video ${index + 1}`,
  }))
  .filter(video =>
    video.displayTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.fileName.localeCompare(b.fileName);
      case 'date':
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      case 'size':
        return parseFloat(b.size?.split(' ')[0] || '0') - parseFloat(a.size?.split(' ')[0] || '0');
      default:
        return 0;
    }
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileVideo className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Projects</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (



    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-10 py-6">
          <div className="backdrop-blur-sm bg-white/60 border border-white/80 rounded-2xl p-6 shadow-lg shadow-blue-100/50 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <a href="/">
                    <h1 className="cursor-pointer text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Podler
                    </h1>
                  </a>
                  <p className="text-sm text-slate-600 mt-1">
                    {session?.user?.name}'s Projects
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {videos.length}
                  </p>
                  <p className="text-sm text-slate-600">Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-4 sm:px-6 lg:px-10 mb-8">
          <div className="backdrop-blur-sm bg-white/40 border border-white/60 rounded-2xl p-4 shadow-lg shadow-blue-100/50">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-white/60 focus:bg-white/70 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
                  className="px-3 py-2 bg-white/50 border border-white/60 rounded-xl text-sm font-medium text-slate-700 focus:bg-white/70 transition-all duration-300"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="size">Sort by Size</option>
                </select>
                
                <div className="flex bg-white/50 border border-white/60 rounded-xl p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid/List */}
        <div className="px-4 sm:px-6 lg:px-10 pb-20">
          {videos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <FileVideo className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Projects ...</h3>
              <p className="text-slate-600">Join meeting room and start creating projects.. </p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No projects found</h3>
              <p className="text-slate-600">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
            }>
              {filteredVideos.map((video, index) => (
                <div
                  key={video.fileName}
                  className={`group cursor-pointer animate-fade-in ${
                    viewMode === 'grid' 
                      ? "backdrop-blur-sm bg-white/40 border border-white/60 rounded-2xl p-4 shadow-lg shadow-blue-100/50 hover:bg-white/60 hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 hover:scale-105" 
                      : "backdrop-blur-sm bg-white/40 border border-white/60 rounded-xl p-4 shadow-lg shadow-blue-100/50 hover:bg-white/60 transition-all duration-300 flex items-center gap-4"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-slate-200 to-slate-300">
  <video
    src={video.url}
    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
    controls={false}
    muted
    preload="metadata"
    onClick={() => setPlayingUrl(video.url)}
    style={{ cursor: "pointer" }}
  />
  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
      <Play className="w-6 h-6 text-slate-900 ml-1" />
    </div>
  </div>
  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
    {video.duration}
  </div>
</div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                         Video {index + 1}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(video.lastModified).toLocaleDateString()}</span>
                          </div>
                       <span className="font-medium">
                     {(Number(video.size) / 1024/1024).toFixed(2)} MB
                      </span> 
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2">
                        <Dialog>
      <form>
        <DialogTrigger asChild>
        <Button size="sm" onClick={()=>setPlayingUrl(video.url)} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                            <Play className="w-4 h-4 mr-1" />
                            Play
                          </Button>
          </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
  <DialogHeader>
    <DialogTitle>Video {index + 1}</DialogTitle>
  </DialogHeader>
  <video
    src={playingUrl ?? undefined}
    controls
    autoPlay
    style={{ maxWidth: 600, borderRadius: 8, width: "100%" }}
  />
  <DialogFooter>
    <DialogClose asChild>
      <Button variant="outline">Cancel</Button>
    </DialogClose>
  </DialogFooter>
</DialogContent>
      </form>
    </Dialog>
                      
                         <Button size="sm" variant="outline" onClick={()=>downloadVideo(video.url,`${video.fileName}`)} className="border-slate-300 hover:border-slate-400 hover:bg-slate-50">
                          <Download className="w-4 h-4" />
                        </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0">
                          <video
    src={video.url}
    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
    controls={false}
    muted
    preload="metadata"
    onClick={() => setPlayingUrl(video.url)}
    style={{ cursor: "pointer" }}
  />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                          {/* {video.fileName.replace('.mp4', '')} */}
                          Video {index+1}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(video.lastModified).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{video.duration}</span>
                          </div>
                             <span className="font-medium">
                     {(Number(video.size) / 1024/1024).toFixed(2)} MB
                      </span>
                             </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                             <Dialog>
      <form>
        <DialogTrigger asChild>
        <Button size="sm" onClick={()=>setPlayingUrl(video.url)} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                            <Play className="w-4 h-4 mr-1" />
                            Play
                          </Button>
          </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
  <DialogHeader>
    <DialogTitle>Video {index + 1}</DialogTitle>
  </DialogHeader>
  <video
    src={playingUrl ?? undefined}
    controls
    autoPlay
    style={{ maxWidth: 600, borderRadius: 8, width: "100%" }}
  />
  <DialogFooter>
    <DialogClose asChild>
      <Button variant="outline">Cancel</Button>
    </DialogClose>
  </DialogFooter>
</DialogContent>
      </form>
    </Dialog>
<Button size="sm" variant="outline" onClick={()=>downloadVideo(video.url,`${video.fileName}`)} className="border-slate-300 hover:border-slate-400 hover:bg-slate-50">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
