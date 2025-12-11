import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Menu, X, LayoutDashboard, UserCircle, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <span className="font-bold text-xl">K</span>
          </div>
          <span className="tracking-tight text-slate-800 dark:text-white">kbase</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'}`}
            >
              Home
            </Link>
            {user && (
              <Link 
                to={user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/dashboard'} 
                className={`text-sm font-medium transition-colors ${isActive('/dashboard') || isActive('/admin') ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'}`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden lg:block">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary text-sm shadow-lg shadow-primary-500/30">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          <Link to="/" className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium text-slate-700 dark:text-slate-200" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          {user ? (
            <>
              <Link 
                to={user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/dashboard'} 
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
              <div className="flex items-center gap-3 p-2">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
              </div>
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-2 w-full text-left"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-slate-100 my-2"></div>
              <Link to="/login" className="p-2 hover:bg-slate-50 rounded-lg font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary w-full justify-center" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
