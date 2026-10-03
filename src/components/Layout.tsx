import { Outlet, NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart } from 'lucide-react';
import Sidebar from './Sidebar';
import Player from './Player';
import Topbar from './Topbar';

export default function Layout() {
  const activeClass = "flex flex-col items-center gap-1 text-[var(--text-primary)] transition-colors";
  const inactiveClass = "flex flex-col items-center gap-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]";

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)]">
      <div className="flex w-full flex-1 overflow-hidden p-0 md:p-2 gap-2">
        <Sidebar />
        <main className="relative flex flex-1 flex-col overflow-hidden md:rounded-lg bg-[var(--bg-card)]">
          <Topbar />
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-24">
            <Outlet />
          </div>
        </main>
      </div>
      <Player />
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex h-[60px] w-full shrink-0 items-center justify-around bg-[var(--bg-main)] border-t border-[var(--border-color)] px-4 z-50">
        <NavLink to="/" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <Home className="h-6 w-6" />
          <span className="text-[10px]">Home</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <Search className="h-6 w-6" />
          <span className="text-[10px]">Search</span>
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <Library className="h-6 w-6" />
          <span className="text-[10px]">Library</span>
        </NavLink>
        <NavLink to="/liked" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <Heart className="h-6 w-6" />
          <span className="text-[10px]">Liked</span>
        </NavLink>
      </div>
    </div>
  );
}


