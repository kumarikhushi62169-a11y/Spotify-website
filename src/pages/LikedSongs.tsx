import { motion } from 'motion/react';
import { Play, Heart, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { songs } from '../data/songs';

export default function LikedSongs() {
  const { likedSongs, playSong, toggleLike, isLiked, currentSong, isPlaying, togglePlay } = usePlayer();
  
  const likedSongsList = songs.filter(s => likedSongs.includes(s.id));

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end mb-8 pt-4">
        <div className="flex h-48 w-48 shrink-0 items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-300 shadow-2xl">
          <Heart className="h-24 w-24 fill-white text-white" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Playlist</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Liked Songs</h1>
          <div className="flex items-center gap-2 mt-2 text-sm font-medium">
            <span className="text-[var(--text-primary)]">User</span>
            <span className="text-[var(--text-secondary)]">•</span>
            <span className="text-[var(--text-secondary)]">{likedSongsList.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {likedSongsList.length > 0 && (
        <div className="mb-6 flex items-center gap-4">
          <button 
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-color)] hover:scale-105 transition-transform"
            onClick={() => playSong(likedSongsList[0], likedSongsList)}
          >
            <Play className="h-6 w-6 fill-black text-black ml-1" />
          </button>
        </div>
      )}

      {/* Tracklist */}
      {likedSongsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="h-16 w-16 mb-6 text-[var(--text-secondary)]" />
          <h2 className="text-2xl font-bold mb-2">Songs you like will appear here</h2>
          <p className="text-[var(--text-secondary)]">Save songs by tapping the heart icon.</p>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          {/* Header Row */}
          <div className="flex items-center gap-4 px-4 py-2 text-sm text-[var(--text-secondary)] border-b border-[var(--border-color)] mb-4">
            <div className="w-8 text-center">#</div>
            <div className="flex-1">Title</div>
            <div className="hidden md:block w-48">Album</div>
            <div className="w-16 flex justify-end">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          
          {/* List */}
          {likedSongsList.map((song, idx) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`group flex items-center gap-4 rounded-md px-4 py-2 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer ${currentSong?.id === song.id ? 'bg-[var(--bg-hover)]' : ''}`}
              onClick={() => playSong(song, likedSongsList)}
            >
              <div className="w-8 text-center text-sm text-[var(--text-secondary)]">
                {currentSong?.id === song.id && isPlaying ? (
                  <div className="flex gap-1 justify-center h-4 items-end">
                    <div className="w-1 h-3 bg-[var(--brand-color)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-3 bg-[var(--brand-color)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-3 bg-[var(--brand-color)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <span className="group-hover:hidden">{idx + 1}</span>
                )}
                <Play className={`h-4 w-4 fill-[var(--text-primary)] text-[var(--text-primary)] mx-auto hidden group-hover:block ${currentSong?.id === song.id && isPlaying ? 'hidden' : ''}`} />
              </div>
              
              <div className="flex flex-1 items-center gap-4 overflow-hidden">
                <img src={song.cover} alt={song.title} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                <div className="flex flex-col truncate">
                  <span className={`truncate ${currentSong?.id === song.id ? 'text-[var(--brand-color)]' : 'text-[var(--text-primary)]'}`}>
                    {song.title}
                  </span>
                  <span className="truncate text-sm text-[var(--text-secondary)] hover:underline">{song.artist}</span>
                </div>
              </div>
              
              <div className="hidden md:block w-48 truncate text-sm text-[var(--text-secondary)] hover:underline">
                {song.album}
              </div>
              
              <div className="flex w-16 items-center justify-end gap-3 text-sm text-[var(--text-secondary)]">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(song.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                  style={{ opacity: isLiked(song.id) ? 1 : undefined }}
                >
                  <Heart className={`h-4 w-4 ${isLiked(song.id) ? 'fill-[var(--brand-color)] text-[var(--brand-color)]' : 'hover:text-[var(--text-primary)]'}`} />
                </button>
                <span className="tabular-nums w-8 text-right">
                  {Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
