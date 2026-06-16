import React, { useEffect, useState } from 'react';
import { Download, MessageCircle, ArrowRight, ShieldCheck, Award, Users, BookOpen, Volume2, Star, CheckSquare, Sparkles, Send, Loader2 } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Notice, Testimonial } from '../types';
import AdvertSpace from '../components/AdvertSpace';

interface HomeProps {
  onPageChange: (page: string) => void;
  onOpenAdmission: () => void;
  apkVersion: string;
  apkSize: string;
  apkUrl: string;
  whatsappUrl: string;
  enableAds?: boolean;
}

const REVIEWS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Aman Kumar',
    role: 'JEE Advanced Air 1420',
    text: 'New Direction completely restructured my preparation strategy. The direct doubt clearing modules and specialized math short-check tricks helped me boost my test marks tremendously. The official Android App was my absolute favorite study vault!',
    rating: 5,
    achievement: 'IIT Kharagpur CSE'
  },
  {
    id: 't-2',
    name: 'Priya Kumari',
    role: 'NEET Score: 685/720',
    text: 'Biology papers can get challenging, but under the faculty’s precise direction and topic mock tests, I scored 345 in bio alone. The chapter PDFs, previous year mock keys, and support notes are highly recommended to all aspirants from day one.',
    rating: 5,
    achievement: 'PMCH Patna'
  },
  {
    id: 't-3',
    name: 'Rohit Raj',
    role: 'Class 12th Board: 96.4%',
    text: 'I joined New Direction in class 11th. The continuous notices, weekly ranking maps, parent meetings, and regular test performance graphs helped me stay fully accountable. The app APK download allowed me to test myself offline too.',
    rating: 5,
    achievement: 'CBSE State Topper'
  }
];

