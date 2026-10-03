import { motion } from 'motion/react';
import { Play, Pause } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { playlists, albums, artists } from '../data/playlists';
import { songs } from '../data/songs';

function Greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const navigate = useNavigate();
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();

  // Top featured tracks: Arijit Singh & Honey Singh tracks prominently displayed
  const featuredTracks = songs.filter(s => s.artist.includes('Arijit Singh') || s.artist.includes('Honey Singh')).slice(0, 8);
  const punjabiTracks = songs.filter(s => ['Diljit', 'AP Dhillon', 'Sidhu'].some(a => s.artist.includes(a)));

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* Greeting & Quick Playlists */}
      <section>
        <h1 className="mb-6 text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)]">
          <Greeting />
        </h1>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.slice(0, 8).map((playlist, i) => {
            const isPlayingThis = isPlaying && playlist.songs.some(s => s.id === currentSong?.id);

            return (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative flex h-20 cursor-pointer items-center overflow-hidden rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)]/30 transition-all shadow-sm hover:shadow-md"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                <img src={playlist.cover} alt={playlist.name} className="h-20 w-20 object-cover shadow-[4px_0_12px_rgba(0,0,0,0.3)] shrink-0" />
                <div className="flex flex-col px-3.5 overflow-hidden flex-1">
                  <span className={`font-bold text-sm truncate ${isPlayingThis ? 'text-[var(--brand-color)]' : 'text-[var(--text-primary)]'}`}>
                    {playlist.name}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] truncate">
                    {playlist.songs.length} songs
                  </span>
                </div>
                
                <button 
                  className={`mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-color)] text-black shadow-xl transition-all ${
                    isPlayingThis 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPlayingThis) {
                      togglePlay();
                    } else if (playlist.songs.length > 0) {
                      playSong(playlist.songs[0], playlist.songs);
                    }
                  }}
                  title={isPlayingThis ? "Pause" : "Play"}
                >
                  {isPlayingThis ? (
                    <Pause className="h-5 w-5 fill-black" />
                  ) : (
                    <Play className="h-5 w-5 fill-black ml-0.5" />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Arijit Singh & Honey Singh Hits Special */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Arijit Singh & Honey Singh Special
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">All-time chartbusters & soulful melodies that play instantly</p>
          </div>
          <Link to="/library" className="text-xs font-bold text-[var(--text-secondary)] hover:underline hover:text-[var(--text-primary)] transition-colors">
            Show all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {featuredTracks.map((song, i) => {
            const isSongActive = currentSong?.id === song.id;
            const isSongPlaying = isSongActive && isPlaying;

            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3 transition-all duration-200 shadow-sm hover:shadow-md border border-transparent hover:border-[var(--border-color)]"
                onClick={() => playSong(song, featuredTracks)}
              >
                <div className="relative mb-2.5 aspect-square w-full overflow-hidden rounded-lg shadow-md">
                  <img src={song.cover} alt={song.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <button 
                    className={`absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-color)] text-black shadow-xl transition-all ${
                      isSongPlaying ? 'opacity-100 scale-100' : 'opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSongPlaying) {
                        togglePlay();
                      } else {
                        playSong(song, featuredTracks);
                      }
                    }}
                  >
                    {isSongPlaying ? (
                      <Pause className="h-4 w-4 fill-black" />
                    ) : (
                      <Play className="h-4 w-4 fill-black ml-0.5" />
                    )}
                  </button>
                </div>
                <h3 className={`truncate font-semibold text-xs pb-0.5 ${isSongActive ? 'text-[var(--brand-color)]' : 'text-[var(--text-primary)]'}`}>
                  {song.title}
                </h3>
                <p className="line-clamp-1 text-[11px] text-[var(--text-secondary)]">{song.artist}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Punjabi Heat (Diljit, AP Dhillon, Sidhu Moose Wala) */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Punjabi Heat & Pop Hits
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">Diljit Dosanjh, AP Dhillon, Sidhu Moose Wala & Honey Singh</p>
          </div>
          <Link to="/playlist/p-punjabi" className="text-xs font-bold text-[var(--text-secondary)] hover:underline hover:text-[var(--text-primary)] transition-colors">
            Play Playlist
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
          {punjabiTracks.map((song, i) => {
            const isSongActive = currentSong?.id === song.id;
            const isSongPlaying = isSongActive && isPlaying;

            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3.5 transition-all duration-200 shadow-sm hover:shadow-md border border-transparent hover:border-[var(--border-color)]"
                onClick={() => playSong(song, punjabiTracks)}
              >
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg shadow-md">
                  <img src={song.cover} alt={song.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <button 
                    className={`absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-color)] text-black shadow-xl transition-all ${
                      isSongPlaying ? 'opacity-100 scale-100' : 'opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSongPlaying) {
                        togglePlay();
                      } else {
                        playSong(song, punjabiTracks);
                      }
                    }}
                  >
                    {isSongPlaying ? (
                      <Pause className="h-5 w-5 fill-black" />
                    ) : (
                      <Play className="h-5 w-5 fill-black ml-0.5" />
                    )}
                  </button>
                </div>
                <h3 className={`truncate font-semibold text-sm pb-0.5 ${isSongActive ? 'text-[var(--brand-color)]' : 'text-[var(--text-primary)]'}`}>
                  {song.title}
                </h3>
                <p className="line-clamp-1 text-xs text-[var(--text-secondary)]">{song.artist}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Albums */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Trending Albums</h2>
          <Link to="/library" className="text-xs font-bold text-[var(--text-secondary)] hover:underline hover:text-[var(--text-primary)] transition-colors">
            Show all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {albums.map((album, i) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3.5 transition-all shadow-sm hover:shadow-md border border-transparent hover:border-[var(--border-color)]"
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg shadow-md">
                <img src={album.cover} alt={album.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <button 
                  className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[var(--brand-color)] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (album.songs.length > 0) playSong(album.songs[0], album.songs);
                  }}
                  title={`Play ${album.name}`}
                >
                  <Play className="h-4 w-4 fill-black ml-0.5" />
                </button>
              </div>
              <h3 className="truncate font-semibold text-xs pb-0.5 text-[var(--text-primary)]">{album.name}</h3>
              <p className="line-clamp-1 text-[11px] text-[var(--text-secondary)]">{album.artist} • {album.year}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Artists */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Popular Artists</h2>
          <Link to="/library" className="text-xs font-bold text-[var(--text-secondary)] hover:underline hover:text-[var(--text-primary)] transition-colors">
            Show all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {artists.map((artist, i) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3.5 transition-all shadow-sm hover:shadow-md border border-transparent hover:border-[var(--border-color)] text-center"
              onClick={() => navigate(`/artist/${artist.id}`)}
            >
              <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-full shadow-lg mx-auto">
                <img src={artist.cover} alt={artist.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <button 
                  className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[var(--brand-color)] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (artist.songs && artist.songs.length > 0) {
                      playSong(artist.songs[0], artist.songs);
                    }
                  }}
                  title={`Play ${artist.name}`}
                >
                  <Play className="h-4 w-4 fill-black ml-0.5" />
                </button>
              </div>
              <h3 className="truncate font-semibold text-xs pb-0.5 text-[var(--text-primary)]">{artist.name}</h3>
              <p className="truncate text-[11px] text-[var(--text-secondary)]">{artist.followers} monthly listeners</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
