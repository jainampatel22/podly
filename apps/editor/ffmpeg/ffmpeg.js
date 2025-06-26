const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');

function TrimVideo(inputPath, start, duration) {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const chunks = [];

    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(duration)
      .format('mp4')
      .outputOptions('-movflags', 'frag_keyframe+empty_moov')
      .on('stderr', line => console.log('ffmpeg stderr:', line))
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(stream, { end: true });

    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
  });
}

module.exports = { TrimVideo };