export default function Home({
  onPageChange,
  onOpenAdmission,
  apkVersion,
  apkSize,
  apkUrl,
  whatsappUrl,
  enableAds
}: HomeProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [msgSaved, setMsgSaved] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(4));
    
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
    }, (err) => {
      console.error("onSnapshot failed for notices:", err);
      setNotices([]);
      handleFirestoreError(err, OperationType.LIST, 'notices');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'));
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const loaded: Testimonial[] = [];
        snap.forEach(doc => {
          const data = doc.data();
          loaded.push({
            id: doc.id,
            name: data.name || '',
            role: data.role || '',
            text: data.text || '',
            rating: typeof data.rating === 'number' ? data.rating : 5,
            achievement: data.achievement || ''
          } as Testimonial);
        });
        setTestimonials(loaded);
      } else {
        setTestimonials(REVIEWS);
      }
    }, (err) => {
      console.warn("Using local reviews fallback:", err);
      setTestimonials(REVIEWS);
    });

    return () => unsubscribe();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactMsg) {
      setErrMsg('Name and Message body are required.');
      return;
    }
    setErrMsg('');
    setBtnLoading(true);

    try {
      await addDoc(collection(db, 'messages'), {
        name: contactName.trim(),
        email: contactEmail.trim() || 'not_provided@gmail.com',
        phone: 'Not provided',
        subject: 'General website query',
        message: contactMsg.trim(),
        status: 'unread',
        createdAt: serverTimestamp()
      });
      setMsgSaved(true);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setBtnLoading(false);
    } catch (err) {
      setBtnLoading(false);
      setErrMsg('Firestore connection offline. Submit failed, but you can click on WhatsApp to connect instantly.');
      handleFirestoreError(err, OperationType.CREATE, 'messages');
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Header Ad Slot (728x90) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 shadow-xs">
        <AdvertSpace position="header" showAds={enableAds} />
      </div>

      {/* Main Column Flex Layout matching "Sleek Interface" spacing & organization */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Core Page Contents */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Theme Hero Banner Card Block */}
          <section className="bg-blue-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden min-h-[300px] shrink-0 border border-blue-950">
            <div className="relative z-10 max-w-xl space-y-4">
              <span className="bg-blue-500/30 text-blue-200 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest inline-block select-none">
                Admissions Open 2026-27
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
                Navigate Your Path to <br />
                <span className="text-blue-400">Academic Excellence.</span>
              </h2>
              <p className="text-blue-105/95 text-xs md:text-sm leading-relaxed">
                Premium masterclass coaching for Board Preparation & Competitive Pathways in Patna. Access expert offline teachers, high-yield structured study materials, notices, and test hacks directly.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => onPageChange('download')}
                  className="bg-white hover:bg-slate-100 text-blue-900 px-5.5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-102"
                >
                  <Download className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>Download APK v{apkVersion}</span>
                </button>
                <button 
                  onClick={() => onPageChange('courses')}
                  className="border border-blue-400/50 text-blue-100 px-5.5 py-3 rounded-xl font-bold text-xs hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  View Tuition Courses
                </button>
              </div>
            </div>

            {/* Decorative abstract bubbles mimicking theme exactly */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-750/50 rounded-full blur-3xl opacity-80 pointer-events-none"></div>
            <div className="absolute right-12 bottom-0 w-44 h-56 bg-white/5 rounded-t-3xl border-t border-x border-white/10 hidden md:flex items-center justify-center p-4">
              <div className="text-white/25 text-3xs font-mono rotate-12 text-center leading-relaxed">
                🤖 Android App companion live<br/>
                Size: <strong>{apkSize}</strong>
              </div>
            </div>
          </section>

          {/* Secondary Grid Column system: Classes, Exam Tips, Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pop classes Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-widest mb-3.5 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Popular Classes</span>
                </h3>
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-55/60 dark:bg-slate-950/40 rounded-lg flex justify-between items-center text-3xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Class 10 Foundation</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">₹4,999</span>
                  </div>
                  <div className="p-2.5 bg-slate-55/60 dark:bg-slate-950/40 rounded-lg flex justify-between items-center text-3xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Class 12 PCM Elite</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">₹6,999</span>
                  </div>
                  <div className="p-2.5 bg-slate-55/60 dark:bg-slate-950/40 rounded-lg flex justify-between items-center text-3xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">IIT-JEE Prep Crash</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">₹8,500</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onPageChange('courses')}
                className="mt-4 text-blue-650 dark:text-blue-400 text-xs font-bold pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between cursor-pointer group"
              >
                <span>View Fee Structure</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* Exam tips search preview */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-widest mb-3.5">Exam Prep Tips</h3>
                <div className="relative rounded-lg overflow-hidden h-20 bg-slate-200 dark:bg-slate-800 mb-2 border border-slate-100 dark:border-slate-850">
                  <img 
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300&fit=crop" 
                    alt="Study tips logo preview" 
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                  <span className="absolute bottom-1.5 left-2 text-[9px] text-white font-mono uppercase tracking-wide">Board Exams 2026</span>
                </div>
                <p className="text-3xs text-slate-600 dark:text-slate-350 font-medium leading-normal line-clamp-2">
                  Learn the top 5 high-yield score hacks in Chemistry and Physics recommended by Patna's finest mentors.
                </p>
              </div>
              <button 
                onClick={() => onPageChange('blog')}
                className="mt-3.5 text-xs font-bold text-blue-650 dark:text-blue-400 hover:underline cursor-pointer border-t border-slate-100 dark:border-slate-800/60 pt-2.5 text-left"
              >
                Read academic blog
              </button>
            </div>

            {/* Free resources */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-widest mb-3.5">Study Materials</h3>
                <ul className="text-[11px] space-y-2">
                  <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-350">
                    <span className="px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[9px] font-bold rounded">PDF</span>
                    <span className="truncate text-3xs font-medium">NCERT Solutions Class 12</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-350">
                    <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400 text-[9px] font-bold rounded">DOC</span>
                    <span className="truncate text-3xs font-medium">NEET Bio Topic Revision</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-350">
                    <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-955/40 text-emerald-600 dark:text-emerald-450 text-[9px] font-bold rounded">XLS</span>
                    <span className="truncate text-3xs font-medium">JEE Formula Master sheets</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onPageChange('resources')}
                className="mt-4 w-full py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-3xs font-extrabold rounded-lg transition-colors cursor-pointer"
              >
                Download Free Notes
              </button>
            </div>

          </div>

          {/* Educational Roadmap Column (Who we are) */}
          <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/85 space-y-5">
            <div className="space-y-1">
              <span className="text-3xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                COACHING PROTOCOLS
              </span>
              <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">
                Our Conceptual Roadmap
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed font-sans">
                We believe in personalized academic mentorship over massive generic classroom batches. Here are our core operational guidelines:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
              <div className="p-4 bg-slate-55/60 dark:bg-slate-950/30 rounded-xl border border-slate-150 dark:border-slate-800/60 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-blue-105/10 dark:bg-blue-955/35 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
                  01
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Expert Faculty</h4>
                <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
                  Continuous guidance under teachers with over 8+ years of Patna-level credentials.
                </p>
              </div>

              <div className="p-4 bg-slate-55/60 dark:bg-slate-950/30 rounded-xl border border-slate-155 dark:border-slate-800/60 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-100/45 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                  02
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">High-yield Materials</h4>
                <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
                  Structured chapter test notes, formulas, and mock packages in-app.
                </p>
              </div>

              <div className="p-4 bg-slate-55/60 dark:bg-slate-950/30 rounded-xl border border-slate-155 dark:border-slate-800/60 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-100/45 dark:bg-indigo-950/35 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                  03
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Weekly challenges</h4>
                <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
                  Practice offline paper mockups paired with instant ranking alerts.
                </p>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-blue-600 dark:text-blue-400 uppercase block font-bold">
                PATNA CENTER TOPPERS
              </span>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white border-l-2 border-blue-600 pl-2">
                Success Chronicles
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((rev) => (
                <div 
                  key={rev.id} 
                  id={`testimonial-card-${rev.id}`}
                  className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-820 flex flex-col justify-between shadow-3xs"
                >
                  <div className="space-y-2">
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current text-amber-500" />
                      ))}
                    </div>
                    <p className="text-3xs text-slate-550 dark:text-slate-400 italic leading-relaxed">
                      "{rev.text}"
                    </p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-950 dark:text-white font-mono tracking-wide uppercase truncate max-w-[80px]">
                        {rev.name}
                      </h4>
                      <p className="text-[8px] text-blue-600 dark:text-blue-400 leading-none">
                        {rev.role}
                      </p>
                    </div>
                    {rev.achievement && (
                      <span className="px-1.5 py-0.5 bg-blue-50/60 dark:bg-blue-955/35 text-blue-600 dark:text-blue-420 border border-blue-105/30 rounded text-[9px] font-mono font-bold max-w-[80px] truncate">
                        {rev.achievement}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Core Batch CTA Block */}
          <section className="rounded-3xl bg-linear-to-r from-blue-900 to-indigo-950 p-6 md:p-8 text-white relative overflow-hidden border border-blue-950 shadow-md">
            <div className="space-y-4 relative z-10">
              <h3 className="text-lg md:text-xl font-black">
                Register Offline Lectures Today
              </h3>
              <p className="text-blue-105/95 text-3xs md:text-xs leading-relaxed max-w-lg">
                Choose Class 8th-12th batches or targeted NEET/JEE modules. Access Patna's premium study environment with our secure offline companion application. No account verification needed. Admissions are live!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button 
                  onClick={onOpenAdmission}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-blue-900 text-xs font-bold rounded-xl shadow-xs cursor-pointer select-none transition-all font-mono uppercase tracking-tight"
                >
                  Apply Online Admission
                </button>
                <button 
                  onClick={() => onPageChange('courses')}
                  className="px-5 py-2.5 bg-blue-800 hover:bg-blue-750 text-blue-100 border border-blue-700/60 text-xs font-bold rounded-xl cursor-pointer transition-all font-mono uppercase tracking-tight"
                >
                  Browse Fee Structure
                </button>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>
          </section>

          {/* Quick contact Query builder */}
          <section className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="space-y-1">
              <span className="text-3xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase block pl-0.5">
                COUNSELOR DESK
              </span>
              <h3 className="text-base font-bold text-slate-950 dark:text-white pl-0.5 select-none">
                Send Admission Query
              </h3>
              <p className="text-3xs text-slate-500 dark:text-slate-400 pl-0.5 leading-relaxed">
                Need details regarding physical batch dates, study guidelines, or free materials? Log your inquiry below. Our team responds in 24 hours.
              </p>
            </div>

            {msgSaved ? (
              <div className="py-6 text-center flex flex-col items-center justify-center">
                <CheckSquare className="w-10 h-10 text-emerald-500 mb-3" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Query Logged Successfully!</h4>
                <p className="text-3xs text-slate-500 dark:text-slate-450 mt-1 max-w-xs leading-relaxed">
                  Thank you! Your helpdesk query is recorded in our Firestore database.
                </p>
                <button 
                  onClick={() => setMsgSaved(false)}
                  className="mt-4 text-xs font-semibold text-blue-650 hover:underline cursor-pointer"
                >
                  Log another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3.5">
                {errMsg && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-3xs text-rose-600 rounded">
                    {errMsg}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-450 font-bold mb-1 pl-0.5">
                      your name *
                    </label>
                    <input 
                      type="text" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="E.g. Aman Lal" 
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-3xs focus:outline-hidden text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-450 font-bold mb-1 pl-0.5">
                      Email address
                    </label>
                    <input 
                      type="email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@gmail.com" 
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-3xs focus:outline-hidden text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-slate-450 font-bold mb-1 pl-0.5">
                    Write your query details *
                  </label>
                  <textarea 
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Tell our Patna helpdesk counselors about your target exam goals..." 
                    rows={3}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-3xs focus:outline-hidden text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                    required
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="text-[10px] text-slate-400 leading-tight">
                    📞 Helpline: +91 99999 99999
                  </div>
                  <button 
                    type="submit" 
                    disabled={btnLoading}
                    className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-750 text-white font-semibold rounded-lg text-3xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {btnLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Send Query</span>
                  </button>
                </div>
              </form>
            )}
          </section>

        </div>

        {/* Right Column: Sticky Sidebar containing Dynamic Notice Bulletins + Sidebar Ad */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          
          {/* Live Notices card block */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-3xs flex flex-col overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-950/85 border-b border-slate-150 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-widest flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-550 shrink-0" />
                Recent Notices
              </h3>
              <span className="px-1.5 py-0.5 bg-rose-50 dark:bg-rose-955/40 text-rose-600 dark:text-rose-400 rounded text-3xs font-black font-mono tracking-wider animate-pulse uppercase">
                Active
              </span>
            </div>

            <div className="p-5 space-y-4 max-h-[460px] overflow-y-auto">
              {notices.map((notice, idx) => {
                const borderColors = [
                  'border-red-500', 
                  'border-blue-500', 
                  'border-emerald-500', 
                  'border-indigo-500'
                ];
                const borderColor = borderColors[idx % borderColors.length];
                
                return (
                  <div 
                    key={notice.id} 
                    className={`border-l-2 ${borderColor} pl-3 py-1 space-y-1`}
                  >
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-550 flex items-center justify-between leading-none">
                      <span>{notice.createdAt?.toDate ? notice.createdAt.toDate().toLocaleDateString() : 'Active Notice'}</span>
                      <span className="capitalize text-xs text-blue-600 dark:text-blue-400 font-bold">{notice.category}</span>
                    </p>
                    <h4 className="text-xs font-bold text-slate-950 dark:text-white leading-snug">
                      {notice.title}
                    </h4>
                    <p className="text-3xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                );
              })}

              {notices.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-3xs font-mono">
                  No bulletins listed yet.
                </div>
              )}
            </div>

            <button 
              onClick={() => onPageChange('notices')}
              className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/50 dark:hover:bg-slate-950 text-center text-[10px] text-blue-600 dark:text-blue-400 font-bold border-t border-slate-150 dark:border-slate-800 uppercase tracking-widest cursor-pointer transition-colors"
            >
              View Notice Archives
            </button>
          </section>

          {/* AdSense Sidebar Slot (300x600) */}
          <div className="bg-slate-100 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-850 p-1">
            <AdvertSpace position="sidebar" showAds={enableAds} />
          </div>

        </div>

      </div>

      {/* AdSense In-Article Ad Space (Second placement footer) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <AdvertSpace position="in-article" showAds={enableAds} />
      </div>

    </div>
  );
}
