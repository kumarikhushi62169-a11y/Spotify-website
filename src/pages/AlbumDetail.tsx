import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Pause, Heart, Shuffle, Disc, Clock, Music } from 'lucide-react';
import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { getAlbumById, artists, albums } from '../data/playlists';

function formatDuration(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, isLiked, queue } = usePlayer();
  const [isSaved, setIsSaved] = useState(false);

  const album = id ? getAlbumById(id) : undefined;

  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Disc className="h-16 w-16 mb-4 text-[var(--text-secondary)] opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Album Not Found</h2>
        <p className="text-[var(--text-secondary)] mb-6">The album you are looking for does not exist.</p>
        <button 
          onClick={() => navigate('/library')} 
          className="px-6 py-2.5 rounded-full bg-[var(--brand-color)] text-black font-semibold hover:scale-105 transition"
        >
          Go to Your Library
        </button>
      </div>
    );
  }

  const isCurrentAlbum = queue.length > 0 && album.songs.some(s => s.id === currentSong?.id);
  const totalDurationSecs = album.songs.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalDurationMin = Math.round(totalDurationSecs / 60);

  // Find matching artist for linking
  const matchedArtist = artists.find(a => album.artist.toLowerCase().includes(a.name.toLowerCase()));
  const otherAlbums = albums.filter(a => a.id !== album.id && a.artist.toLowerCase().includes(album.artist.split(',')[0].trim().toLowerCase()));

  const handlePlayAlbum = () => {
    if (!album || album.songs.length === 0) return;
    const isSongFromThisAlbum = album.songs.some(s => s.id === currentSong?.id);
    if (isSongFromThisAlbum) {
      togglePlay();
    } else {
      playSong(album.songs[0], album.songs);
    }
  };

  const handleShufflePlay = () => {
    if (album.songs.length === 0) return;
    const shuffled = [...album.songs].sort(() => Math.random() - 0.5);
    playSong(shuffled[0], shuffled);
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Album Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pt-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-60 md:w-60 flex-shrink-0 overflow-hidden rounded-xl shadow-2xl"
        >
          <img 
            src={album.cover} 
            alt={album.name} 
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="flex flex-col gap-2 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Album</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight">
            {album.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-[var(--text-secondary)] mt-1">
            {matchedArtist ? (
              <Link 
                to={`/artist/${matchedArtist.id}`} 
                className="font-bold text-[var(--text-primary)] hover:underline hover:text-[var(--brand-color)] transition-colors"
              >
                {album.artist}
              </Link>
            ) : (
              <span className="font-bold text-[var(--text-primary)]">{album.artist}</span>
            )}
            <span>•</span>
            <span>{album.year}</span>
            <span>•</span>
            <span>{album.songs.length} song{album.songs.length > 1 ? 's' : ''}, {totalDurationMin} min</span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={handlePlayAlbum}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-color)] text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
          title={isCurrentAlbum && isPlaying ? "Pause" : "Play"}
        >
          {isCurrentAlbum && isPlaying ? (
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
          onClick={() => setIsSaved(!isSaved)}
          className={`p-3 transition-all ${
            isSaved 
              ? 'text-[var(--brand-color)] hover:scale-110' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
          title={isSaved ? "Saved to Library" : "Save to Your Library"}
        >
          <Heart className={`h-6 w-6 ${isSaved ? 'fill-[var(--brand-color)]' : ''}`} />
        </button>
      </div>

      {/* Tracklist Table */}
      <div className="flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-[16px_1fr_40px] gap-4 px-4 py-2 border-b border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          <div className="text-center">#</div>
          <div>Title</div>
          <div className="text-right">
            <Clock className="h-4 w-4 ml-auto" />
          </div>
        </div>

        {/* Songs List */}
        <div className="flex flex-col divide-y divide-[var(--border-color)]/20 mt-1">
          {album.songs.map((song, index) => {
            const isThisSong = currentSong?.id === song.id;
            const isThisPlaying = isThisSong && isPlaying;
            const liked = isLiked(song.id);

            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => playSong(song, album.songs)}
                className={`group grid grid-cols-[16px_1fr_40px] items-center gap-4 px-4 py-3 rounded-lg hover:bg-[var(--bg-hover)] transition cursor-pointer ${
                  isThisSong ? 'bg-[var(--bg-hover)] text-[var(--brand-color)]' : 'text-[var(--text-primary)]'
                }`}
              >
                {/* Index / Play indicator */}
                <div className="text-center text-sm text-[var(--text-secondary)]">
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

                {/* Song info & like button */}
                <div className="flex items-center justify-between min-w-0 pr-2">
                  <div className="flex flex-col truncate">
                    <span className={`truncate text-sm font-medium ${isThisSong ? 'text-[var(--brand-color)] font-semibold' : ''}`}>
                      {song.title}
                    </span>
                    <span className="truncate text-xs text-[var(--text-secondary)]">
                      {song.artist}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2 hover:scale-110"
                    title={liked ? "Remove from Liked" : "Save to Liked"}
                  >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-[var(--brand-color)] text-[var(--brand-color)] opacity-100' : 'text-[var(--text-secondary)]'}`} />
                  </button>
                </div>

                {/* Duration */}
                <div className="text-right text-xs text-[var(--text-secondary)] tabular-nums">
                  {formatDuration(song.duration)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* More by Artist */}
      {otherAlbums.length > 0 && (
        <section className="flex flex-col gap-4 mt-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            More by {album.artist.split(',')[0]}
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {otherAlbums.map((other) => (
              <div
                key={other.id}
                onClick={() => navigate(`/album/${other.id}`)}
                className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3.5 transition-all shadow-sm hover:shadow-lg border border-transparent hover:border-[var(--border-color)]"
              >
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg shadow-md">
                  <img src={other.cover} alt={other.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <button
                    className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[var(--brand-color)] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (other.songs.length > 0) playSong(other.songs[0], other.songs);
                    }}
                  >
                    <Play className="h-4 w-4 fill-black ml-0.5" />
                  </button>
                </div>
                <h3 className="truncate font-semibold text-sm text-[var(--text-primary)] pb-0.5">{other.name}</h3>
                <p className="line-clamp-1 text-xs text-[var(--text-secondary)]">{other.year} • Album</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
