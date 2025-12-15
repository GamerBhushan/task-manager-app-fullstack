import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LuLayoutDashboard, 
  LuLogOut, 
  LuUser, 
  LuMenu, 
  LuX, 
  LuChevronDown, 
  LuInfo
} from 'react-icons/lu';
import { NotificationBell } from './NotificationBell';
import { Button } from './ui/Button';
import { clsx } from 'clsx';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    ...(user ? [{ name: 'Task Board', href: '/dashboard', icon: LuLayoutDashboard }] : []),
    { name: 'About', href: '/about', icon: LuInfo },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* --- LOGO --- */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
                <LuLayoutDashboard className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Task Manager
              </span>
            </Link>

            {/* --- DESKTOP NAV --- */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={clsx(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                      isActive(link.href)
                        ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <link.icon size={16} />
                    {link.name}
                  </Link>
                ))}
              </div>

              {user && <div className="h-6 w-px bg-slate-200" />}

              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <NotificationBell />
                    <div className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                      >
                        <div className="text-right hidden lg:block">
                          <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">Pro Member</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <LuChevronDown className={clsx("text-slate-400 transition-transform", isProfileOpen && "rotate-180")} size={16} />
                      </button>

                      {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                          <div className="px-4 py-3 border-b border-slate-50 mb-1">
                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                          <Link 
                            to="/profile" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 mx-2 rounded-lg transition-colors"
                          >
                            <LuUser size={16} /> My Profile
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 mx-2 rounded-lg transition-colors"
                          >
                            <LuLogOut size={16} /> Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm">Sign In</Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* --- MOBILE TOGGLE --- */}
            <div className="flex md:hidden items-center gap-4">
              {user && <NotificationBell />}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-95 transition-transform"
                aria-label="Open Menu"
              >
                <LuMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY (Fixed Z-Index & Visibility) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          
          {/* 1. Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* 2. White Drawer */}
          <div className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col h-full border-l border-slate-200">
            
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <span className="text-lg font-bold text-slate-900">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full transition-colors bg-white shadow-sm border border-slate-200"
                aria-label="Close Menu"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={clsx(
                    "flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all border",
                    isActive(link.href)
                      ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                      : "bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <link.icon size={22} className={isActive(link.href) ? "text-indigo-600" : "text-slate-400"} />
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Footer / Profile */}
            <div className="p-5 border-t border-slate-100 bg-slate-50">
              {user ? (
                <div className="space-y-5">
                   {/* User Card */}
                   <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3">
                     <Link to="/profile" className="col-span-1">
                        <Button variant="secondary" className="w-full justify-center h-10" icon={<LuUser size={16} />}>
                          Profile
                        </Button>
                     </Link>
                     <Button 
                       onClick={logout} 
                       variant="danger" 
                       className="w-full justify-center h-10 col-span-1" 
                       icon={<LuLogOut size={16} />}
                     >
                       Sign Out
                     </Button>
                   </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" className="block">
                    <Button variant="secondary" className="w-full justify-center h-12 text-base">Sign In</Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button className="w-full justify-center h-12 text-base">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};