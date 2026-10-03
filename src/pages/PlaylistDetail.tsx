import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Pause, Heart, Clock, Shuffle, Trash2, Plus, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylist } from '../context/PlaylistContext';
import { songs as allDefaultSongs, Song } from '../data/songs';

function formatDuration(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function PlaylistDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaylistById, addSongToPlaylist, removeSongFromPlaylist, deletePlaylist, userPlaylists } = usePlaylist();
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, isLiked, queue } = usePlayer();

  const playlist = id ? getPlaylistById(id) : undefined;

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Music className="h-16 w-16 mb-4 text-[var(--text-secondary)] opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Playlist Not Found</h2>
        <p className="text-[var(--text-secondary)] mb-6">The playlist you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/library')} 
          className="px-6 py-2.5 rounded-full bg-[var(--brand-color)] text-black font-semibold hover:scale-105 transition"
        >
          Go to Your Library
        </button>
      </div>
    );
  }

  const isCurrentPlaylist = queue.length > 0 && playlist.songs.some(s => s.id === currentSong?.id);
  const isUserPlaylist = userPlaylists.some(p => p.id === playlist.id);
  const totalDurationSecs = playlist.songs.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalDurationMin = Math.round(totalDurationSecs / 60);

  const handlePlayPlaylist = () => {
    if (!playlist || playlist.songs.length === 0) return;
    const isSongFromThisPlaylist = playlist.songs.some(s => s.id === currentSong?.id);
    if (isSongFromThisPlaylist) {
      togglePlay();
    } else {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  const handleShufflePlay = () => {
    if (playlist.songs.length === 0) return;
    const shuffled = [...playlist.songs].sort(() => Math.random() - 0.5);
    playSong(shuffled[0], shuffled);
  };

  // Recommended songs that are not yet in this playlist
  const recommendedSongs = allDefaultSongs
    .filter(s => !playlist.songs.some(ps => ps.id === s.id))
    .slice(0, 5);

  return (
    <div className="flex flex-col pb-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end mb-8 pt-4 pb-2 border-b border-[var(--border-color)]">
        <div className="relative group h-52 w-52 shrink-0 overflow-hidden rounded-lg shadow-2xl bg-[var(--bg-card)]">
          <img 
            src={playlist.cover} 
            alt={playlist.name} 
            className="h-full w-full object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105" 
          />
        </div>

        <div className="flex flex-col justify-end gap-2 flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            {isUserPlaylist ? 'Public Playlist • Custom' : 'Verified Playlist • Spotify'}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)]">
            {playlist.name}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl mt-1">
            {playlist.description}
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm font-medium text-[var(--text-secondary)]">
            <span className="text-[var(--text-primary)] font-semibold">
              {isUserPlaylist ? 'You' : 'Spotify'}
            </span>
            <span>•</span>
            <span>{playlist.songs.length} songs</span>
            <span>•</span>
            <span>about {totalDurationMin} min</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePlayPlaylist}
            disabled={playlist.songs.length === 0}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-color)] text-black shadow-xl hover:scale-105 active:scale-95 transition-all ${
              playlist.songs.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            title="Play playlist"
          >
            {isCurrentPlaylist && isPlaying ? (
              <Pause className="h-7 w-7 fill-black" />
            ) : (
              <Play className="h-7 w-7 fill-black ml-1" />
            )}
          </button>

          <button 
            onClick={handleShufflePlay}
            disabled={playlist.songs.length === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition"
            title="Shuffle"
          >
            <Shuffle className="h-5 w-5" />
          </button>

          {isUserPlaylist && (
            <button 
              onClick={() => {
                if (window.confirm(`Delete "${playlist.name}"?`)) {
                  deletePlaylist(playlist.id);
                  navigate('/library');
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
              title="Delete Playlist"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Song Table */}
      {playlist.songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[var(--border-color)] rounded-xl my-4">
          <Music className="h-12 w-12 text-[var(--text-secondary)] mb-3" />
          <h3 className="text-xl font-bold mb-1">This playlist is empty</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Add songs below to start listening!</p>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          {/* Header Row */}
          <div className="flex items-center gap-4 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-color)] mb-2">
            <div className="w-8 text-center">#</div>
            <div className="flex-1">Title</div>
            <div className="hidden md:block w-48">Album</div>
            <div className="w-20 flex justify-end items-center pr-2">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          {/* Song Rows */}
          {playlist.songs.map((song, idx) => {
            const isSongActive = currentSong?.id === song.id;
            const isSongPlaying = isSongActive && isPlaying;

            return (
              <motion.div
                key={`${song.id}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`group flex items-center gap-4 rounded-lg px-4 py-2.5 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer ${
                  isSongActive ? 'bg-[var(--bg-hover)]/80 text-[var(--brand-color)]' : 'text-[var(--text-primary)]'
                }`}
                onClick={() => playSong(song, playlist.songs)}
              >
                {/* Number / Equalizer */}
                <div className="w-8 text-center text-sm text-[var(--text-secondary)] flex items-center justify-center">
                  {isSongPlaying ? (
                    <div className="flex items-end justify-center gap-0.5 h-4 w-4">
                      <span className="w-1 bg-[var(--brand-color)] h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                      <span className="w-1 bg-[var(--brand-color)] h-2/3 animate-[pulse_0.4s_ease-in-out_infinite]" />
                      <span className="w-1 bg-[var(--brand-color)] h-4/5 animate-[pulse_0.8s_ease-in-out_infinite]" />
                    </div>
                  ) : (
                    <>
                      <span className="group-hover:hidden">{idx + 1}</span>
                      <Play className="h-4 w-4 fill-current hidden group-hover:block ml-0.5" />
                    </>
                  )}
                </div>

                {/* Song Cover & Info */}
                <div className="flex flex-1 items-center gap-3.5 overflow-hidden">
                  <img 
                    src={song.cover} 
                    alt={song.title} 
                    className="h-10 w-10 rounded-md object-cover flex-shrink-0 shadow-sm" 
                  />
                  <div className="flex flex-col truncate">
                    <span className={`truncate font-medium text-sm ${isSongActive ? 'text-[var(--brand-color)] font-semibold' : 'text-[var(--text-primary)]'}`}>
                      {song.title}
                    </span>
                    <span className="truncate text-xs text-[var(--text-secondary)] hover:underline">
                      {song.artist}
                    </span>
                  </div>
                </div>

                {/* Album */}
                <div className="hidden md:block w-48 truncate text-sm text-[var(--text-secondary)]">
                  {song.album}
                </div>

                {/* Like & Duration & Remove */}
                <div className="flex w-20 items-center justify-end gap-3 text-sm text-[var(--text-secondary)]">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 hover:text-[var(--brand-color)]"
                    style={{ opacity: isLiked(song.id) ? 1 : undefined }}
                    title={isLiked(song.id) ? "Unlike" : "Like"}
                  >
                    <Heart className={`h-4 w-4 ${isLiked(song.id) ? 'fill-[var(--brand-color)] text-[var(--brand-color)]' : ''}`} />
                  </button>

                  <span className="tabular-nums text-xs">
                    {formatDuration(song.duration)}
                  </span>

                  {isUserPlaylist && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSongFromPlaylist(playlist.id, song.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition hover:text-red-400"
                      title="Remove from playlist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recommended Songs Section */}
      {recommendedSongs.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
          <h3 className="text-xl font-bold mb-1">Recommended Songs</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Based on what's in this playlist</p>

          <div className="flex flex-col gap-1">
            {recommendedSongs.map(s => (
              <div 
                key={s.id}
                className="group flex items-center justify-between rounded-lg px-4 py-2.5 hover:bg-[var(--bg-hover)] transition cursor-pointer"
                onClick={() => playSong(s, allDefaultSongs)}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <img src={s.cover} alt={s.title} className="h-10 w-10 rounded-md object-cover shadow-sm" />
                  <div className="flex flex-col truncate">
                    <span className="truncate text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-color)]">{s.title}</span>
                    <span className="truncate text-xs text-[var(--text-secondary)]">{s.artist}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isUserPlaylist) {
                        addSongToPlaylist(playlist.id, s);
                      } else {
                        // User can add to user playlist
                        addSongToPlaylist(playlist.id, s);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--text-secondary)]/50 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-color)] hover:text-[var(--brand-color)] transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
