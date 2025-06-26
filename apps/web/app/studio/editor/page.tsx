'use client'
import { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [start, setStart] = useState('0');
  const [duration, setDuration] = useState('5');
  const [text, setText] = useState('');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return alert('Select a video.');

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('start', start);
    formData.append('duration', duration);
    formData.append('text', text);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/upload', formData, {
        responseType: 'blob', // Important!
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Video Editor</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const files = e.target.files;
            setVideoFile(files && files[0] ? files[0] : null);
          }}
        />
        <br /><br />
        <label>Trim Start Time (seconds):</label>
        <input type="text" value={start} onChange={(e) => setStart(e.target.value)} />
        <br />
        <label>Overlay Text:</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <br />
        <label>Duration (seconds):</label>
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Upload & Process'}
        </button>
      </form>
      {outputUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Processed Video:</h3>
          <video src={outputUrl} controls style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}