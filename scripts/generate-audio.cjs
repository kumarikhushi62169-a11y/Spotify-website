const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const outputDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Note frequencies (in Hz)
const NOTES = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  Cs3: 138.59, Ds3: 155.56, Fs3: 185.00, Gs3: 207.65, As3: 233.08,
  Cs4: 277.18, Ds4: 311.13, Fs4: 369.99, Gs4: 415.30, As4: 466.16,
  Cs5: 554.37, Ds5: 622.25, Fs5: 739.99, Gs5: 830.61, As5: 932.33,
};

// Song definitions with custom musical parameters
const SONG_DEFINITIONS = [
  // Arijit Singh
  {
    id: 'as1', // Kesariya (C Major warm romantic)
    bpm: 88,
    style: 'acoustic',
    chords: [
      [NOTES.C4, NOTES.E4, NOTES.G4], // C
      [NOTES.G3, NOTES.B3, NOTES.D4], // G
      [NOTES.A3, NOTES.C4, NOTES.E4], // Am
      [NOTES.F3, NOTES.A3, NOTES.C4], // F
    ],
    bassNotes: [NOTES.C2, NOTES.G2, NOTES.A2, NOTES.F2],
    melody: [NOTES.E4, NOTES.G4, NOTES.C5, NOTES.B4, NOTES.G4, NOTES.A4, NOTES.G4, NOTES.E4],
  },
  {
    id: 'as2', // Tum Hi Ho (D Minor soulful piano ballad)
    bpm: 80,
    style: 'piano_ballad',
    chords: [
      [NOTES.D4, NOTES.F4, NOTES.A4], // Dm
      [NOTES.As3, NOTES.D4, NOTES.F4], // Bb
      [NOTES.C4, NOTES.E4, NOTES.G4], // C
      [NOTES.A3, NOTES.Cs4, NOTES.E4], // A
    ],
    bassNotes: [NOTES.D2, NOTES.As2 || 116.54, NOTES.C2, NOTES.A2],
    melody: [NOTES.A4, NOTES.F4, NOTES.D4, NOTES.E4, NOTES.F4, NOTES.G4, NOTES.E4, NOTES.Cs4],
  },
  {
    id: 'as3', // Channa Mereya (F# Minor emotional arpeggio)
    bpm: 82,
    style: 'acoustic',
    chords: [
      [NOTES.Fs3, NOTES.A3, NOTES.Cs4],
      [NOTES.D4, NOTES.Fs4, NOTES.A4],
      [NOTES.A3, NOTES.Cs4, NOTES.E4],
      [NOTES.E3, NOTES.Gs3, NOTES.B3],
    ],
    bassNotes: [NOTES.Fs3 / 2, NOTES.D2, NOTES.A2, NOTES.E2],
    melody: [NOTES.Cs4, NOTES.Fs4, NOTES.A4, NOTES.Gs4, NOTES.Fs4, NOTES.E4, NOTES.Fs4, NOTES.Gs4],
  },
  {
    id: 'as4', // Apna Bana Le (G Major romantic acoustic)
    bpm: 90,
    style: 'acoustic',
    chords: [
      [NOTES.G3, NOTES.B3, NOTES.D4],
      [NOTES.E3, NOTES.G3, NOTES.B3],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.D4, NOTES.Fs4, NOTES.A4],
    ],
    bassNotes: [NOTES.G2, NOTES.E2, NOTES.C2, NOTES.D2],
    melody: [NOTES.B4, NOTES.D5, NOTES.E5, NOTES.D5, NOTES.B4, NOTES.A4, NOTES.G4, NOTES.A4],
  },
  {
    id: 'as5', // Agar Tum Saath Ho (A Minor poignant melody)
    bpm: 76,
    style: 'piano_ballad',
    chords: [
      [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.F3, NOTES.A3, NOTES.C4],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.G3, NOTES.B3, NOTES.D4],
    ],
    bassNotes: [NOTES.A2, NOTES.F2, NOTES.C2, NOTES.G2],
    melody: [NOTES.E4, NOTES.A4, NOTES.B4, NOTES.C5, NOTES.B4, NOTES.A4, NOTES.G4, NOTES.E4],
  },
  {
    id: 'as6', // Shayad (E Major melodic pop)
    bpm: 94,
    style: 'pop',
    chords: [
      [NOTES.E3, NOTES.Gs3, NOTES.B3],
      [NOTES.B3, NOTES.Ds4, NOTES.Fs4],
      [NOTES.Cs4, NOTES.E4, NOTES.Gs4],
      [NOTES.A3, NOTES.Cs4, NOTES.E4],
    ],
    bassNotes: [NOTES.E2, NOTES.B2, NOTES.Cs3, NOTES.A2],
    melody: [NOTES.Gs4, NOTES.B4, NOTES.E5, NOTES.Ds5, NOTES.B4, NOTES.Cs5, NOTES.B4, NOTES.Gs4],
  },

  // Yo Yo Honey Singh
  {
    id: 'hs1', // Brown Rang (128 BPM Punjabi dance club beat)
    bpm: 128,
    style: 'club_rap',
    chords: [
      [NOTES.C4, NOTES.Ds4, NOTES.G4],
      [NOTES.As3, NOTES.D4, NOTES.F4],
      [NOTES.Gs3, NOTES.C4, NOTES.Ds4],
      [NOTES.G3, NOTES.B3, NOTES.D4],
    ],
    bassNotes: [NOTES.C2, NOTES.As2 || 116.5, NOTES.Gs2 || 103.8, NOTES.G2],
    melody: [NOTES.C5, NOTES.Ds5, NOTES.D5, NOTES.C5, NOTES.As4, NOTES.C5, NOTES.G4, NOTES.C5],
  },
  {
    id: 'hs2', // Blue Eyes (130 BPM Electro Party Club)
    bpm: 130,
    style: 'edm_club',
    chords: [
      [NOTES.D4, NOTES.F4, NOTES.A4],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.As3, NOTES.D4, NOTES.F4],
      [NOTES.A3, NOTES.Cs4, NOTES.E4],
    ],
    bassNotes: [NOTES.D2, NOTES.C2, NOTES.As2 || 116.5, NOTES.A2],
    melody: [NOTES.D5, NOTES.F5, NOTES.E5, NOTES.D5, NOTES.A4, NOTES.D5, NOTES.F5, NOTES.E5],
  },
  {
    id: 'hs3', // Desi Kalakaar (96 BPM Desi hip hop swing)
    bpm: 96,
    style: 'hiphop',
    chords: [
      [NOTES.E4, NOTES.G4, NOTES.B4],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.D4, NOTES.Fs4, NOTES.A4],
      [NOTES.B3, NOTES.Ds4, NOTES.Fs4],
    ],
    bassNotes: [NOTES.E2, NOTES.C2, NOTES.D2, NOTES.B2],
    melody: [NOTES.E5, NOTES.B4, NOTES.G4, NOTES.A4, NOTES.B4, NOTES.G4, NOTES.E4, NOTES.B4],
  },
  {
    id: 'hs4', // Love Dose (126 BPM Funky Punjabi Dance Pop)
    bpm: 126,
    style: 'club_rap',
    chords: [
      [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.F3, NOTES.A3, NOTES.C4],
      [NOTES.D4, NOTES.F4, NOTES.A4],
      [NOTES.E4, NOTES.Gs4, NOTES.B4],
    ],
    bassNotes: [NOTES.A2, NOTES.F2, NOTES.D2, NOTES.E2],
    melody: [NOTES.A4, NOTES.C5, NOTES.E5, NOTES.D5, NOTES.C5, NOTES.A4, NOTES.B4, NOTES.C5],
  },
  {
    id: 'hs5', // Dope Shope (132 BPM Punjabi High energy club)
    bpm: 132,
    style: 'bhangra_club',
    chords: [
      [NOTES.D4, NOTES.Fs4, NOTES.A4],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.G3, NOTES.B3, NOTES.D4],
      [NOTES.A3, NOTES.Cs4, NOTES.E4],
    ],
    bassNotes: [NOTES.D2, NOTES.C2, NOTES.G2, NOTES.A2],
    melody: [NOTES.D5, NOTES.Fs5, NOTES.A5, NOTES.Fs5, NOTES.D5, NOTES.E5, NOTES.D5, NOTES.A4],
  },

  // Punjabi Hits
  {
    id: 'pj1', // Lover - Diljit Dosanjh (118 BPM Disco Pop)
    bpm: 118,
    style: 'disco_pop',
    chords: [
      [NOTES.G3, NOTES.B3, NOTES.D4],
      [NOTES.E3, NOTES.G3, NOTES.B3],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.D4, NOTES.Fs4, NOTES.A4],
    ],
    bassNotes: [NOTES.G2, NOTES.E2, NOTES.C2, NOTES.D2],
    melody: [NOTES.G4, NOTES.B4, NOTES.D5, NOTES.C5, NOTES.B4, NOTES.A4, NOTES.B4, NOTES.G4],
  },
  {
    id: 'pj2', // Born to Shine - Diljit (92 BPM Majestic Anthem)
    bpm: 92,
    style: 'hiphop',
    chords: [
      [NOTES.C4, NOTES.Ds4, NOTES.G4],
      [NOTES.Gs3, NOTES.C4, NOTES.Ds4],
      [NOTES.As3, NOTES.D4, NOTES.F4],
      [NOTES.G3, NOTES.B3, NOTES.D4],
    ],
    bassNotes: [NOTES.C2, NOTES.Gs2 || 103.8, NOTES.As2 || 116.5, NOTES.G2],
    melody: [NOTES.G4, NOTES.C5, NOTES.Ds5, NOTES.D5, NOTES.C5, NOTES.As4, NOTES.C5, NOTES.G4],
  },
  {
    id: 'pj3', // Excuses - AP Dhillon (104 BPM Synthwave Pop)
    bpm: 104,
    style: 'synthwave',
    chords: [
      [NOTES.F3, NOTES.A3, NOTES.C4],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.D4, NOTES.F4, NOTES.A4],
      [NOTES.As3, NOTES.D4, NOTES.F4],
    ],
    bassNotes: [NOTES.F2, NOTES.C2, NOTES.D2, NOTES.As2 || 116.5],
    melody: [NOTES.A4, NOTES.C5, NOTES.F5, NOTES.E5, NOTES.D5, NOTES.C5, NOTES.D5, NOTES.A4],
  },
  {
    id: 'pj4', // 295 - Sidhu Moose Wala (88 BPM Hard Hip-hop)
    bpm: 88,
    style: 'trap',
    chords: [
      [NOTES.Cs4, NOTES.E4, NOTES.Gs4],
      [NOTES.A3, NOTES.Cs4, NOTES.E4],
      [NOTES.B3, NOTES.Ds4, NOTES.Fs4],
      [NOTES.Gs3, NOTES.B3, NOTES.Ds4],
    ],
    bassNotes: [NOTES.Cs3, NOTES.A2, NOTES.B2, NOTES.Gs2 || 103.8],
    melody: [NOTES.Gs4, NOTES.Cs5, NOTES.E5, NOTES.Ds5, NOTES.Cs5, NOTES.B4, NOTES.Cs5, NOTES.Gs4],
  },
  {
    id: 'pj5', // With You - AP Dhillon (112 BPM Romantic Pop)
    bpm: 112,
    style: 'pop',
    chords: [
      [NOTES.D4, NOTES.Fs4, NOTES.A4],
      [NOTES.A3, NOTES.Cs4, NOTES.E4],
      [NOTES.B3, NOTES.D4, NOTES.Fs4],
      [NOTES.G3, NOTES.B3, NOTES.D4],
    ],
    bassNotes: [NOTES.D2, NOTES.A2, NOTES.B2, NOTES.G2],
    melody: [NOTES.Fs4, NOTES.A4, NOTES.D5, NOTES.Cs5, NOTES.B4, NOTES.A4, NOTES.B4, NOTES.Fs4],
  },

  // Global Hits
  {
    id: 'gb1', // Blinding Lights - The Weeknd (171 BPM Synthwave)
    bpm: 171,
    style: 'synthwave',
    chords: [
      [NOTES.F3, NOTES.Ab3 || 207.6, NOTES.C4],
      [NOTES.C4, NOTES.Eb4 || 311.1, NOTES.G4],
      [NOTES.Eb3 || 155.5, NOTES.G3, NOTES.Bb3 || 233.0],
      [NOTES.Bb3 || 233.0, NOTES.D4, NOTES.F4],
    ],
    bassNotes: [NOTES.F2, NOTES.C2, NOTES.Eb2 || 77.7, NOTES.Bb2 || 116.5],
    melody: [NOTES.C5, NOTES.C5, NOTES.Bb4 || 466.1, NOTES.Ab4 || 415.3, NOTES.G4, NOTES.F4, NOTES.G4, NOTES.Ab4 || 415.3],
  },
  {
    id: 'gb2', // Levitating - Dua Lipa (103 BPM Funk Pop)
    bpm: 103,
    style: 'disco_pop',
    chords: [
      [NOTES.B3, NOTES.D4, NOTES.Fs4],
      [NOTES.Fs3, NOTES.A3, NOTES.Cs4],
      [NOTES.E3, NOTES.G3, NOTES.B3],
      [NOTES.B3, NOTES.D4, NOTES.Fs4],
    ],
    bassNotes: [NOTES.B2, NOTES.Fs2 || 92.5, NOTES.E2, NOTES.B2],
    melody: [NOTES.Fs4, NOTES.B4, NOTES.D5, NOTES.Cs5, NOTES.B4, NOTES.A4, NOTES.B4, NOTES.D5],
  },
  {
    id: 'gb3', // Shape of You - Ed Sheeran (96 BPM Marimba Pop)
    bpm: 96,
    style: 'pop',
    chords: [
      [NOTES.Cs4, NOTES.E4, NOTES.Gs4],
      [NOTES.Fs3, NOTES.A3, NOTES.Cs4],
      [NOTES.A3, NOTES.Cs4, NOTES.E4],
      [NOTES.B3, NOTES.Ds4, NOTES.Fs4],
    ],
    bassNotes: [NOTES.Cs3, NOTES.Fs2 || 92.5, NOTES.A2, NOTES.B2],
    melody: [NOTES.Cs5, NOTES.E5, NOTES.Cs5, NOTES.B4, NOTES.A4, NOTES.B4, NOTES.Cs5, NOTES.A4],
  },

  // Originals
  {
    id: '1', // Neon Nights (120 BPM Retro Synthwave)
    bpm: 120,
    style: 'synthwave',
    chords: [
      [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.F3, NOTES.A3, NOTES.C4],
      [NOTES.G3, NOTES.B3, NOTES.D4],
      [NOTES.E3, NOTES.G3, NOTES.B3],
    ],
    bassNotes: [NOTES.A2, NOTES.F2, NOTES.G2, NOTES.E2],
    melody: [NOTES.E5, NOTES.D5, NOTES.C5, NOTES.B4, NOTES.A4, NOTES.B4, NOTES.C5, NOTES.E5],
  },
  {
    id: '2', // Midnight Drive (110 BPM Dreamy Synthwave)
    bpm: 110,
    style: 'synthwave',
    chords: [
      [NOTES.D4, NOTES.F4, NOTES.A4],
      [NOTES.G3, NOTES.B3, NOTES.D4],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.A3, NOTES.Cs4, NOTES.E4],
    ],
    bassNotes: [NOTES.D2, NOTES.G2, NOTES.C2, NOTES.A2],
    melody: [NOTES.F4, NOTES.A4, NOTES.D5, NOTES.C5, NOTES.B4, NOTES.A4, NOTES.F4, NOTES.D4],
  },
  {
    id: '3', // Ocean Breeze (80 BPM Chillout)
    bpm: 80,
    style: 'chillout',
    chords: [
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.F3, NOTES.A3, NOTES.C4],
      [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.G3, NOTES.B3, NOTES.D4],
    ],
    bassNotes: [NOTES.C2, NOTES.F2, NOTES.A2, NOTES.G2],
    melody: [NOTES.G4, NOTES.C5, NOTES.E5, NOTES.D5, NOTES.C5, NOTES.A4, NOTES.G4, NOTES.E4],
  },
  {
    id: '4', // Urban Exploration (75 BPM Lo-Fi Study)
    bpm: 75,
    style: 'lofi',
    chords: [
      [NOTES.D4, NOTES.F4, NOTES.A4],
      [NOTES.G3, NOTES.B3, NOTES.D4],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.F3, NOTES.A3, NOTES.C4],
    ],
    bassNotes: [NOTES.D2, NOTES.G2, NOTES.C2, NOTES.F2],
    melody: [NOTES.A4, NOTES.F4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.D4, NOTES.E4, NOTES.F4],
  },
  {
    id: '5', // Mountain Echoes (90 BPM Acoustic Folk)
    bpm: 90,
    style: 'acoustic',
    chords: [
      [NOTES.G3, NOTES.B3, NOTES.D4],
      [NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.D4, NOTES.Fs4, NOTES.A4],
      [NOTES.E3, NOTES.G3, NOTES.B3],
    ],
    bassNotes: [NOTES.G2, NOTES.C2, NOTES.D2, NOTES.E2],
    melody: [NOTES.D4, NOTES.G4, NOTES.B4, NOTES.A4, NOTES.G4, NOTES.Fs4, NOTES.G4, NOTES.A4],
  },
  {
    id: '6', // Cyberpunk City (125 BPM Industrial Electronic)
    bpm: 125,
    style: 'synthwave',
    chords: [
      [NOTES.E3, NOTES.G3, NOTES.B3],
      [NOTES.C3, NOTES.E3, NOTES.G3],
      [NOTES.D3, NOTES.Fs3, NOTES.A3],
      [NOTES.B2, NOTES.Ds3, NOTES.Fs3],
    ],
    bassNotes: [NOTES.E2, NOTES.C2, NOTES.D2, NOTES.B2],
    melody: [NOTES.E4, NOTES.B4, NOTES.G4, NOTES.A4, NOTES.B4, NOTES.E4, NOTES.Fs4, NOTES.G4],
  },
  {
    id: '7', // Deep Space (65 BPM Ambient)
    bpm: 65,
    style: 'chillout',
    chords: [
      [NOTES.A3, NOTES.C4, NOTES.E4],
      [NOTES.E3, NOTES.G3, NOTES.B3],
      [NOTES.F3, NOTES.A3, NOTES.C4],
      [NOTES.C4, NOTES.E4, NOTES.G4],
    ],
    bassNotes: [NOTES.A2, NOTES.E2, NOTES.F2, NOTES.C2],
    melody: [NOTES.E4, NOTES.A4, NOTES.C5, NOTES.B4, NOTES.A4, NOTES.E4, NOTES.G4, NOTES.E4],
  },
  {
    id: '8', // Rainy Cafe (72 BPM Jazz Hop)
    bpm: 72,
    style: 'lofi',
    chords: [
      [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.B4],
      [NOTES.A3, NOTES.C4, NOTES.E4, NOTES.G4],
      [NOTES.D4, NOTES.F4, NOTES.A4, NOTES.C5],
      [NOTES.G3, NOTES.B3, NOTES.D4, NOTES.F4],
    ],
    bassNotes: [NOTES.C2, NOTES.A2, NOTES.D2, NOTES.G2],
    melody: [NOTES.B4, NOTES.G4, NOTES.E4, NOTES.A4, NOTES.F4, NOTES.D4, NOTES.G4, NOTES.E4],
  },
];

