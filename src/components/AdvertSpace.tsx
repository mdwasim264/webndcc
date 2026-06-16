import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface AdvertSpaceProps {
  position: 'header' | 'sidebar' | 'in-article' | 'footer';
  className?: string;
  showAds?: boolean;
}

export default function AdvertSpace({ position, className = '', showAds = false }: AdvertSpaceProps) {
  const [closed, setClosed] = useState(false);

  if (!showAds || closed) return null;

  // Render sizes and layouts based on position
  const getLayoutDetails = () => {
    switch (position) {
      case 'header':
        return {
          sizeText: 'Leaderboard (728 × 90)',
          containerStyle: 'w-full bg-slate-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 text-center py-4 px-2 rounded-lg relative overflow-hidden',
          title: 'Join New Direction Online Test Series 2026',
          subtitle: 'Boost NEET/JEE raw scores by 25% with smart real-time performance metrics. Register for the APK today!',
          cta: 'Free Trial'
        };
      case 'sidebar':
        return {
          sizeText: 'Square (300 × 250)',
          containerStyle: 'w-full bg-linear-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-900 border border-indigo-100 dark:border-slate-800 p-5 rounded-xl relative flex flex-col items-center justify-between minimum-h-[280px]',
          title: 'Daily Quiz & Mock PDFs',
          subtitle: 'Available exclusively in our Android App. Instant feedback & solutions.',
          cta: 'Download APK'
        };
      case 'in-article':
        return {
          sizeText: 'Banner (468 × 60)',
          containerStyle: 'w-full bg-slate-50 dark:bg-slate-900 border-l-4 border-indigo-600 p-4 rounded-r-xl my-6 flex flex-col sm:flex-row items-center justify-between gap-4',
          title: '⚡ Scholarship Test (ND-SAT): Up to 100% Fee Waiver!',
          subtitle: 'Apply before June 30th for Classes 9 to 12.',
          cta: 'Register Now'
        };
      case 'footer':
        return {
          sizeText: 'Large Mobile Banner (320 × 100)',
          containerStyle: 'w-full bg-slate-900 text-slate-100 border border-slate-800 p-4 text-center rounded-lg my-4 relative flex flex-col items-center justify-center gap-1',
          title: 'New Direction Android App is live!',
          subtitle: 'Practice offline previous-year paper mockups easily. Free access code: FIRST100',
          cta: 'Get APK Now'
        };
    }
  };

  const ad = getLayoutDetails();

  return (
    <div id={`ad-${position}-container`} className={`${className} group transition-all duration-300`}>
      <div className={ad.containerStyle}>
        {/* AdSense Info Badges */}
        <div className="flex items-center justify-between mb-2 w-full text-[10px] md:text-2xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
            <span>AdSense Ready Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{ad.sizeText}</span>
            <button 
              onClick={() => setClosed(true)} 
              className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              title="Hide Ad"
            >
              <X className="w-3 h-3 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full justify-center text-center items-center">
          <h4 className="text-sm font-semibold text-indigo-950 dark:text-slate-100 tracking-tight leading-snug">
            {ad.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {ad.subtitle}
          </p>
          <div className="mt-3 flex gap-2">
            <span className="inline-block text-2xs uppercase tracking-wide font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded border border-indigo-100 dark:border-indigo-900/30">
              Sponsored
            </span>
            <button className="text-2xs uppercase tracking-wider font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 px-3 py-1 rounded shadow-xs cursor-pointer transition-colors">
              {ad.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
