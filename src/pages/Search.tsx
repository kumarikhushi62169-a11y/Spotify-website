import { useState } from 'react';
import { Search as SearchIcon, Play, Heart, Users, Disc } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { songs } from '../data/songs';
import { artists, albums } from '../data/playlists';
import { usePlayer } from '../context/PlayerContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { playSong, toggleLike, isLiked, currentSong, isPlaying, togglePlay } = usePlayer();

  const lowerQuery = query.toLowerCase();

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(lowerQuery) ||
    song.artist.toLowerCase().includes(lowerQuery) ||
    song.album.toLowerCase().includes(lowerQuery) ||
    song.genre.toLowerCase().includes(lowerQuery)
  );

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(lowerQuery)
  );

  const filteredAlbums = albums.filter(album =>
    album.name.toLowerCase().includes(lowerQuery) ||
    album.artist.toLowerCase().includes(lowerQuery)
  );

  const browseCategories = [
    { title: 'Podcasts', color: 'bg-orange-500' },
    { title: 'Live Events', color: 'bg-purple-500' },
    { title: 'Made For You', color: 'bg-blue-900' },
    { title: 'New Releases', color: 'bg-pink-500' },
    { title: 'Pop', color: 'bg-green-500' },
    { title: 'Hip-Hop', color: 'bg-yellow-500' },
    { title: 'Rock', color: 'bg-red-500' },
    { title: 'Latin', color: 'bg-pink-600' },
    { title: 'Mood', color: 'bg-indigo-500' },
    { title: 'Indie', color: 'bg-blue-500' },
    { title: 'Workout', color: 'bg-gray-500' },
    { title: 'Chill', color: 'bg-teal-500' },
  ];

  const hasAnyResults = filteredSongs.length > 0 || filteredArtists.length > 0 || filteredAlbums.length > 0;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Search Input */}
      <div className="relative max-w-md sticky top-0 z-10 pt-2 pb-4 bg-[var(--bg-main)]">
        <div className="absolute inset-y-0 top-2 bottom-4 left-0 flex items-center pl-4 pointer-events-none text-[var(--text-secondary)]">
          <SearchIcon className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="block w-full rounded-full border-2 border-transparent py-3 pl-12 pr-4 bg-[var(--bg-hover)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] shadow-sm focus:border-white focus:bg-[var(--bg-card)] focus:outline-none transition-all duration-300"
        />
      </div>

      {query === '' ? (
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Browse all</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {browseCategories.map((category, idx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                className={`${category.color} aspect-square rounded-lg p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform shadow-md`}
              >
                <h3 className="font-bold text-white text-xl">{category.title}</h3>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded bg-black/20 rotate-[25deg] shadow-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {!hasAnyResults ? (
            <p className="text-[var(--text-secondary)]">No results found for "{query}"</p>
          ) : (
            <>
              {/* Artists Results */}
              {filteredArtists.length > 0 && (
                <section className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[var(--brand-color)]" />
                    <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Artists</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {filteredArtists.map((artist) => (
                      <div
                        key={artist.id}
                        onClick={() => navigate(`/artist/${artist.id}`)}
                        className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3.5 transition shadow-sm text-center border border-transparent hover:border-[var(--border-color)]"
                      >
                        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-full shadow-md mx-auto">
                          <img src={artist.cover} alt={artist.name} className="h-full w-full object-cover group-hover:scale-105 transition" />
                          <button
                            className="absolute bottom-2 right-2 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[var(--brand-color)] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (artist.songs.length > 0) playSong(artist.songs[0], artist.songs);
                            }}
                          >
                            <Play className="h-4 w-4 fill-black ml-0.5" />
                          </button>
                        </div>
                        <h4 className="truncate font-semibold text-sm text-[var(--text-primary)]">{artist.name}</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Artist</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Albums Results */}
              {filteredAlbums.length > 0 && (
                <section className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Disc className="h-4 w-4 text-[var(--brand-color)]" />
                    <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Albums</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {filteredAlbums.map((album) => (
                      <div
                        key={album.id}
                        onClick={() => navigate(`/album/${album.id}`)}
                        className="group cursor-pointer rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] p-3.5 transition shadow-sm border border-transparent hover:border-[var(--border-color)]"
                      >
                        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg shadow-md">
                          <img src={album.cover} alt={album.name} className="h-full w-full object-cover group-hover:scale-105 transition" />
                          <button
                            className="absolute bottom-2 right-2 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[var(--brand-color)] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (album.songs.length > 0) playSong(album.songs[0], album.songs);
                            }}
                          >
                            <Play className="h-4 w-4 fill-black ml-0.5" />
                          </button>
                        </div>
                        <h4 className="truncate font-semibold text-sm text-[var(--text-primary)]">{album.name}</h4>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{album.artist} • {album.year}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Songs Results */}
              {filteredSongs.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)] mb-1">Songs</h3>
                  <div className="flex flex-col">
                    {filteredSongs.map((song, idx) => (
                      <motion.div
                        key={song.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`group flex items-center gap-4 rounded-md p-2 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer ${currentSong?.id === song.id ? 'bg-[var(--bg-hover)]' : ''}`}
                        onClick={() => playSong(song, filteredSongs)}
                      >
                        <div className="relative h-12 w-12 flex-shrink-0">
                          <img src={song.cover} alt={song.title} className="h-full w-full rounded object-cover" />
                          <button 
                            className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity ${currentSong?.id === song.id ? 'opacity-100' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentSong?.id === song.id) togglePlay();
                              else playSong(song, filteredSongs);
                            }}
                          >
                            {currentSong?.id === song.id && isPlaying ? (
                              <div className="flex gap-1">
                                <div className="w-1 h-3 bg-[var(--brand-color)] animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1 h-3 bg-[var(--brand-color)] animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1 h-3 bg-[var(--brand-color)] animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            ) : (
                              <Play className="h-5 w-5 fill-white text-white ml-1" />
                            )}
                          </button>
                        </div>
                        
                        <div className="flex flex-1 flex-col min-w-0">
                          <span className={`text-base font-medium truncate ${currentSong?.id === song.id ? 'text-[var(--brand-color)]' : 'text-[var(--text-primary)]'}`}>
                            {song.title}
                          </span>
                          <span className="text-sm text-[var(--text-secondary)] truncate">{song.artist}</span>
                        </div>
                        
                        <span className="text-sm text-[var(--text-secondary)] hidden md:block w-32 truncate">{song.album}</span>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(song);
                          }} 
                          className="p-2 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                          style={{ opacity: isLiked(song.id) ? 1 : undefined }}
                        >
                          <Heart className={`h-5 w-5 ${isLiked(song.id) ? 'fill-[var(--brand-color)] text-[var(--brand-color)]' : 'text-[var(--text-secondary)] hover:text-white'}`} />
                        </button>
                        
                        <span className="text-sm text-[var(--text-secondary)] tabular-nums w-12 text-right">
                          {Math.floor(song.duration / 60)}:{Math.floor(song.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
