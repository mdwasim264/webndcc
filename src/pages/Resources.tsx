import React, { useEffect, useState } from 'react';
import { Search, FileDown, BookOpen, Download, Sparkles } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { FreeResource } from '../types';

interface ResourcesProps {
  apkVersion: string;
}

const DEFAULT_RESOURCES: FreeResource[] = [
  {
    id: 'res-1',
    title: 'Class 12th Physics: Electrostatics High-Scoring Formula Cheatbook',
    category: 'notes',
    classTarget: 'Class 12th',
    subject: 'Physics',
    downloadUrl: 'https://res.cloudinary.com/new-direction/raw/upload/physics_electrostatics_formulas.pdf',
    fileSize: '2.4 MB'
  },
  {
    id: 'res-2',
    title: 'Class 12th Chemistry: Complete Organic Naming Reactions Guide',
    category: 'notes',
    classTarget: 'Class 12th',
    subject: 'Chemistry',
    downloadUrl: 'https://res.cloudinary.com/new-direction/raw/upload/organic_naming_reactions_twelve.pdf',
    fileSize: '3.1 MB'
  },
  {
    id: 'res-3',
    title: 'NEET Botany: Genetics & Plant Heredity Crucial MCQs Bank',
    category: 'pdfs',
    classTarget: 'NEET Prep',
    subject: 'Biology',
    downloadUrl: 'https://res.cloudinary.com/new-direction/raw/upload/neet_genetics_question_bank.pdf',
    fileSize: '4.8 MB'
  },
  {
    id: 'res-4',
    title: 'JEE Advanced Mathematics: Integral Calculus Tricks & Shortcuts',
    category: 'papers',
    classTarget: 'JEE Prep',
    subject: 'Mathematics',
    downloadUrl: 'https://res.cloudinary.com/new-direction/raw/upload/jee_calculus_integration_hacks.pdf',
    fileSize: '1.9 MB'
  },
  {
    id: 'res-5',
    title: 'Class 10th Study Board Notes: Science Chapter 1 to 3 Formulas',
    category: 'notes',
    classTarget: 'Class 10th',
    subject: 'Science (Junior)',
    downloadUrl: 'https://res.cloudinary.com/new-direction/raw/upload/class_ten_science_board_formula.pdf',
    fileSize: '1.5 MB'
  },
  {
    id: 'res-6',
    title: 'Class 12th Biology: CBSE Board Secondary Mock Solved Question Paper 2025',
    category: 'papers',
    classTarget: 'Class 12th',
    subject: 'Biology',
    downloadUrl: 'https://res.cloudinary.com/new-direction/raw/upload/board_solved_papers_biology.pdf',
    fileSize: '5.2 MB'
  }
];

export default function Resources({ apkVersion }: ResourcesProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'notes' | 'pdfs' | 'papers' | 'syllabus'>('all');
  const [downloadTracker, setDownloadTracker] = useState<Record<string, number>>({});
  const [resources, setResources] = useState<FreeResource[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'resources'));
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list: FreeResource[] = [];
        snap.forEach(doc => {
          const data = doc.data();
          list.push({
            id: doc.id,
            title: data.title || '',
            category: data.category || 'notes',
            classTarget: data.classTarget || data.target || '',
            subject: data.subject || '',
            downloadUrl: data.downloadUrl || '',
            fileSize: data.fileSize || '1.2 MB'
          });
        });
        setResources(list);
      } else {
        setResources(DEFAULT_RESOURCES);
      }
    }, (err) => {
      console.error("Failed to fetch resources from Firestore:", err);
      setResources(DEFAULT_RESOURCES);
    });

    return () => unsubscribe();
  }, []);

  const handleDownload = (id: string, url: string, title: string) => {
    setDownloadTracker(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    
    // Open clean redirect
    if (url) {
      window.open(url, '_blank');
    }
  };

  const filtered = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          res.subject.toLowerCase().includes(search.toLowerCase()) || 
                          res.classTarget.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || res.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10">
      
      {/* Header introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-3xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
          FREE LIBRARY VAULT (FMC SYSTEM)
        </span>
        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
          Free Chapter Notes & Paper Checklists
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
          Unlock maximum focus. We believe premium baseline material must be accessible to all candidates. Download solved exam papers, formulas cheatbooks, and syllabus modifications. Zero login steps.
        </p>
      </div>

      {/* App promo card banner */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left text-xs">
          <span className="text-3xs uppercase font-mono tracking-wider font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 justify-center md:justify-start">
            <Sparkles className="w-3.5 h-3.5 text-blue-505 animate-pulse" /> Live interactive app companion
          </span>
          <p className="text-slate-700 dark:text-slate-200 leading-normal">
            Did you know? All these notes and solved papers are integrated inside our official Android Mobile Application to let you read them offline!
          </p>
        </div>
        <button 
          onClick={() => handleDownload('app-companion', 'https://example.com/mobile-companion', 'Download Mobile Companion')}
          className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xs px-4.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Get Offline App APK</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-900/20 p-4 rounded-xl border border-slate-150 dark:border-slate-905">
          
          {/* Categories Tab button */}
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: '🔍 All Materials' },
              { id: 'notes', label: 'Notes' },
              { id: 'pdfs', label: 'PDFs' },
              { id: 'papers', label: 'Papers' },
              { id: 'syllabus', label: 'Syllabus' }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`tab-fmc-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chapters, formulas, NEET..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-xs focus:outline-hidden text-slate-850 dark:text-slate-200"
            />
          </div>

        </div>

        {/* Catalog list */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-705">No match found</h4>
            <p className="text-xs text-slate-405 mt-1">Try shifting your filter category or input keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((res) => (
              <div 
                key={res.id} 
                id={`resource-card-${res.id}`}
                className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-900 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  
                  {/* Subject and Category labels */}
                  <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold tracking-wider">
                    <span className="text-blue-600 dark:text-blue-400">{res.subject}</span>
                    <span className="text-slate-400">{res.classTarget}</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-slate-905 dark:text-slate-100 group-hover:text-blue-500 transition-colors line-clamp-3 leading-relaxed">
                    {res.title}
                  </h4>

                </div>

                {/* Footer action trigger */}
                <div className="border-t border-slate-100 dark:border-slate-900 mt-6 pt-4 flex justify-between items-center">
                  <span className="text-[10px] text-slate-450 font-mono">
                    Size: {res.fileSize} / <strong>{downloadTracker[res.id] || 0} downloads</strong>
                  </span>
                  
                  <button
                    id={`fmc-down-${res.id}`}
                    onClick={() => handleDownload(res.id, res.downloadUrl, res.title)}
                    className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-3xs uppercase px-3 py-1.5 rounded-lg transition-colors border border-slate-150 dark:border-slate-800 cursor-pointer"
                  >
                    <span>Download PDF</span>
                    <FileDown className="w-3.5 h-3.5 text-blue-500" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
