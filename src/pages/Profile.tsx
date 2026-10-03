import { motion } from 'motion/react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { Play } from 'lucide-react';

export default function Profile() {
  const { recentlyPlayed, playSong, currentSong, isPlaying } = usePlayer();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-10 pt-4">
      {/* Profile Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end mb-4">
        <div className="h-48 w-48 shrink-0 overflow-hidden rounded-full shadow-2xl bg-[#333] flex items-center justify-center">
          {user ? (
            <span className="text-6xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
          ) : (
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300&h=300" 
              alt="Profile Avatar" 
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Profile</span>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter">
            {user ? user.name : 'Guest User'}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-secondary)] font-medium">
            <span>{user ? user.email : 'No email provided'}</span>
            <span>•</span>
            <span>24 Public Playlists</span>
            <span>•</span>
            <span>1.2M Followers</span>
          </div>
        </div>
      </div>

      {/* Recently Played */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Recently Played</h2>
        {recentlyPlayed.length === 0 ? (
          <p className="text-[var(--text-secondary)]">You haven't played anything recently.</p>
        ) : (
          <div className="flex flex-col">
            {recentlyPlayed.slice(0, 5).map((song, idx) => (
              <motion.div
                key={song.id + idx} // append idx because recent might have duplicates
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`group flex items-center gap-4 rounded-md p-2 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer ${currentSong?.id === song.id ? 'bg-[var(--bg-hover)]' : ''}`}
                onClick={() => playSong(song, recentlyPlayed)}
              >
                <div className="relative h-12 w-12 flex-shrink-0">
                  <img src={song.cover} alt={song.title} className="h-full w-full rounded object-cover" />
                  <button 
                    className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity ${currentSong?.id === song.id ? 'opacity-100' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(song, recentlyPlayed);
                    }}
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                       <div className="flex gap-1 justify-center h-4 items-end">
                       <div className="w-1 h-3 bg-[var(--brand-color)] animate-bounce" style={{ animationDelay: '0ms' }} />
                       <div className="w-1 h-3 bg-[var(--brand-color)] animate-bounce" style={{ animationDelay: '150ms' }} />
                       <div className="w-1 h-3 bg-[var(--brand-color)] animate-bounce" style={{ animationDelay: '300ms' }} />
                     </div>
                    ) : (
                      <Play className="h-5 w-5 fill-white text-white ml-1" />
                    )}
                  </button>
                </div>
                
                <div className="flex flex-1 flex-col">
                  <span className={`text-base font-medium truncate ${currentSong?.id === song.id ? 'text-[var(--brand-color)]' : 'text-[var(--text-primary)]'}`}>
                    {song.title}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)] truncate">{song.artist}</span>
                </div>
                
                <span className="text-sm text-[var(--text-secondary)] hidden md:block w-32 truncate">{song.album}</span>
                
                <span className="text-sm text-[var(--text-secondary)] tabular-nums w-12 text-right">
                  {Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
