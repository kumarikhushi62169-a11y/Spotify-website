import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { albums, artists } from '../data/playlists';
import { Play, Pause, Plus } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylist } from '../context/PlaylistContext';
import { songs as allSongs } from '../data/songs';

export default function Library() {
  const navigate = useNavigate();
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();
  const { allPlaylists, createPlaylist } = usePlaylist();
  const [tab, setTab] = useState<'playlists' | 'artists' | 'albums' | 'songs'>('playlists');

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">Your Library</h1>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--border-color)] overflow-x-auto">
            <button 
              onClick={() => setTab('playlists')} 
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                tab === 'playlists' ? 'bg-[var(--brand-color)] text-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Playlists ({allPlaylists.length})
            </button>
            <button 
              onClick={() => setTab('artists')} 
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                tab === 'artists' ? 'bg-[var(--brand-color)] text-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Artists ({artists.length})
            </button>
            <button 
              onClick={() => setTab('albums')} 
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                tab === 'albums' ? 'bg-[var(--brand-color)] text-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Albums ({albums.length})
            </button>
            <button 
              onClick={() => setTab('songs')} 
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                tab === 'songs' ? 'bg-[var(--brand-color)] text-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All Songs ({allSongs.length})
            </button>
          </div>

          <button 
            onClick={() => {
              const p = createPlaylist();
              navigate(`/playlist/${p.id}`);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-color)] text-black font-semibold text-xs hover:scale-105 transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Playlist</span>
          </button>
        </div>
      </div>
      
      {/* Playlists View */}
      {tab === 'playlists' && (
        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {allPlaylists.map((playlist, i) => {
              const isPlayingThis = isPlaying && playlist.songs.some(s => s.id === currentSong?.id);

              return (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3.5 transition-all shadow-sm hover:shadow-lg border border-transparent hover:border-[var(--border-color)]"
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                >
                  <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg shadow-md">
                    <img 
                      src={playlist.cover} 
                      alt={playlist.name} 
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <button 
                      className={`absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-color)] text-black shadow-2xl transition-all ${
                        isPlayingThis 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPlayingThis) {
                          togglePlay();
                        } else if (playlist.songs.length > 0) {
                          playSong(playlist.songs[0], playlist.songs);
                        }
                      }}
                      title={isPlayingThis ? 'Pause' : 'Play'}
                    >
                      {isPlayingThis ? (
                        <Pause className="h-5 w-5 fill-black" />
                      ) : (
                        <Play className="h-5 w-5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>
                  <h3 className="truncate font-semibold text-sm text-[var(--text-primary)] pb-0.5">{playlist.name}</h3>
                  <p className="line-clamp-2 text-xs text-[var(--text-secondary)]">{playlist.songs.length} songs</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Artists View */}
      {tab === 'artists' && (
        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {artists.map((artist, i) => {
              const isPlayingThis = isPlaying && artist.songs.some(s => s.id === currentSong?.id);

              return (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3.5 transition-all shadow-sm hover:shadow-lg border border-transparent hover:border-[var(--border-color)] text-center"
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-full shadow-lg mx-auto">
                    <img 
                      src={artist.cover} 
                      alt={artist.name} 
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <button 
                      className={`absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-color)] text-black shadow-2xl transition-all ${
                        isPlayingThis 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPlayingThis) {
                          togglePlay();
                        } else if (artist.songs.length > 0) {
                          playSong(artist.songs[0], artist.songs);
                        }
                      }}
                      title={isPlayingThis ? 'Pause' : 'Play'}
                    >
                      {isPlayingThis ? (
                        <Pause className="h-5 w-5 fill-black" />
                      ) : (
                        <Play className="h-5 w-5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>
                  <h3 className="truncate font-semibold text-sm text-[var(--text-primary)] pb-0.5">{artist.name}</h3>
                  <p className="line-clamp-1 text-xs text-[var(--text-secondary)]">{artist.followers} followers</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Albums View */}
      {tab === 'albums' && (
        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {albums.map((album, i) => {
              const isPlayingThis = isPlaying && album.songs.some(s => s.id === currentSong?.id);

              return (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3.5 transition-all shadow-sm hover:shadow-lg border border-transparent hover:border-[var(--border-color)]"
                  onClick={() => navigate(`/album/${album.id}`)}
                >
                  <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg shadow-md">
                    <img src={album.cover} alt={album.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <button 
                      className={`absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-color)] text-black shadow-2xl transition-all ${
                        isPlayingThis 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPlayingThis) {
                          togglePlay();
                        } else if (album.songs.length > 0) {
                          playSong(album.songs[0], album.songs);
                        }
                      }}
                      title={isPlayingThis ? 'Pause' : 'Play'}
                    >
                      {isPlayingThis ? (
                        <Pause className="h-5 w-5 fill-black" />
                      ) : (
                        <Play className="h-5 w-5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>
                  <h3 className="truncate font-semibold text-sm text-[var(--text-primary)] pb-0.5">{album.name}</h3>
                  <p className="line-clamp-1 text-xs text-[var(--text-secondary)]">{album.artist} • {album.year}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* All Songs View */}
      {tab === 'songs' && (
        <section className="flex flex-col gap-2">
          <div className="rounded-xl bg-[var(--bg-card)] p-4 border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border-color)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">All Available Tracks</span>
              <button 
                onClick={() => playSong(allSongs[0], allSongs)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-color)] text-black font-semibold text-xs hover:scale-105 transition"
              >
                <Play className="h-3.5 w-3.5 fill-black" />
                <span>Play All</span>
              </button>
            </div>

            <div className="flex flex-col divide-y divide-[var(--border-color)]/30">
              {allSongs.map((song, idx) => {
                const isCurrent = currentSong?.id === song.id;
                const isThisPlaying = isCurrent && isPlaying;

                return (
                  <div
                    key={song.id}
                    onClick={() => playSong(song, allSongs)}
                    className={`group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[var(--bg-hover)] transition cursor-pointer ${
                      isCurrent ? 'bg-[var(--bg-hover)] text-[var(--brand-color)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-6 text-center text-xs text-[var(--text-secondary)]">
                        {isThisPlaying ? (
                          <div className="flex items-end justify-center gap-0.5 h-3">
                            <span className="w-0.5 bg-[var(--brand-color)] h-full animate-pulse" />
                            <span className="w-0.5 bg-[var(--brand-color)] h-2/3 animate-pulse" />
                            <span className="w-0.5 bg-[var(--brand-color)] h-4/5 animate-pulse" />
                          </div>
                        ) : (
                          <span className="group-hover:hidden">{idx + 1}</span>
                        )}
                        <Play className={`h-3.5 w-3.5 fill-current hidden group-hover:block mx-auto ${isThisPlaying ? 'hidden' : ''}`} />
                      </div>

                      <img src={song.cover} alt={song.title} className="h-10 w-10 rounded-md object-cover flex-shrink-0" />
                      <div className="flex flex-col truncate">
                        <span className={`truncate text-sm font-medium ${isCurrent ? 'text-[var(--brand-color)] font-semibold' : ''}`}>
                          {song.title}
                        </span>
                        <span className="truncate text-xs text-[var(--text-secondary)]">
                          {song.artist} • {song.genre}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-[var(--text-secondary)] tabular-nums pl-4">
                      {Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
