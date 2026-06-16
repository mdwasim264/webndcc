import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AppConfig } from './types';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdmissionModal, { AVAILABLE_COURSES } from './components/AdmissionModal';

// Pages
import Home from './pages/Home';
import AppDownload from './pages/AppDownload';
import Courses from './pages/Courses';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Resources from './pages/Resources';
import NoticeBoard from './pages/NoticeBoard';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';

const INITIAL_SETTINGS: AppConfig = {
  apkVersion: "2.1",
  apkSize: "15.4 MB",
  apkUrl: "https://example.com/downloads/new_direction_v2.1.apk",
  bannerTitle: "Your True Pathway in Patna",
  bannerSubtitle: "NEET, JEE & State Boards Masterclass Coaching Strategy",
  whatsappUrl: "https://chat.whatsapp.com/sample-invitation-link",
  cloudinaryCloudName: (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || "",
  cloudinaryUploadPreset: (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
  enableAds: false
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [appSettings, setAppSettings] = useState<AppConfig>(INITIAL_SETTINGS);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Theme dark mode toggles (saved inside localStorage)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Admission Modal State
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);

  // Sync admin auth status
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(user !== null && user.email === 'mdwasimalam264@gmail.com');
    });
    return unsub;
  }, []);

  // Sync settings when starting
  useEffect(() => {
    async function loadConfig() {
      try {
        const docRef = doc(db, 'settings', 'app_config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAppSettings({
            ...INITIAL_SETTINGS,
            ...data,
            cloudinaryCloudName: data.cloudinaryCloudName || (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || "",
            cloudinaryUploadPreset: data.cloudinaryUploadPreset || (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || ""
          } as AppConfig);
        }
      } catch (err) {
        console.warn('Using local settings configuration fallbacks:', err);
      }
    }
    loadConfig();
  }, []);

  // Simple routing listener (hash values triggers)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').toLowerCase();
      if (hash === 'admin') {
        setCurrentRoute('admin');
      } else if (hash === 'download') {
        setCurrentRoute('download');
      } else if (hash === 'courses') {
        setCurrentRoute('courses');
      } else if (hash === 'blog') {
        setCurrentRoute('blog');
        setSelectedBlogId(null);
      } else if (hash === 'resources') {
        setCurrentRoute('resources');
      } else if (hash === 'notices') {
        setCurrentRoute('notices');
      } else if (hash === 'about') {
        setCurrentRoute('about');
      } else if (hash === 'contact') {
        setCurrentRoute('contact');
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger initial on mount
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeRoute = (route: string) => {
    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    setSelectedBlogId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenAdmission = (courseId?: string) => {
    setSelectedCourseId(courseId);
    setIsAdmissionOpen(true);
  };

  const handleBlogPostSelect = (id: string) => {
    setSelectedBlogId(id);
    setCurrentRoute('blog-detail');
    window.scrollTo({ top: 0 });
  };

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Set default document class on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-250">
      
      {/* Dynamic Navigation Header */}
      <Navbar 
        currentPage={currentRoute} 
        onPageChange={changeRoute} 
        darkMode={isDarkMode} 
        onToggleDarkMode={toggleTheme}
        onOpenAdmission={() => handleOpenAdmission()}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Container Views Switch */}
      <main className="flex-grow py-8 bg-slate-100/35 dark:bg-slate-950/20">
        
        {currentRoute === 'home' && (
          <Home 
            onPageChange={changeRoute}
            onOpenAdmission={() => handleOpenAdmission()}
            apkVersion={appSettings.apkVersion}
            apkSize={appSettings.apkSize}
            apkUrl={appSettings.apkUrl}
            whatsappUrl={appSettings.whatsappUrl}
            enableAds={appSettings.enableAds}
          />
        )}
        
        {currentRoute === 'download' && (
          <AppDownload 
            apkVersion={appSettings.apkVersion} 
            apkSize={appSettings.apkSize} 
            apkUrl={appSettings.apkUrl} 
          />
        )}
        
        {currentRoute === 'courses' && (
          <Courses 
            onOpenAdmission={handleOpenAdmission} 
          />
        )}
        
        {currentRoute === 'blog' && (
          <Blog 
            onBlogPostSelect={handleBlogPostSelect} 
            whatsappUrl={appSettings.whatsappUrl}
            enableAds={appSettings.enableAds}
          />
        )}

        {currentRoute === 'blog-detail' && selectedBlogId && (
          <BlogPostDetail 
            blogId={selectedBlogId} 
            onBack={() => changeRoute('blog')} 
            whatsappUrl={appSettings.whatsappUrl}
            enableAds={appSettings.enableAds}
          />
        )}

        {currentRoute === 'resources' && (
          <Resources 
            apkVersion={appSettings.apkVersion} 
          />
        )}

        {currentRoute === 'notices' && (
          <NoticeBoard />
        )}

        {currentRoute === 'about' && (
          <About />
        )}

        {currentRoute === 'contact' && (
          <Contact 
            whatsappUrl={appSettings.whatsappUrl} 
          />
        )}

        {currentRoute === 'admin' && (
          <AdminDashboard 
            appSettings={appSettings} 
            onSettingsUpdate={(updated) => setAppSettings(updated)} 
          />
        )}

      </main>

      {/* Footer Directory lists */}
      <Footer 
        onPageChange={changeRoute}
        onOpenAdmission={() => handleOpenAdmission()}
        whatsappUrl={appSettings.whatsappUrl} 
        enableAds={appSettings.enableAds}
      />

      {/* Admission Booking Form Modal */}
      <AdmissionModal 
        isOpen={isAdmissionOpen} 
        onClose={() => setIsAdmissionOpen(false)} 
        selectedCourseId={selectedCourseId}
      />

    </div>
  );
}