// Audio generator function
function generateSongWav(def, durationSeconds = 60) {
  const sampleRate = 44100;
  const numSamples = sampleRate * durationSeconds;
  const buffer = new Int16Array(numSamples * 2); // stereo

  const bpm = def.bpm || 110;
  const secondsPerBeat = 60 / bpm;
  const samplesPerBeat = Math.floor(sampleRate * secondsPerBeat);
  const samplesPerBar = samplesPerBeat * 4;

  const numChords = def.chords.length;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const barProgress = (i % (samplesPerBar * numChords));
    const chordIndex = Math.floor(barProgress / samplesPerBar) % numChords;
    const beatIndex = Math.floor((i % samplesPerBar) / samplesPerBeat);
    const subBeatProgress = (i % samplesPerBeat) / samplesPerBeat;

    const currentChord = def.chords[chordIndex] || [440];
    const currentBass = def.bassNotes[chordIndex] || 110;

    let sampleL = 0;
    let sampleR = 0;

    // 1. DRUMS
    if (def.style !== 'chillout') {
      // Kick: on beats 0 & 2 (or 0, 1, 2, 3 for 4-on-the-floor)
      const isFourOnFloor = ['edm_club', 'disco_pop', 'synthwave'].includes(def.style);
      const isKickBeat = isFourOnFloor ? true : (beatIndex === 0 || beatIndex === 2);
      if (isKickBeat) {
        const kickTime = subBeatProgress * secondsPerBeat;
        if (kickTime < 0.2) {
          const kickFreq = 120 * Math.exp(-kickTime * 25) + 40;
          const kickAmp = Math.exp(-kickTime * 15) * 0.45;
          const kickWave = Math.sin(2 * Math.PI * kickFreq * kickTime);
          sampleL += kickWave * kickAmp;
          sampleR += kickWave * kickAmp;
        }
      }

      // Snare / Clap: on beats 1 & 3
      if (beatIndex === 1 || beatIndex === 3) {
        const snareTime = subBeatProgress * secondsPerBeat;
        if (snareTime < 0.25) {
          const snareNoise = (Math.random() * 2 - 1) * Math.exp(-snareTime * 18) * 0.25;
          const snareTone = Math.sin(2 * Math.PI * 180 * snareTime) * Math.exp(-snareTime * 25) * 0.2;
          sampleL += snareNoise + snareTone;
          sampleR += snareNoise + snareTone;
        }
      }

      // Hi-hat: 8th notes
      const hihatSub = (subBeatProgress * 2) % 1;
      const hihatTime = hihatSub * (secondsPerBeat / 2);
      if (hihatTime < 0.05) {
        const hihatAmp = Math.exp(-hihatTime * 60) * 0.08;
        const hihatNoise = (Math.random() * 2 - 1) * hihatAmp;
        sampleL += hihatNoise * 0.8;
        sampleR += hihatNoise * 1.2;
      }
    }

    // 2. BASSLINE
    const bassTime = t;
    const bassRhythm = Math.exp(-subBeatProgress * 4); // rhythmic plucking
    const bassFreq = currentBass;
    const bassWave = Math.sin(2 * Math.PI * bassFreq * bassTime) + 0.3 * Math.sin(2 * Math.PI * bassFreq * 2 * bassTime);
    sampleL += bassWave * bassRhythm * 0.22;
    sampleR += bassWave * bassRhythm * 0.22;

    // 3. CHORDS / HARMONY
    for (let c = 0; c < currentChord.length; c++) {
      const f = currentChord[c];
      let chordWave = 0;
      if (def.style === 'acoustic' || def.style === 'piano_ballad') {
        // Piano/acoustic harmonic decay
        const noteAge = (subBeatProgress + (c % 2) * 0.5) % 1;
        const noteAmp = Math.exp(-noteAge * 3.5) * 0.12;
        chordWave = (Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(4 * Math.PI * f * t)) * noteAmp;
      } else if (def.style === 'synthwave' || def.style === 'edm_club') {
        // Rich saw / square warm pad
        const saw = (2 * ((f * t) % 1) - 1) * 0.06;
        chordWave = saw;
      } else {
        // Soft sine-bell
        const sine = Math.sin(2 * Math.PI * f * t) * 0.08;
        chordWave = sine;
      }
      sampleL += chordWave * (c % 2 === 0 ? 1.1 : 0.8);
      sampleR += chordWave * (c % 2 === 0 ? 0.8 : 1.1);
    }

    // 4. MELODY
    const melodyLen = def.melody.length;
    const melodyNoteIdx = Math.floor(t * (bpm / 60) * 2) % melodyLen;
    const melFreq = def.melody[melodyNoteIdx] || 440;
    const melSubProgress = (t * (bpm / 60) * 2) % 1;
    const melEnv = Math.exp(-melSubProgress * 4.5);
    const melWave = Math.sin(2 * Math.PI * melFreq * t) + 0.15 * Math.sin(4 * Math.PI * melFreq * t);
    sampleL += melWave * melEnv * 0.18;
    sampleR += melWave * melEnv * 0.18;

    // Soft clip limiter to prevent clipping
    const clampedL = Math.max(-0.95, Math.min(0.95, sampleL));
    const clampedR = Math.max(-0.95, Math.min(0.95, sampleR));

    buffer[i * 2] = Math.floor(clampedL * 32767);
    buffer[i * 2 + 1] = Math.floor(clampedR * 32767);
  }

  // Create WAV header
  const wavHeader = Buffer.alloc(44);
  const dataSize = buffer.byteLength;
  const fileSize = 36 + dataSize;

  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(fileSize, 4);
  wavHeader.write('WAVE', 8);
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16); // fmt chunk size
  wavHeader.writeUInt16LE(1, 20); // PCM format
  wavHeader.writeUInt16LE(2, 22); // 2 channels (stereo)
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(sampleRate * 4, 28); // byte rate (sampleRate * 2 channels * 2 bytes)
  wavHeader.writeUInt16LE(4, 32); // block align
  wavHeader.writeUInt16LE(16, 34); // bits per sample
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(dataSize, 40);

  const wavData = Buffer.concat([wavHeader, Buffer.from(buffer.buffer)]);
  return wavData;
}

// Generate for all songs
console.log('Generating distinct music files for all songs...');

for (const song of SONG_DEFINITIONS) {
  const wavPath = path.join(outputDir, `${song.id}.wav`);
  const mp3Path = path.join(outputDir, `${song.id}.mp3`);

  console.log(`Synthesizing distinct track for: ${song.id} (${song.style}, ${song.bpm} BPM)...`);
  const wavBuffer = generateSongWav(song, 60);
  fs.writeFileSync(wavPath, wavBuffer);

  // Convert to high quality 128k MP3 via ffmpeg
  const ffmpegRes = spawnSync('ffmpeg', [
    '-y',
    '-i', wavPath,
    '-c:a', 'libmp3lame',
    '-b:a', '128k',
    mp3Path
  ]);

  if (ffmpegRes.status === 0) {
    fs.unlinkSync(wavPath); // Clean up wav
    console.log(`✓ Generated ${song.id}.mp3 successfully!`);
  } else {
    console.error(`Error converting ${song.id}:`, ffmpegRes.stderr ? ffmpegRes.stderr.toString() : 'unknown');
  }
}

console.log('All 27 song MP3s successfully generated in public/audio/!');
