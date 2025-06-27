const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');

function processVideo(inputPath, operations = []) {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const chunks = [];
    let command = ffmpeg(inputPath).format('mp4');
    let filters = [];

    for (const op of operations) {
      switch (op.type) {
        case 'trim':
          if (op.start != null) command = command.setStartTime(op.start);
          if (op.duration != null) command = command.setDuration(op.duration);
          break;
                case 'drawtext':
        filters.push(
            `drawtext=text='${op.text}':fontcolor=white:fontsize=24:x=${op.x || 10}:y=${op.y || 10}`
        );

          break;
        case 'scale':
          filters.push(`scale=${op.width}:${op.height}`);
          break;
          case 'grayscale':
            filters.push('hue=s=0')
            break;
          case 'speed':{
            const rate = op.rate || 1
            
            filters.push(`setpts=${1/rate}*PTS`)  
            let atempoFilters =[]
            let r = rate
            while(r>2.0){
              atempoFilters.push('atempo=2.0')
              r/=2.0
            }
            while(r<0.5){
              atempoFilters.push('atempo=0.5')
              r/=2.0
            }
            atempoFilters.push(`atempo=${r}`)
            command = command.audioFilters(atempoFilters)
            break;
          }
            
          break;
      }
    }

    if (filters.length > 0) {
      command = command.videoFilters(filters);
    }

    command
      .outputOptions('-movflags', 'frag_keyframe+empty_moov')
      .on('stderr', line => console.log('ffmpeg stderr:', line))
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(stream, { end: true });

    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
  });
}

module.exports = { processVideo };