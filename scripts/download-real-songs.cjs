const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');

const outputDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const songMappings = [
  { id: 'as1', source: '1/01.mp3', duration: 180 },
  { id: 'as2', source: '1/02.mp3', duration: 175 },
  { id: 'as3', source: '1/03.mp3', duration: 190 },
  { id: 'as4', source: '1/04.mp3', duration: 165 },
  { id: 'as5', source: '1/05.mp3', duration: 185 },
  { id: 'as6', source: '2/01.mp3', duration: 170 },

  { id: 'hs1', source: '2/02.mp3', duration: 195 },
  { id: 'hs2', source: '2/03.mp3', duration: 180 },
  { id: 'hs3', source: '2/04.mp3', duration: 160 },
  { id: 'hs4', source: '2/05.mp3', duration: 175 },
  { id: 'hs5', source: '3/01.mp3', duration: 190 },

  { id: 'pj1', source: '3/02.mp3', duration: 185 },
  { id: 'pj2', source: '3/03.mp3', duration: 165 },
  { id: 'pj3', source: '3/04.mp3', duration: 170 },
  { id: 'pj4', source: '3/05.mp3', duration: 200 },
  { id: 'pj5', source: '4/01.mp3', duration: 155 },

  { id: 'gb1', source: '4/02.mp3', duration: 180 },
  { id: 'gb2', source: '4/03.mp3', duration: 175 },
  { id: 'gb3', source: '4/04.mp3', duration: 190 },

  { id: '1', source: '4/05.mp3', duration: 185 },
  { id: '2', source: '5/01.mp3', duration: 195 },
  { id: '3', source: '5/02.mp3', duration: 160 },
  { id: '4', source: '5/03.mp3', duration: 170 },
  { id: '5', source: '5/04.mp3', duration: 165 },
  { id: '6', source: '5/05.mp3', duration: 190 },
  { id: '7', source: '6/01.mp3', duration: 175 },
  { id: '8', source: '6/02.mp3', duration: 180 },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'node' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function processSong({ id, source, duration }) {
  const url = `https://raw.githubusercontent.com/midudev/spotify-twitch-clone/main/public/music/${source}`;
  const rawTmpPath = path.join(outputDir, `raw_${id}.mp3`);
  const finalMp3Path = path.join(outputDir, `${id}.mp3`);

  try {
    await downloadFile(url, rawTmpPath);
    const ffmpegRes = spawnSync('ffmpeg', [
      '-y',
      '-i', rawTmpPath,
      '-t', String(duration),
      '-c:a', 'libmp3lame',
      '-b:a', '128k',
      finalMp3Path
    ]);

    if (ffmpegRes.status === 0 && fs.existsSync(finalMp3Path)) {
      if (fs.existsSync(rawTmpPath)) fs.unlinkSync(rawTmpPath);
      const stats = fs.statSync(finalMp3Path);
      console.log(`✓ [${id}] Success: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    } else {
      fs.renameSync(rawTmpPath, finalMp3Path);
      console.log(`✓ [${id}] Saved raw`);
    }
  } catch (e) {
    console.error(`Error on ${id}:`, e.message);
  }
}

async function run() {
  console.log('Downloading all songs in parallel pools...');
  const poolSize = 6;
  for (let i = 0; i < songMappings.length; i += poolSize) {
    const chunk = songMappings.slice(i, i + poolSize);
    await Promise.all(chunk.map(processSong));
    console.log(`Batch ${Math.floor(i / poolSize) + 1} done.`);
  }
  console.log('All real songs downloaded and ready!');
}

run();
