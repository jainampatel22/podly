"use client";
import { useEffect, useState } from "react";

export default function Projects() {
  type Video = {
    fileName: string;
    url: string;
    lastModified: string | number | Date;
  };
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/get-user-video", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched videos:", data);
        if (data.error) setError(data.error);
        else setVideos(data);
      });
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {videos.map((video) => (
        <div key={video.fileName}>
          <video src={video.url} controls width={480} style={{ borderRadius: 8 }} />
          <p>Uploaded: {new Date(video.lastModified).toLocaleString()}</p>
        </div>
      ))}
    </>
  );
}