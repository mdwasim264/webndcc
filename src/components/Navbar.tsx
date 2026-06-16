import React from 'react';
import { Compass, Menu, X, Sun, Moon, Sparkles, Download, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdmission: () => void;
  isAdminLoggedIn: boolean;
}

export default function Navbar({
  currentPage,
  onPageChange,
  darkMode,
  onToggleDarkMode,
  onOpenAdmission,
  isAdminLoggedIn
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'download', label: 'Android App' },
    { id: 'courses', label: 'Batches' },
    { id: 'blog', label: 'Blog' },
    { id: 'resources', label: 'Free Material' },
    { id: 'notices', label: 'Notice Board' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-900 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div 
            onClick={() => { onPageChange('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-550/20 group-hover:bg-blue-700 transition-colors">
              ND
            </div>
            <div>
              <span className="font-sans font-extrabold text-base md:text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1 leading-none">
                New Direction
                <Sparkles className="w-4 h-4 text-blue-550 hover:rotate-12 transition-transform" />
              </span>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 font-bold uppercase mt-1 leading-none">
                Coaching Center
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer tracking-tight transition-all duration-150 ${
                  currentPage === item.id
                    ? 'text-blue-605 dark:text-blue-400 font-bold bg-slate-50 dark:bg-slate-900/60'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions (Admissions, Theme Toggle, Mobile Trigger) */}
          <div className="flex items-center gap-2">
            {/* Admin indicator */}
            {isAdminLoggedIn && (
              <button 
                onClick={() => onPageChange('admin')}
                className="hidden sm:flex items-center gap-1.5 bg-rose-50 dark:bg-rose-955/35 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20 px-3 py-1.5 rounded-lg text-3xs font-mono font-bold"
                title="Admin session active"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Admin</span>
              </button>
            )}

            {/* Dark Mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-blue-600 transition-all cursor-pointer border border-transparent"
              title="Toggle theme mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Apply button */}
            <button
              onClick={onOpenAdmission}
              className="hidden md:flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none cursor-pointer transition-all hover:scale-101"
            >
              Apply Now
            </button>

            {/* Mobile menu and Admin panel triggers */}
            <button
              onClick={() => onPageChange('admin')}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"
              title="Admin Panel"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-150 dark:border-slate-900 bg-white dark:bg-slate-950 py-3 px-4 shadow-lg animate-fadeIn">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  currentPage === item.id
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-2">
              {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    onPageChange('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  Admin Dashboard Logged-In
                </button>
              )}

              <button
                onClick={() => {
                  onOpenAdmission();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs shadow-xs"
              >
                Register/Admission Form
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
