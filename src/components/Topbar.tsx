import { ChevronLeft, ChevronRight, User, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-[var(--bg-card)]/90 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate(-1)} 
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-[var(--text-primary)] hover:bg-black/60 transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={() => navigate(1)} 
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-[var(--text-primary)] hover:bg-black/60 transition"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <div className="mr-2 text-sm font-medium text-[var(--text-primary)] hidden md:block">
            {user.name}
          </div>
        )}
        
        <button 
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 hover:scale-105 transition"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        
        <Link to="/settings" className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 hover:scale-105 transition" title="Settings">
          <Settings className="h-4 w-4" />
        </Link>
        
        <Link to="/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 hover:scale-105 transition" title="Profile">
          <User className="h-4 w-4" />
        </Link>

        <button 
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-[var(--text-secondary)] hover:scale-105 hover:bg-red-600 hover:text-white transition-all"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
