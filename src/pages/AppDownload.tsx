import React from 'react';
import { Download, Smartphone, ShieldAlert, History, Key, CheckCircle, RefreshCcw, BookOpen, Clock, FileText } from 'lucide-react';

interface AppDownloadProps {
  apkVersion: string;
  apkSize: string;
  apkUrl: string;
}

export default function AppDownload({ apkVersion, apkSize, apkUrl }: AppDownloadProps) {
  
  const features = [
    {
      icon: <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Offline Study Vaults",
      desc: "Save notes, PDFs, syllabus templates, and formula booklets directly inside the application namespace for learning without active internet packages."
    },
    {
      icon: <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Daily Mock Challengers",
      desc: "Take timed, multiple-choice quizzes categorized by subjects and classes. Monitor results and retry options cleanly."
    },
    {
      icon: <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Direct Notice Broadcasts",
      desc: "Receive real-time mobile push notes regarding batch timing adjustments, scholarship tests (ND-SAT), and exam deadlines."
    }
  ];

  const installations = [
    {
      step: "01",
      title: "Download the APK package",
      desc: "Click the secure download button below to load the raw '.apk' binary package directly onto your Android device."
    },
    {
      step: "02",
      title: "Enable unknown source installations",
      desc: "Navigate to Settings → Security (or Apps) on your android phone, and enable 'Install Unkown Apps' permissions for your chosen browser (Chrome/Edge)."
    },
    {
      step: "03",
      title: "Complete Setup",
      desc: "Explore your device's Downloads directory, click on the loaded file, and tap 'Install'. The application is ready to run offline instantly—no signups required!"
    }
  ];

  const logs = [
    { version: 'v2.1', date: 'June 2026', notes: 'Optimized PDF rendering module, added offline diagnostic capability, and implemented state-based class notices synchronization.' },
    { version: 'v2.0', date: 'April 2026', notes: 'Complete rewrite of Timed MCQ engine, integrated performance tracking charts, and optimized overall cache storage.' },
    { version: 'v1.1', date: 'January 2026', notes: 'Initial public APK release with modular notice board synchronization and manual search indices.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-4">
      
      {/* Hero Banner Grid */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white p-8 md:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Details */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-blue-400 text-3xs font-mono font-bold tracking-widest uppercase">
              ✨ Official Mobile Client
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white leading-tight">
              Study Anywhere with <br />
              <span className="text-blue-500">The New Direction App</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-sans max-w-lg">
              Take complete control of your exam prep. Practice mock tests offline, scan announcements, and download revision sheets on the move—exclusively designed for Android. No login details, password setups, or ads. Take learning offline.
            </p>

            <div className="p-4 bg-slate-950/45 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="space-y-1 text-center sm:text-left">
                <span className="block text-2xs font-mono text-slate-500 uppercase font-bold">Stable Release Binaries</span>
                <span className="text-sm text-slate-300 font-sans">
                  Version: <strong>v{apkVersion}</strong> | Package: <strong>{apkSize}</strong>
                </span>
              </div>
              <a 
                href={apkUrl}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 cursor-pointer transition-all hover:-translate-y-0.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Latest APK</span>
              </a>
            </div>

            <p className="text-3xs font-mono text-slate-500 max-w-sm flex gap-1.5 items-start">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>VirusTested & Digitally Signed. Safe to load onto Samsung, Xiaomi, OnePlus, and other devices.</span>
            </p>
          </div>

          {/* Graphics illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[280px]">
              
              {/* Outer floating reviews widget */}
              <div className="absolute -top-4 -left-6 bg-white dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-indigo-50 dark:border-slate-900 shadow-md flex items-center gap-2 z-10">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center text-xs font-bold font-mono">
                  4.9
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Play Store Rank</span>
                  <span className="text-[9px] text-slate-500 font-sans">1200+ Verified Reviews</span>
                </div>
              </div>

              {/* Simulated Phone Layout */}
              <div className="w-full bg-slate-950 rounded-[40px] p-4.5 border-4 border-slate-800 shadow-2xl relative overflow-hidden aspect-[9/18]">
                <div className="absolute top-1 lg:top-2 left-1/2 transform -translate-x-1/2 w-28 h-5.5 bg-slate-800 rounded-full z-10"></div>
                
                {/* Simulated Screen */}
                <div className="w-full h-full bg-slate-900 rounded-[30px] p-3 flex flex-col justify-between text-left space-y-4">
                  
                  {/* Mock top bar */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-3 px-1">
                    <span>New Direction</span>
                    <span>9:41 AM</span>
                  </div>

                  {/* Mock UI list */}
                  <div className="flex-1 space-y-3.5 pt-4">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-805 space-y-1.5">
                      <div className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center text-xs font-bold">N</div>
                      <span className="block text-[11px] font-bold text-white leading-tight">Chemistry Chapter 2 Quiz Prep</span>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 w-3/4 h-full"></div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-sans">Active Score: 15/20 Correct</span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-805 space-y-2">
                      <span className="text-[9px] text-indigo-400 uppercase font-mono font-bold tracking-wider">Latest notice alert</span>
                      <p className="text-[10px] text-slate-300 leading-normal line-clamp-2">
                        Weekly NEET Bio Mock timing has been shifted to Sunday, 10:00 AM. Access PDF instructions inside.
                      </p>
                    </div>

                    <div className="p-3 border border-dashed border-slate-800 rounded-lg flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">Offline Downloads:</span>
                      <span className="text-[9px] bg-emerald-900/30 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold">3 Files local</span>
                    </div>
                  </div>

                  {/* Footer home indicator */}
                  <div className="w-16 h-1 bg-slate-800 mx-auto rounded-full mt-2 shrink-0"></div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* App Key features */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-3xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
            LEARNING MATRIX
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How our Application accelerates your scores
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
            Our study companion APK connects with our Patna database, so notices and revision resources stay synchronized instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {features.map((feat, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mb-5 shrink-0">
                {feat.icon}
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{feat.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-sans">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Manual Installation guidelines */}
      <section className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-200/65 dark:border-slate-905 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-3xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
              SETUP PROCESS
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              Complete installation & activation blueprint
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              As our application is delivered directly to our students as a specialized standalone package, you will install it manually. It is quick, safe, and takes less than 60 seconds!
            </p>
            
            <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-3xs font-mono text-slate-550 flex gap-2">
              <Key className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <span>We never ask for root permissions, phone calls tracking, or contacts access. Your privacy stays secure in our sandbox environment.</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {installations.map((inst, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 shadow-3xs items-start">
                <span className="text-2xl font-black text-blue-550 font-mono leading-none shrink-0 pt-0.5">
                  {inst.step}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {inst.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal font-sans">
                    {inst.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Dynamic Releases logs */}
      <section className="space-y-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-900 pb-3 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-500" />
          <span>App Version Release History & Notes</span>
        </h3>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-900">
          {logs.map((log, i) => (
            <div key={i} className="py-4 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex gap-3 items-center">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-sm font-mono text-xs font-bold">
                  {log.version}
                </span>
                <span className="text-2xs font-mono text-slate-400 font-medium">
                  Released: {log.date}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300 font-sans max-w-3xl leading-relaxed">
                {log.notes}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
