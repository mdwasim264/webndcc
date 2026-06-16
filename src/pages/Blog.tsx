import React, { useEffect, useState } from 'react';
import { BookOpen, Search, ThumbsUp, Calendar, ArrowRight, User, Sparkles } from 'lucide-react';
import { collection, query, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { BlogPost, BlogCategory } from '../types';
import AdvertSpace from '../components/AdvertSpace';

interface BlogProps {
  onBlogPostSelect: (blogId: string) => void;
  whatsappUrl?: string;
  enableAds?: boolean;
}

export const CATEGORIES_LABELS: Record<BlogCategory, string> = {
  'exam-prep': 'Exam Preparation',
  'study-tips': 'Study Tips',
  'career-guide': 'Career Guidance',
  'scholarship': 'Scholarships & Grants',
  'board-exams': 'Board Exams Status',
  'gov-exams': 'Government Jobs / Civil Preps'
};

export default function Blog({ onBlogPostSelect, whatsappUrl = 'https://chat.whatsapp.com/sample', enableAds }: BlogProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const loaded: BlogPost[] = [];
        snap.forEach(doc => {
          loaded.push({ id: doc.id, ...doc.data() } as BlogPost);
        });
        setBlogs(loaded);
      } else {
        setBlogs([]);
      }
      setLoading(false);
    }, (err) => {
      console.error("onSnapshot failed for blogs:", err);
      setBlogs([]);
      setLoading(false);
      handleFirestoreError(err, OperationType.LIST, 'blogs');
    });

    return () => unsubscribe();
  }, []);

  const filteredBlogs = blogs.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10">
      
      {/* Blog Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-3xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
          EDUCATIONAL INSIGHTS
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          SEO Blog & Study Resources
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
          Browse exam calendars, study timetables, toppers shortcuts, and scholarship test modules. No signups required—all concepts are completely public!
        </p>
      </div>

      {/* Main Grid: Articles + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        
        {/* Left Side: Search, Categories & Blog Cards list */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Filter Toolbar */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4.5 rounded-2xl border border-slate-150 dark:border-slate-900 flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search inputs */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search study guides, boards topics..." 
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-hidden text-slate-800 dark:text-slate-250 placeholder:text-slate-400"
              />
            </div>

            {/* Category selector */}
            <div className="w-full md:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as BlogCategory | 'all')}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:ring-0 focus:outline-hidden text-slate-800 dark:text-slate-250 cursor-pointer"
              >
                <option value="all">🔍 All SEO Topics</option>
                {Object.entries(CATEGORIES_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Cards List */}
          {loading ? (
            <div className="text-center py-16 space-y-2">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400 font-mono">Syncing articles, wait close...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/10 border border-dashed rounded-2xl p-6">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">No search match found</h4>
              <p className="text-xs text-slate-400 mt-1">Try utilizing different keys or reset the SEO filters drop.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBlogs.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-900 overflow-hidden flex flex-col justify-between hover:border-blue-4\00 hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Header Image */}
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img 
                        src={post.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'} 
                        alt={post.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-blue-600 text-white rounded text-3xs font-mono font-bold tracking-tight shadow-xs uppercase">
                        {CATEGORIES_LABELS[post.category]}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Active Article'}
                        </span>
                        <span>{post.views || 0} views</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  {/* Read trigger link */}
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center">
                    <span className="text-3xs font-mono text-slate-450 dark:text-slate-505">
                      By: {post.author}
                    </span>
                    <button
                      onClick={() => onBlogPostSelect(post.id)}
                      className="inline-flex items-center gap-1 text-3xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest cursor-pointer"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Side: Sidebar Ad and Quick highlights */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Ad Slot */}
          <AdvertSpace position="sidebar" showAds={enableAds} />

          {/* SEO Focus Keyword Outlines */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-150 dark:border-slate-900 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Trending CBSE Study Guides</span>
            </h4>
            
            <p className="text-2xs text-slate-500 leading-relaxed">
              Explore custom curated guides detailing scoring charts, important derivations, physics formula notes, and syllabus weightage keys. Always updated.
            </p>

            <ul className="space-y-2.5 text-xs">
              {['BSEB Class 12 Science Syllabus 2026', 'Best Medical Colleges in Bihar', 'JEE Advanced High-Yield Topics', 'Scholarships for CBSE Students'].map((tag, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-350 font-medium">
                  <User className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate">{tag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Newsletter Box */}
          <div className="bg-linear-to-b from-blue-900 to-indigo-950 text-white p-5 rounded-2xl border border-blue-800 text-center space-y-3">
            <h4 className="text-sm font-bold">Never Miss Any Exam Update</h4>
            <p className="text-3xs text-blue-200 leading-relaxed font-sans">
              Subscribe to get updates on Bihar Board Sheets, JEE Mains alerts, and ND-SAT mock answers sent to your device. Zero account required!
            </p>
            <button 
              onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
              className="w-full py-2 bg-white text-blue-950 text-2xs font-bold font-mono tracking-wider rounded-lg uppercase cursor-pointer"
            >
              Join WhatsApp Alert Channel
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
