import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Pause, Heart, Shuffle, CheckCircle, Disc, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { getArtistById, albums } from '../data/playlists';

function formatDuration(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, isLiked, queue } = usePlayer();
  const [isFollowing, setIsFollowing] = useState(false);

  const artist = id ? getArtistById(id) : undefined;

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Users className="h-16 w-16 mb-4 text-[var(--text-secondary)] opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Artist Not Found</h2>
        <p className="text-[var(--text-secondary)] mb-6">The artist you are looking for does not exist.</p>
        <button 
          onClick={() => navigate('/library')} 
          className="px-6 py-2.5 rounded-full bg-[var(--brand-color)] text-black font-semibold hover:scale-105 transition"
        >
          Go to Your Library
        </button>
      </div>
    );
  }

  const isCurrentArtist = queue.length > 0 && artist.songs.some(s => s.id === currentSong?.id);
  const artistAlbums = albums.filter(a => a.artist.toLowerCase().includes(artist.name.toLowerCase()));

  const handlePlayArtist = () => {
    if (!artist || artist.songs.length === 0) return;
    const isSongFromThisArtist = artist.songs.some(s => s.id === currentSong?.id);
    if (isSongFromThisArtist) {
      togglePlay();
    } else {
      playSong(artist.songs[0], artist.songs);
    }
  };

  const handleShufflePlay = () => {
    if (artist.songs.length === 0) return;
    const shuffled = [...artist.songs].sort(() => Math.random() - 0.5);
    playSong(shuffled[0], shuffled);
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Hero Header */}
      <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-6 sm:p-8 md:p-10 flex flex-col justify-end min-h-[300px] md:min-h-[360px] overflow-hidden rounded-b-2xl shadow-xl">
        <div className="absolute inset-0 z-0">
          <img 
            src={artist.cover} 
            alt={artist.name} 
            className="w-full h-full object-cover filter brightness-75 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/60 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white drop-shadow">
            <CheckCircle className="h-5 w-5 fill-[#3d91f4] text-white" />
            <span>Verified Artist</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md">
            {artist.name}
          </h1>

          <p className="text-sm sm:text-base font-medium text-white/90 drop-shadow">
            {artist.monthlyListeners || `${artist.followers} followers`} monthly listeners
          </p>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={handlePlayArtist}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-color)] text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
          title={isCurrentArtist && isPlaying ? "Pause" : "Play"}
        >
          {isCurrentArtist && isPlaying ? (
            <Pause className="h-6 w-6 fill-black" />
          ) : (
            <Play className="h-6 w-6 fill-black ml-1" />
          )}
        </button>

        <button
          onClick={handleShufflePlay}
          className="p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 transition-all"
          title="Shuffle"
        >
          <Shuffle className="h-6 w-6" />
        </button>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition ${
            isFollowing 
              ? 'border-[var(--brand-color)] text-[var(--brand-color)] bg-[var(--brand-color)]/10' 
              : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* Popular Tracks Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Popular</h2>

        <div className="flex flex-col divide-y divide-[var(--border-color)]/20">
          {artist.songs.map((song, index) => {
            const isThisSong = currentSong?.id === song.id;
            const isThisPlaying = isThisSong && isPlaying;
            const liked = isLiked(song.id);

            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => playSong(song, artist.songs)}
                className={`group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[var(--bg-hover)] transition cursor-pointer ${
                  isThisSong ? 'bg-[var(--bg-hover)] text-[var(--brand-color)]' : 'text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-5 text-center text-xs text-[var(--text-secondary)]">
                    {isThisPlaying ? (
                      <div className="flex items-end justify-center gap-0.5 h-3">
                        <span className="w-0.5 bg-[var(--brand-color)] h-full animate-pulse" />
                        <span className="w-0.5 bg-[var(--brand-color)] h-2/3 animate-pulse" />
                        <span className="w-0.5 bg-[var(--brand-color)] h-4/5 animate-pulse" />
                      </div>
                    ) : (
                      <span className="group-hover:hidden">{index + 1}</span>
                    )}
                    <Play className={`h-3.5 w-3.5 fill-current hidden group-hover:block mx-auto ${isThisPlaying ? 'hidden' : ''}`} />
                  </div>

                  <img src={song.cover} alt={song.title} className="h-10 w-10 rounded object-cover flex-shrink-0" />

                  <div className="flex flex-col truncate">
                    <span className={`truncate text-sm font-medium ${isThisSong ? 'text-[var(--brand-color)] font-semibold' : ''}`}>
                      {song.title}
                    </span>
                    <span className="truncate text-xs text-[var(--text-secondary)]">
                      {song.album}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] pl-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:scale-110"
                    title={liked ? "Remove from Liked" : "Save to Liked"}
                  >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-[var(--brand-color)] text-[var(--brand-color)] opacity-100' : ''}`} />
                  </button>

                  <span className="tabular-nums">{formatDuration(song.duration)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Discography / Albums Section */}
      {artistAlbums.length > 0 && (
        <section className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Disc className="h-5 w-5 text-[var(--brand-color)]" />
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Discography</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {artistAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => navigate(`/album/${album.id}`)}
                className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3.5 transition-all shadow-sm hover:shadow-lg border border-transparent hover:border-[var(--border-color)]"
              >
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg shadow-md">
                  <img src={album.cover} alt={album.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <button
                    className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[var(--brand-color)] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (album.songs.length > 0) playSong(album.songs[0], album.songs);
                    }}
                  >
                    <Play className="h-4 w-4 fill-black ml-0.5" />
                  </button>
                </div>
                <h3 className="truncate font-semibold text-sm text-[var(--text-primary)] pb-0.5">{album.name}</h3>
                <p className="line-clamp-1 text-xs text-[var(--text-secondary)]">{album.year} • Album</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Artist Bio / About Section */}
      {artist.bio && (
        <section className="flex flex-col gap-3 mt-4">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">About</h2>
          <div className="rounded-2xl bg-[var(--bg-card)] p-6 border border-[var(--border-color)] flex flex-col md:flex-row gap-6 items-start">
            <div className="h-28 w-28 md:h-36 md:w-36 rounded-full overflow-hidden shrink-0 shadow-lg border-2 border-[var(--border-color)]">
              <img src={artist.cover} alt={artist.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[var(--text-primary)]">{artist.name}</span>
                <span className="text-xs bg-[var(--brand-color)]/20 text-[var(--brand-color)] px-2 py-0.5 rounded-full font-semibold">Artist</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                {artist.bio}
              </p>
              <div className="flex items-center gap-6 mt-3 text-xs text-[var(--text-secondary)] font-medium">
                <div>
                  <span className="text-base font-bold text-[var(--text-primary)] block">{artist.monthlyListeners || artist.followers}</span>
                  Monthly Listeners
                </div>
                <div>
                  <span className="text-base font-bold text-[var(--text-primary)] block">{artist.followers}</span>
                  Followers
                </div>
                <div>
                  <span className="text-base font-bold text-[var(--text-primary)] block">{artist.songs.length}</span>
                  Available Tracks
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
