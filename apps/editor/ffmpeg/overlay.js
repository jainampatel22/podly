const ffmpeg = require('fluent-ffmpeg')
const { PassThrough } = require('stream')

function addTextOverLay(inputBuffer, startTime, duration, text) {
  return new Promise((resolve, reject) => {
    const safeText = text.replace(/'/g, "\\'");
    const drawText = `drawtext=text='${safeText}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=50:enable='between(t,${startTime},${parseFloat(startTime) + parseFloat(duration)})'`;
    const stream = new PassThrough();
    const chunks = [];

    console.log('drawText:', drawText);

    ffmpeg(inputBuffer)
      .videoFilter(drawText)
      .format('mp4').outputOptions('-movflags', 'frag_keyframe+empty_moov').
      on('stderr', line => console.log('ffmpeg stderr:', line)) 
      .on('error', (err, stdout, stderr) => {
        // console.error('ffmpeg error:', err);
        // console.error('ffmpeg stdout:', stdout);
        // console.error('ffmpeg stderr:', stderr);
        reject(err);
      })
      .on('end', () => {
        resolve(Buffer.concat(chunks));
      })
      .pipe(stream, { end: true });

    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
  });
}

module.exports = { addTextOverLay };