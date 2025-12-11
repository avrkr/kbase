import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, LayoutDashboard, UserCircle } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <span className="font-bold text-xl">K</span>
          </div>
          <span className="tracking-tight text-slate-800">kbase</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
            >
              Home
            </Link>
            {user && (
              <Link 
                to={user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/dashboard'} 
                className={`text-sm font-medium transition-colors ${isActive('/dashboard') || isActive('/admin') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="h-6 w-px bg-slate-200"></div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden lg:block">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 px-3 py-2">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary text-sm shadow-lg shadow-primary-500/30">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          <Link to="/" className="p-2 hover:bg-slate-50 rounded-lg font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          {user ? (
            <>
              <Link 
                to={user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/dashboard'} 
                className="p-2 hover:bg-slate-50 rounded-lg font-medium text-slate-700 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <div className="border-t border-slate-100 my-2"></div>
              <div className="flex items-center gap-3 p-2">
                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-700">{user.name}</span>
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
