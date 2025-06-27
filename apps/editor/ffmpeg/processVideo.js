const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

function extractAudio(inputPath){
  return new Promise((resolve,reject)=>{
    const stream = new PassThrough()
    const chunks = []
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec('pcm_s16le')
      .audioFrequency(16000)
      .audioChannels(1)
      .format('wav')
      .on('error',reject)
      .pipe(stream,{end:true})
    
    stream.on('data',(chunk)=>{chunks.push(chunk)})
    stream.on('end', () => {
      const audioBuffer = Buffer.concat(chunks)
      resolve(audioBuffer)
    });
    stream.on('error', reject);
  })
}

async function TranscribeAudio(inputPath) {
  const audioBuffer = await extractAudio(inputPath)
  const res = await axios.post('https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo',
    audioBuffer,{
      headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        'Content-Type': 'audio/wav',
        Accept: 'application/json', 
      },
      maxBodyLength: Infinity,
    }
  )
  return res.data
}
function splitTextIntoFakeSegments(fullText, duration, chunkDuration = 5) {
  const words = fullText.split(/\s+/);
  const totalChunks = Math.ceil(duration / chunkDuration);
  const wordsPerChunk = Math.ceil(words.length / totalChunks);

  const segments = [];
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkDuration;
    const end = Math.min((i + 1) * chunkDuration, duration);
    const chunkText = words.slice(i * wordsPerChunk, (i + 1) * wordsPerChunk).join(' ');
    segments.push({ start, end, text: chunkText });
  }

  return segments;
}
// Fixed time formatting for ASS format
function formatTimeForASS(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.floor((seconds % 1) * 100);
  
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
}


function transcriptionToASS(segments, assPath){
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,24,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,2,0,2,10,10,30,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const events = segments.map((seg, index) => {
    const start = formatTimeForASS(seg.start);
      if (seg.end <= seg.start) return '';
    const end = formatTimeForASS(seg.end);
    // Clean text for ASS format
    const cleanText = seg.text.trim().replace(/\n/g, ' ').replace(/\r/g, '');
    
    const dialogue = `Dialogue: 0,${start},${end},Default,,0,0,0,,${cleanText}`;
    console.log(`ASS Line ${index}: ${dialogue}`);
    return dialogue;
  }).join('\n');
  
  const content = header + events;
  fs.writeFileSync(assPath, content);
  console.log('ASS file created:', assPath);
  console.log('ASS content preview:', content.substring(0, 500) + '...');
}
function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
}
async function processVideo(inputPath, operations = []) {
  return new Promise(async (resolve, reject) => {
    const stream = new PassThrough();
    const chunks = [];
    let command = ffmpeg(inputPath).format('mp4');
    let filters = [];
    let tempFiles = []; // Track temp files for cleanup
   
    try {
      for (const op of operations) {
        switch (op.type) {
          case 'trim':
            if (op.start != null) command = command.setStartTime(op.start);
            if (op.duration != null) command = command.setDuration(op.duration);
            break;
            
          case 'drawtext':
            // Fix text escaping
            const escapedText = op.text
              .replace(/\\/g, '\\\\')  // Escape backslashes
              .replace(/'/g, "'\\''")   // Escape single quotes
              .replace(/:/g, '\\:');    // Escape colons
            
            filters.push(
              `drawtext=text='${escapedText}':fontcolor=white:fontsize=24:x=${op.x || 10}:y=${op.y || 10}`
            );
            break;
            
          case 'scale':
            filters.push(`scale=${op.width}:${op.height}`);
            break;
            
          case 'grayscale':
            filters.push('hue=s=0');
            break;
            
          case 'speed': {
            const rate = op.rate || 1;
            filters.push(`setpts=${1/rate}*PTS`);
            
            let atempoFilters = [];
            let r = rate;
            while(r > 2.0){
              atempoFilters.push('atempo=2.0');
              r /= 2.0;
            }
            while(r < 0.5){
              atempoFilters.push('atempo=0.5');
              r *= 2.0; // Fixed: was r/=2.0, should be r*=2.0
            }
            if(r !== 1.0) {
              atempoFilters.push(`atempo=${r}`);
            }
            
            if(atempoFilters.length > 0) {
              command = command.audioFilters(atempoFilters);
            }
            break;
          }
          
          case "captions": {
            console.log('Starting transcription...');
            const transcribeResult = await TranscribeAudio(inputPath);
            console.log('Transcription result:', transcribeResult);
            
            const assPath = path.join(__dirname, `temp_${Date.now()}.ass`);
            tempFiles.push(assPath); // Track for cleanup
            
            if (Array.isArray(transcribeResult.segments) && transcribeResult.segments.length > 0) {
              console.log('Using segments data:', transcribeResult.segments.length, 'segments');
              transcribeResult.segments.forEach((seg, i) => {
                console.log(`Segment ${i}: ${seg.start}s - ${seg.end}s: "${seg.text}"`);
              });
              transcriptionToASS(transcribeResult.segments, assPath);
            } else if (transcribeResult.text) {
              console.log('Using fallback single segment');
              // Fallback: create single segment for entire text
              const duration = await getVideoDuration(inputPath);
             const fakeSegments = splitTextIntoFakeSegments(transcribeResult.text, duration); // or use real video duration
transcriptionToASS(fakeSegments, assPath);

            } else {
              console.log('No transcription data found');
              break;
            }
            
            // Fix path escaping for all platforms
            let escapedPath = path.resolve(assPath);
            if (process.platform === 'win32') {
              // Windows: convert backslashes to forward slashes and escape colons
              escapedPath = escapedPath.replace(/\\/g, '/').replace(/:/g, '\\:');
            }
            
            filters.push(`ass='${escapedPath}'`);
            console.log('Added ASS filter:', `ass='${escapedPath}'`);
            break;
          }
        }
      }

      console.log('All filters to apply:', filters);

      if (filters.length > 0) {
        command = command.videoFilters(filters);
      }

      command
        .outputOptions('-movflags', 'frag_keyframe+empty_moov')
        .on('stderr', line => console.log('ffmpeg stderr:', line))
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          // Cleanup temp files
          tempFiles.forEach(file => {
            try { fs.unlinkSync(file); } catch(e) {}
          });
          reject(err);
        })
        .on('end', () => {
          console.log('Video processing completed');
          // Cleanup temp files
          tempFiles.forEach(file => {
            try { 
              fs.unlinkSync(file); 
              console.log('Cleaned up temp file:', file);
            } catch(e) {
              console.log('Could not clean up file:', file);
            }
          });
          resolve(Buffer.concat(chunks));
        })
        .pipe(stream, { end: true });

      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', (err) => {
        console.error('Stream error:', err);
        // Cleanup temp files
        tempFiles.forEach(file => {
          try { fs.unlinkSync(file); } catch(e) {}
        });
        reject(err);
      });
      
    } catch (error) {
      console.error('Process error:', error);
      // Cleanup temp files
      tempFiles.forEach(file => {
        try { fs.unlinkSync(file); } catch(e) {}
      });
      reject(error);
    }
  });
}

module.exports = { processVideo };