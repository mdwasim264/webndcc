import React, { useEffect, useState } from 'react';
import { Volume2, Pin, Calendar, Loader2, RefreshCcw, FolderOpen, ArrowRight } from 'lucide-react';
import { collection, query, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Notice, NoticeCategory } from '../types';

const CATEGORIES_MAPPING: Record<NoticeCategory, string> = {
  general: '📢 General Notices',
  batch: '⚡ Batch Coordinations',
  holiday: '🌴 Holiday Schedules',
  exam: '✍ Exam Alerts & Results'
};

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeCategory, setActiveCategory] = useState<NoticeCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const loaded: Notice[] = [];
        snap.forEach(doc => {
          loaded.push({ id: doc.id, ...doc.data() } as Notice);
        });
        setNotices(loaded);
      } else {
        setNotices([]);
      }
      setLoading(false);
    }, (err) => {
      console.error("onSnapshot failed for notices:", err);
      setNotices([]);
      setLoading(false);
      handleFirestoreError(err, OperationType.LIST, 'notices');
    });

    return () => unsubscribe();
  }, []);

  const filteredNotices = notices.filter(note => {
    return activeCategory === 'all' || note.category === activeCategory;
  });

  // Separate pinned announcements
  const pinnedEntries = filteredNotices.filter(n => n.pinned);
  const otherEntries = filteredNotices.filter(n => !n.pinned);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10">
      
      {/* Notice board header summary */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-3xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
          COMMUNICATION DESK
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Active Bulletin Notice Board
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
          Get real-time announcements on physical classes schedule, test charts, holiday notifications, and academic calendars. This board updates instantly from the center administrator.
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap gap-1.5 justify-center py-2 border-b border-dashed border-slate-100 dark:border-slate-900">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/40'
          }`}
        >
          🔍 All Announcements
        </button>
        {Object.entries(CATEGORIES_MAPPING).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as NoticeCategory)}
            className={`px-4.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeCategory === key
                ? 'bg-blue-600 text-white'
                : 'text-slate-550 hover:bg-slate-100 dark:hover:bg-slate-900/40'
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 space-y-2">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto animate-pulse" />
          <p className="text-xs text-slate-400 font-mono">Syncing coaching bulletins...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="py-24 text-center">
          <FolderOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">Notice board empty</h4>
          <p className="text-xs text-slate-400">All announcements are archived. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Pinned section */}
          {pinnedEntries.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 flex items-center gap-1.5 pl-1">
                <Pin className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Pinned announcements (High Action)</span>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pinnedEntries.map((note) => (
                  <div 
                    key={note.id} 
                    className="p-6 rounded-2xl bg-indigo-50/40 dark:bg-slate-950 border-2 border-indigo-200 dark:border-indigo-900/30 shadow-xs relative overflow-hidden"
                  >
                    {/* Corner accent decorative */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-200 dark:bg-indigo-900/25 rounded-bl-3xl flex items-center justify-center text-indigo-700 dark:text-indigo-400">
                      <Pin className="w-4 h-4 stroke-2" />
                    </div>

                    <div className="space-y-2 max-w-[90%]">
                      <div className="flex items-center gap-3 text-[10px] uppercase font-mono font-bold text-indigo-600 dark:text-indigo-455">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {note.createdAt?.toDate ? note.createdAt.toDate().toLocaleDateString() : 'Pinned Post'}
                        </span>
                        <span>•</span>
                        <span>{note.category}</span>
                      </div>
                      <h4 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {note.title}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans pt-2">
                        {note.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Standard Notices list */}
          <div className="space-y-4">
            {pinnedEntries.length > 0 && otherEntries.length > 0 && (
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 pl-1 pt-4">
                <span>Timeline Announcements feed</span>
              </h3>
            )}
            
            <div className="space-y-4.5">
              {otherEntries.map((note) => (
                <div 
                  key={note.id} 
                  className="p-5.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-900 shadow-3xs flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-800 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-[10px] font-mono text-slate-450 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {note.createdAt?.toDate ? note.createdAt.toDate().toLocaleDateString() : 'Active Notice'}
                      </span>
                      <span>•</span>
                      <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 capitalize">
                        {note.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                      {note.title}
                    </h4>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans max-w-4xl">
                      {note.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
