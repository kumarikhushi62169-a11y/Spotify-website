import { songs, Song } from './songs';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  songs: Song[];
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  cover: string;
  year: number;
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  cover: string;
  followers: string;
  songs: Song[];
  monthlyListeners?: string;
  bio?: string;
}

export const playlists: Playlist[] = [
  {
    id: 'p-arijit',
    name: 'Best of Arijit Singh',
    description: 'Soulful melodies and evergreen romantic chartbusters by Arijit Singh.',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400&h=400',
    songs: songs.filter(s => s.artist.includes('Arijit Singh')),
  },
  {
    id: 'p-honeysingh',
    name: 'Yo Yo Honey Singh Hits',
    description: 'Party anthems, club bangers, and legendary desi rap tracks by Honey Singh.',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400&h=400',
    songs: songs.filter(s => s.artist.includes('Honey Singh')),
  },
  {
    id: 'p-punjabi',
    name: 'Punjabi Heat & Pop',
    description: 'Banging beats by Diljit Dosanjh, AP Dhillon, Sidhu Moose Wala, and Honey Singh.',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=400&h=400',
    songs: songs.filter(s => ['Diljit Dosanjh', 'AP Dhillon', 'Sidhu Moose Wala', 'Honey Singh'].some(a => s.artist.includes(a))),
  },
  {
    id: 'p-bollywood',
    name: 'Bollywood Top Hits',
    description: 'The biggest Bollywood romantic tracks and chartbusters of all time.',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400&h=400',
    songs: [
      ...songs.filter(s => s.artist.includes('Arijit Singh')),
      ...songs.filter(s => s.artist.includes('Honey Singh')),
    ],
  },
  {
    id: 'p1',
    name: 'Top Hits 2024',
    description: 'The biggest global and Indian viral songs right now.',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400&h=400',
    songs: [songs[0], songs[6], songs[11], songs[13], songs[16], songs[17]],
  },
  {
    id: 'p2',
    name: 'Chill Vibes & Acoustic',
    description: 'Relax, unwind, and meditate with smooth acoustic melodies.',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400&h=400',
    songs: [songs[4], songs[5], songs[15], songs[20], songs[22]],
  },
  {
    id: 'p3',
    name: 'Workout Energy',
    description: 'High octane energy to crush your gym sessions and cardio.',
    cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400&h=400',
    songs: [songs[6], songs[7], songs[10], songs[12], songs[14], songs[16]],
  },
  {
    id: 'p4',
    name: 'LoFi Beats & Late Night',
    description: 'Soft lo-fi and jazz hop for late night studying and relaxation.',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=400&h=400',
    songs: [songs[19], songs[21], songs[23]],
  },
  {
    id: 'p5',
    name: 'Electronic & Synthwave Focus',
    description: 'Deep focus synthwave, futuristic cyberpunk, and electronic music.',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400&h=400',
    songs: [songs[18], songs[19], songs[21], songs[22]],
  },
];

export const albums: Album[] = [
  {
    id: 'a-brahmastra',
    name: 'Brahmāstra',
    artist: 'Arijit Singh, Pritam',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2022,
    songs: songs.filter(s => s.album === 'Brahmāstra'),
  },
  {
    id: 'a-aashiqui2',
    name: 'Aashiqui 2',
    artist: 'Arijit Singh, Mithoon',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2013,
    songs: songs.filter(s => s.album === 'Aashiqui 2'),
  },
  {
    id: 'a-villager',
    name: 'International Villager',
    artist: 'Yo Yo Honey Singh',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2011,
    songs: songs.filter(s => s.album === 'International Villager'),
  },
  {
    id: 'a-kalakaar',
    name: 'Desi Kalakaar',
    artist: 'Yo Yo Honey Singh',
    cover: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2014,
    songs: songs.filter(s => s.album === 'Desi Kalakaar'),
  },
  {
    id: 'a-moonchild',
    name: 'MoonChild Era',
    artist: 'Diljit Dosanjh',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2021,
    songs: songs.filter(s => s.album === 'MoonChild Era'),
  },
  {
    id: 'a-goat',
    name: 'G.O.A.T.',
    artist: 'Diljit Dosanjh',
    cover: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2020,
    songs: songs.filter(s => s.album === 'G.O.A.T.'),
  },
  {
    id: 'a-hiddengems',
    name: 'Hidden Gems',
    artist: 'AP Dhillon, Gurinder Gill',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2020,
    songs: songs.filter(s => s.album === 'Hidden Gems'),
  },
  {
    id: 'a-moosetape',
    name: 'Moosetape',
    artist: 'Sidhu Moose Wala',
    cover: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2021,
    songs: songs.filter(s => s.album === 'Moosetape'),
  },
  {
    id: 'a-afterhours',
    name: 'After Hours',
    artist: 'The Weeknd',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2020,
    songs: songs.filter(s => s.album === 'After Hours'),
  },
  {
    id: 'a-futurenostalgia',
    name: 'Future Nostalgia',
    artist: 'Dua Lipa',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2020,
    songs: songs.filter(s => s.album === 'Future Nostalgia'),
  },
  {
    id: 'a-divide',
    name: '÷ (Divide)',
    artist: 'Ed Sheeran',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2017,
    songs: songs.filter(s => s.album === '÷ (Divide)'),
  },
  {
    id: 'a-retro',
    name: 'Retro Future',
    artist: 'Synthwave Boy',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400&h=400',
    year: 2024,
    songs: songs.filter(s => s.album === 'Retro Future'),
  },
];

