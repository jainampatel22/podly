const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { TrimVideo } = require('./ffmpeg/ffmpeg');
const { addTextOverLay } = require('./ffmpeg/overlay');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

const upload = multer({ dest: 'uploads/' });

// Ensure outputs directory exists
const outputDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

app.post('/upload', upload.single('video'), async (req, res) => {
  const { start, duration } = req.body;
  const inputPath = path.resolve(req.file.path);
  const outputName = `output-${Date.now()}.mp4`;
  
  try {
    console.log('Input path:', inputPath);
console.log('File exists:', fs.existsSync(inputPath));
console.log('File size:', fs.statSync(inputPath).size);
   const videoBuffer =  await TrimVideo(inputPath, start, duration);
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'inline; filename="output.mp4"');
    res.send(videoBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Video processing failed.' });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
