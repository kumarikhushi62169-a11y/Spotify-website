import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Song, songs as defaultSongs } from '../data/songs';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isShuffle: boolean;
  isRepeat: boolean;
  queue: Song[];
  likedSongs: string[];
  recentlyPlayed: Song[];
  audioError: string | null;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (vol: number) => void;
  seek: (time: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(defaultSongs[0]); // default to first song (Kesariya)
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(60);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [queue, setQueue] = useState<Song[]>(defaultSongs);
  const [queueIndex, setQueueIndex] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const [likedSongs, setLikedSongs] = useState<string[]>(() => {
    const saved = localStorage.getItem('spotify-liked');
    return saved ? JSON.parse(saved) : ['as1', 'hs1', 'pj1'];
  });
  
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => {
    const saved = localStorage.getItem('spotify-recent');
    return saved ? JSON.parse(saved) : [];
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('spotify-liked', JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem('spotify-recent', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Handle next track reference
  const handleNextRef = useRef<() => void>();

  const playSong = (song: Song, newQueue?: Song[]) => {
    setAudioError(null);
    setCurrentSong(song);
    
    const activeQueue = newQueue && newQueue.length > 0 ? newQueue : (queue.length > 0 ? queue : defaultSongs);
    setQueue(activeQueue);
    const foundIdx = activeQueue.findIndex(s => s.id === song.id);
    setQueueIndex(foundIdx >= 0 ? foundIdx : 0);

    // Save to recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 30);
    });

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = song.audio;
      audio.load();
      audio.volume = volume;
      audio.currentTime = 0;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAudioError(null);
          })
          .catch((err) => {
            console.warn("Direct play rejected by browser:", err);
            // User gesture required or policy; try once more with muted if needed or update state
            setIsPlaying(false);
          });
      }
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentSong) {
      playSong(queue[0] || defaultSongs[0], queue);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Ensure source is set
      if (!audio.src || !audio.src.includes(currentSong.audio)) {
        audio.src = currentSong.audio;
      }
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn("Toggle play failed:", err);
        });
    }
  };

  const nextSong = () => {
    if (queue.length === 0) return;
    
    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      nextIdx = 0;
    }
    
    playSong(queue[nextIdx], queue);
  };

  const prevSong = () => {
    if (progress > 3) {
      seek(0);
      return;
    }
    
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) prevIdx = queue.length - 1;
    
    playSong(queue[prevIdx], queue);
  };

  useEffect(() => {
    handleNextRef.current = nextSong;
  });

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const seek = (time: number) => {
    setProgress(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setIsRepeat(!isRepeat);

  const toggleLike = (songId: string) => {
    setLikedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const isLiked = (songId: string) => likedSongs.includes(songId);

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, volume, progress, duration, isShuffle, isRepeat, queue, likedSongs, recentlyPlayed,
      audioError, playSong, togglePlay, nextSong, prevSong, setVolume, seek, toggleShuffle, toggleRepeat, toggleLike, isLiked
    }}>
      {children}
      {/* Real HTML5 Audio Element in the React DOM Tree */}
      <audio
        ref={audioRef}
        src={currentSong?.audio || '/audio/as1.mp3'}
        playsInline
        preload="auto"
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime || 0)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (d && !isNaN(d) && isFinite(d)) {
            setDuration(d);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          } else {
            handleNextRef.current?.();
          }
        }}
        onError={(e) => {
          console.error("Audio playback error event:", e);
          setAudioError("Audio failed to load. Please try clicking again.");
        }}
        style={{ display: 'none' }}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