export const artists: Artist[] = [
  {
    id: 'ar-arijit',
    name: 'Arijit Singh',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400&h=400',
    followers: '42.8M',
    monthlyListeners: '38,421,902',
    bio: 'Renowned Indian playback singer and music composer, known for soulful romantic ballads and versatile vocals across Bollywood.',
    songs: songs.filter(s => s.artist.includes('Arijit Singh')),
  },
  {
    id: 'ar-honeysingh',
    name: 'Yo Yo Honey Singh',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400&h=400',
    followers: '28.4M',
    monthlyListeners: '24,198,310',
    bio: 'Indian music producer, composer, and rapper who revolutionized modern Indian pop, bhangra, and desi hip-hop music.',
    songs: songs.filter(s => s.artist.includes('Honey Singh')),
  },
  {
    id: 'ar-diljit',
    name: 'Diljit Dosanjh',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=400&h=400',
    followers: '19.2M',
    monthlyListeners: '17,845,120',
    bio: 'Global Punjabi sensation, singer, and actor who brought Punjabi music to international stages like Coachella.',
    songs: songs.filter(s => s.artist.includes('Diljit Dosanjh')),
  },
  {
    id: 'ar-apdhillon',
    name: 'AP Dhillon',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400&h=400',
    followers: '14.6M',
    monthlyListeners: '12,983,400',
    bio: 'Indo-Canadian singer and rapper blending Punjabi lyrics with modern synthwave, trap, and R&B production.',
    songs: songs.filter(s => s.artist.includes('AP Dhillon')),
  },
  {
    id: 'ar-sidhu',
    name: 'Sidhu Moose Wala',
    cover: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400',
    followers: '22.1M',
    monthlyListeners: '19,450,210',
    bio: 'Legendary Punjabi rapper and lyricist whose hard-hitting lyrics and authentic gangsta rap sound inspired millions.',
    songs: songs.filter(s => s.artist.includes('Sidhu Moose Wala')),
  },
  {
    id: 'ar-weeknd',
    name: 'The Weeknd',
    cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
    followers: '88.5M',
    monthlyListeners: '105,432,010',
    bio: 'Canadian singer, songwriter, and record producer known for sonic versatility and dark lyricism.',
    songs: songs.filter(s => s.artist.includes('The Weeknd')),
  },
  {
    id: 'ar-dualipa',
    name: 'Dua Lipa',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400&h=400',
    followers: '74.2M',
    monthlyListeners: '82,109,540',
    bio: 'English and Albanian singer celebrated for modern disco-pop anthems and chart-dominating studio albums.',
    songs: songs.filter(s => s.artist.includes('Dua Lipa')),
  },
  {
    id: 'ar-edsheeran',
    name: 'Ed Sheeran',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400&h=400',
    followers: '96.3M',
    monthlyListeners: '91,620,800',
    bio: 'Grammy-winning British singer-songwriter with acoustic mastery and record-shattering global hits.',
    songs: songs.filter(s => s.artist.includes('Ed Sheeran')),
  },
];

export function getArtistById(id: string): Artist | undefined {
  return artists.find(a => a.id === id);
}

export function getAlbumById(id: string): Album | undefined {
  return albums.find(a => a.id === id);
}
