import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function Player() {
  const { 
    currentSong, isPlaying, togglePlay, progress, duration, 
    seek, nextSong, prevSong, volume, setVolume, 
    isShuffle, toggleShuffle, isRepeat, toggleRepeat,
    toggleLike, isLiked
  } = usePlayer();

  const [localProgress, setLocalProgress] = useState(progress);
  const [isSeeking, setIsSeeking] = useState(false);
  const progressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSeeking) {
      setLocalProgress(progress);
    }
  }, [progress, isSeeking]);

  const handleSeekStart = () => setIsSeeking(true);
  const handleSeekEnd = () => {
    seek(localProgress);
    setIsSeeking(false);
  };
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalProgress(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    if (volume === 0) setVolume(1);
    else setVolume(0);
  };

  if (!currentSong) return (
    <div className="flex h-[90px] w-full items-center justify-between border-t border-[var(--border-color)] bg-[var(--bg-main)] px-4"></div>
  );

  return (
    <div className="flex h-[90px] w-full shrink-0 items-center justify-between border-t border-[var(--border-color)] bg-[var(--bg-main)] px-2 md:px-4 z-50">
      
      {/* Left: Song Info */}
      <div className="flex w-[30%] min-w-[120px] md:min-w-[180px] items-center gap-2 md:gap-4">
        <img src={currentSong.cover} alt={currentSong.title} className="h-14 w-14 rounded-md object-cover shadow-md" />
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium hover:underline cursor-pointer">{currentSong.title}</span>
          <span className="truncate text-xs text-[var(--text-secondary)] hover:underline cursor-pointer">{currentSong.artist}</span>
        </div>
        <button onClick={() => toggleLike(currentSong.id)} className="ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
          <Heart className={`h-5 w-5 ${isLiked(currentSong.id) ? 'fill-[var(--brand-color)] text-[var(--brand-color)]' : ''}`} />
        </button>
      </div>

      {/* Middle: Controls */}
      <div className="flex max-w-[40%] flex-1 flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-6">
          <button onClick={toggleShuffle} className={`text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition ${isShuffle ? 'text-[var(--brand-color)] hover:text-[var(--brand-color)]' : ''}`}>
            <Shuffle className="h-4 w-4" />
          </button>
          <button onClick={prevSong} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
            <SkipBack className="h-5 w-5 fill-current" />
          </button>
          <button 
            onClick={togglePlay} 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--text-primary)] text-[var(--bg-main)] hover:scale-105 transition"
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-1" />}
          </button>
          <button onClick={nextSong} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
            <SkipForward className="h-5 w-5 fill-current" />
          </button>
          <button onClick={toggleRepeat} className={`text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition ${isRepeat ? 'text-[var(--brand-color)] hover:text-[var(--brand-color)]' : ''}`}>
            <Repeat className="h-4 w-4" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex w-full items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span>{formatTime(localProgress)}</span>
          <input 
            type="range"
            min={0}
            max={duration || 100}
            value={localProgress}
            onChange={handleSeekChange}
            onMouseDown={handleSeekStart}
            onMouseUp={handleSeekEnd}
            onTouchStart={handleSeekStart}
            onTouchEnd={handleSeekEnd}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--border-color)] accent-[var(--text-primary)] hover:accent-[var(--brand-color)]"
            style={{ background: `linear-gradient(to right, var(--text-primary) ${(localProgress / (duration || 1)) * 100}%, var(--border-color) ${(localProgress / (duration || 1)) * 100}%)` }}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex w-[30%] min-w-[180px] justify-end items-center gap-2 pr-2">
        <button onClick={toggleMute} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
          {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        <input 
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-[var(--border-color)] accent-[var(--text-primary)] hover:accent-[var(--brand-color)]"
          style={{ background: `linear-gradient(to right, var(--text-primary) ${volume * 100}%, var(--border-color) ${volume * 100}%)` }}
        />
      </div>
    </div>
  );
}
