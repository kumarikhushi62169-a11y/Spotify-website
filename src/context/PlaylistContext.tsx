import React, { createContext, useContext, useState, useEffect } from 'react';
import { Playlist, playlists as defaultPlaylists } from '../data/playlists';
import { Song, songs as defaultSongs } from '../data/songs';

interface PlaylistContextType {
  userPlaylists: Playlist[];
  allPlaylists: Playlist[];
  createPlaylist: (name?: string) => Playlist;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('spotify-user-playlists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default starter user playlist with Arijit Singh & Honey Singh tracks
    return [
      {
        id: 'up-1',
        name: 'My Desi Favorites',
        description: 'Best Hindi and Punjabi party tracks and love songs.',
        cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=400',
        songs: [defaultSongs[0], defaultSongs[1], defaultSongs[6], defaultSongs[7], defaultSongs[11]],
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('spotify-user-playlists', JSON.stringify(userPlaylists));
  }, [userPlaylists]);

  const createPlaylist = (customName?: string): Playlist => {
    // Pick 3 songs to start the playlist with so it is immediately playable
    const starterSongs = [
      defaultSongs[(userPlaylists.length * 2) % defaultSongs.length],
      defaultSongs[(userPlaylists.length * 2 + 1) % defaultSongs.length],
      defaultSongs[(userPlaylists.length * 2 + 2) % defaultSongs.length],
    ];

    const newPlaylist: Playlist = {
      id: `up-${Date.now()}`,
      name: customName || `My Playlist #${userPlaylists.length + 1}`,
      description: 'Curated by you.',
      cover: starterSongs[0]?.cover || 'https://images.unsplash.com/photo-1619983081563-430f63602796?auto=format&fit=crop&q=80&w=400&h=400',
      songs: starterSongs
    };
    setUserPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setUserPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (p.songs.some(s => s.id === song.id)) return p;
        return { ...p, songs: [...p.songs, song] };
      }
      return p;
    }));
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setUserPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, songs: p.songs.filter(s => s.id !== songId) };
      }
      return p;
    }));
  };

  const deletePlaylist = (playlistId: string) => {
    setUserPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  const allPlaylists = [...userPlaylists, ...defaultPlaylists];

  const getPlaylistById = (id: string): Playlist | undefined => {
    return allPlaylists.find(p => p.id === id);
  };

  return (
    <PlaylistContext.Provider value={{ 
      userPlaylists, 
      allPlaylists, 
      createPlaylist, 
      addSongToPlaylist, 
      removeSongFromPlaylist, 
      deletePlaylist,
      getPlaylistById 
    }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
}
