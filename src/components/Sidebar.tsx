import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, Pin, ArrowRight, Play, Pause, User, Disc } from 'lucide-react';
import { playlists, albums, artists } from '../data/playlists';
import { usePlaylist } from '../context/PlaylistContext';
import { usePlayer } from '../context/PlayerContext';
import { useState } from 'react';

export default function Sidebar() {
  const activeClass = "flex items-center gap-4 px-4 py-3 rounded-md text-[var(--text-primary)] font-medium transition-colors bg-[var(--bg-hover)]";
  const inactiveClass = "flex items-center gap-4 px-4 py-3 rounded-md text-[var(--text-secondary)] font-medium transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]";
  
  const { userPlaylists, createPlaylist } = usePlaylist();
  const { playSong, togglePlay, currentSong, isPlaying, likedSongs } = usePlayer();
  const [filter, setFilter] = useState<string | null>(null);

  return (
    <aside className="hidden w-72 flex-col gap-2 md:flex h-full">
      {/* Top Menu */}
      <div className="flex flex-col gap-1 rounded-xl bg-[var(--bg-card)] p-3 shadow-sm">
        <div className="mb-4 flex items-center gap-2 px-4 py-2 mt-2">
          <span className="text-[var(--brand-color)]">
            <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Spotify</span>
        </div>
        <NavLink to="/" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <Home className="h-6 w-6" />
          <span className="text-base font-bold">Home</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <Search className="h-6 w-6" />
          <span className="text-base font-bold">Search</span>
        </NavLink>
      </div>

      {/* Library */}
      <div className="flex flex-1 flex-col rounded-xl bg-[var(--bg-card)] p-3 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-2 py-3 text-[var(--text-secondary)]">
          <NavLink to="/library" className="flex items-center gap-3 font-bold hover:text-[var(--text-primary)] transition-colors px-2">
            <Library className="h-6 w-6" />
            <span className="text-base">Your Library</span>
          </NavLink>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => createPlaylist()}
              className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
              title="Create playlist"
            >
              <Plus className="h-5 w-5" />
            </button>
            <NavLink to="/library" className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors hidden lg:block" title="Expand Library">
              <ArrowRight className="h-5 w-5" />
            </NavLink>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 px-2 py-2 overflow-x-auto scrollbar-hide pb-3">
          {['Playlists', 'Artists', 'Albums'].map((f) => {
            const isSelected = filter === f;
            return (
              <button 
                key={f} 
                onClick={() => setFilter(isSelected ? null : f)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected 
                    ? 'bg-[var(--brand-color)] text-black font-semibold hover:scale-105 shadow-sm' 
                    : 'bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex flex-col gap-1 overflow-y-auto px-1 scrollbar-hide flex-1">
          {/* Liked Songs pin (shown in All and Playlists view) */}
          {(!filter || filter === 'Playlists') && (
            <NavLink to="/liked" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors group ${isActive ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : ''}`}>
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-indigo-300 text-white shadow-sm">
                <Heart className="h-5 w-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-[var(--text-primary)]">Liked Songs</span>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <Pin className="h-3 w-3 text-[var(--brand-color)] fill-[var(--brand-color)]" />
                  <span>Playlist • {likedSongs.length} songs</span>
                </div>
              </div>
            </NavLink>
          )}

          {/* User Playlists */}
          {(!filter || filter === 'Playlists') && userPlaylists.map(p => {
            const isPlayingThis = isPlaying && p.songs.some(s => s.id === currentSong?.id);
            return (
              <NavLink 
                key={p.id} 
                to={`/playlist/${p.id}`}
                className={({ isActive }) => `relative flex items-center justify-between gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors group ${
                  isActive ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                    <img src={p.cover} alt={p.name} className="h-full w-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isPlayingThis) {
                          togglePlay();
                        } else if (p.songs && p.songs.length > 0) {
                          playSong(p.songs[0], p.songs);
                        }
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Play"
                    >
                      {isPlayingThis ? (
                        <Pause className="h-5 w-5 fill-white text-white" />
                      ) : (
                        <Play className="h-5 w-5 fill-[var(--brand-color)] text-[var(--brand-color)] ml-0.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className={`truncate text-[15px] font-medium ${isPlayingThis ? 'text-[var(--brand-color)] font-semibold' : 'text-[var(--text-primary)]'}`}>
                      {p.name}
                    </span>
                    <span className="truncate text-xs text-[var(--text-secondary)]">Playlist • You</span>
                  </div>
                </div>

                {isPlayingThis && (
                  <div className="flex items-end gap-0.5 h-3 pr-1">
                    <span className="w-0.5 bg-[var(--brand-color)] h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-[var(--brand-color)] h-2/3 animate-[pulse_0.4s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-[var(--brand-color)] h-4/5 animate-[pulse_0.8s_ease-in-out_infinite]" />
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* Curated Spotify Playlists */}
          {(!filter || filter === 'Playlists') && playlists.map(p => {
            const isPlayingThis = isPlaying && p.songs.some(s => s.id === currentSong?.id);
            return (
              <NavLink 
                key={p.id} 
                to={`/playlist/${p.id}`}
                className={({ isActive }) => `relative flex items-center justify-between gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors group ${
                  isActive ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                    <img src={p.cover} alt={p.name} className="h-full w-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isPlayingThis) {
                          togglePlay();
                        } else if (p.songs && p.songs.length > 0) {
                          playSong(p.songs[0], p.songs);
                        }
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Play"
                    >
                      {isPlayingThis ? (
                        <Pause className="h-5 w-5 fill-white text-white" />
                      ) : (
                        <Play className="h-5 w-5 fill-[var(--brand-color)] text-[var(--brand-color)] ml-0.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className={`truncate text-[15px] font-medium ${isPlayingThis ? 'text-[var(--brand-color)] font-semibold' : 'text-[var(--text-primary)]'}`}>
                      {p.name}
                    </span>
                    <span className="truncate text-xs text-[var(--text-secondary)]">Playlist • Spotify</span>
                  </div>
                </div>

                {isPlayingThis && (
                  <div className="flex items-end gap-0.5 h-3 pr-1">
                    <span className="w-0.5 bg-[var(--brand-color)] h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-[var(--brand-color)] h-2/3 animate-[pulse_0.4s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-[var(--brand-color)] h-4/5 animate-[pulse_0.8s_ease-in-out_infinite]" />
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* Artists List when Artists filter is active (or in All view) */}
          {filter === 'Artists' && artists.map(artist => {
            const isPlayingThis = isPlaying && artist.songs.some(s => s.id === currentSong?.id);
            return (
              <NavLink 
                key={artist.id} 
                to={`/artist/${artist.id}`}
                className={({ isActive }) => `relative flex items-center justify-between gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors group ${
                  isActive ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full shadow-sm">
                    <img src={artist.cover} alt={artist.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isPlayingThis) {
                          togglePlay();
                        } else if (artist.songs && artist.songs.length > 0) {
                          playSong(artist.songs[0], artist.songs);
                        }
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      title={`Play ${artist.name}`}
                    >
                      {isPlayingThis ? (
                        <Pause className="h-5 w-5 fill-white text-white" />
                      ) : (
                        <Play className="h-5 w-5 fill-[var(--brand-color)] text-[var(--brand-color)] ml-0.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className={`truncate text-[15px] font-medium ${isPlayingThis ? 'text-[var(--brand-color)] font-semibold' : 'text-[var(--text-primary)]'}`}>
                      {artist.name}
                    </span>
                    <span className="truncate text-xs text-[var(--text-secondary)]">Artist • {artist.followers}</span>
                  </div>
                </div>

                {isPlayingThis && (
                  <div className="flex items-end gap-0.5 h-3 pr-1">
                    <span className="w-0.5 bg-[var(--brand-color)] h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-[var(--brand-color)] h-2/3 animate-[pulse_0.4s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-[var(--brand-color)] h-4/5 animate-[pulse_0.8s_ease-in-out_infinite]" />
                  </div>
                )}
              </NavLink>
            );
          })}
          
          {/* Albums List when Albums filter is active */}
          {filter === 'Albums' && albums.map(album => {
            const isPlayingThis = isPlaying && album.songs.some(s => s.id === currentSong?.id);
            return (
              <NavLink 
                key={album.id} 
                to={`/album/${album.id}`}
                className={({ isActive }) => `relative flex items-center justify-between gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors group ${
                  isActive ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md shadow-sm">
                    <img src={album.cover} alt={album.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isPlayingThis) {
                          togglePlay();
                        } else if (album.songs && album.songs.length > 0) {
                          playSong(album.songs[0], album.songs);
                        }
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      title={`Play ${album.name}`}
                    >
                      {isPlayingThis ? (
                        <Pause className="h-5 w-5 fill-white text-white" />
                      ) : (
                        <Play className="h-5 w-5 fill-[var(--brand-color)] text-[var(--brand-color)] ml-0.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className={`truncate text-[15px] font-medium ${isPlayingThis ? 'text-[var(--brand-color)] font-semibold' : 'text-[var(--text-primary)]'}`}>
                      {album.name}
                    </span>
                    <span className="truncate text-xs text-[var(--text-secondary)]">Album • {album.artist}</span>
                  </div>
                </div>

                {isPlayingThis && (
                  <div className="flex items-end gap-0.5 h-3 pr-1">
                    <span className="w-0.5 bg-[var(--brand-color)] h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-[var(--brand-color)] h-2/3 animate-[pulse_0.4s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-[var(--brand-color)] h-4/5 animate-[pulse_0.8s_ease-in-out_infinite]" />
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
