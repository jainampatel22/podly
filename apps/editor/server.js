const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const {processVideo} = require('./ffmpeg/processVideo');

const app = express();
app.use(cors({
  origin:['https://podly-web.vercel.app','https://podler.space','http://localhost:3000']
}));
app.use(express.json());
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

const upload = multer({ dest: 'uploads/' });


const outputDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

app.post('/upload', upload.single('video'), async (req, res) => {
const operations = JSON.parse(req.body.operations);

  const inputPath = path.resolve(req.file.path);
 
  try {
    const videoBuffer = await processVideo(inputPath,operations)
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'inline; filename="output.mp4"');
    res.send(videoBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Video processing failed.' });
  }
  finally {

    fs.unlinkSync(inputPath);
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));