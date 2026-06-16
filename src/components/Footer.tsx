import React from 'react';
import { Mail, Phone, MapPin, Sparkles, MessageCircle, ArrowUpRight, GraduationCap } from 'lucide-react';
import AdvertSpace from './AdvertSpace';

interface FooterProps {
  onPageChange: (page: string) => void;
  onOpenAdmission: () => void;
  whatsappUrl: string;
  enableAds?: boolean;
}

export default function Footer({ onPageChange, onOpenAdmission, whatsappUrl, enableAds }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 mt-12 transition-colors">
      
      {/* Monetization Placeholder Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <AdvertSpace position="footer" showAds={enableAds} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Coaching Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              N
            </div>
            <div>
              <span className="font-sans font-bold text-white tracking-tight flex items-center gap-1.5">
                New Direction
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </span>
              <p className="text-[9px] font-mono tracking-widest text-blue-400 font-bold uppercase">
                Est. Patna, Bihar
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
            Providing top-quality customized syllabus prep, NEET/JEE test hacks, expert doubt clearing sessions, board-centric masterclasses, and comprehensive PDFs since 2018. Elevate your potential to the next level.
          </p>
          <div className="flex gap-2.5 pt-2">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full bg-emerald-950/55 hover:bg-emerald-900 text-emerald-400 flex items-center justify-center transition-colors"
              title="Join our WhatsApp community"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a 
              href="mailto:contact@newdirectionpatna.com" 
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-100 flex items-center justify-center transition-colors"
              title="Mail Admissions"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div>
          <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-200 mb-4 border-l-2 border-blue-600 pl-2">
            Explore Institute
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onPageChange('home')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-blue-500" /> Home Portal
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange('courses')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-blue-500" /> Batches & Fee Structure
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange('resources')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 flex-1">
                <ArrowUpRight className="w-3 h-3 text-blue-500" /> Free PDFs & Mock Papers
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange('blog')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-blue-500" /> SEO Study Tips Blog
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange('notices')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-blue-500" /> Live Notice Board
              </button>
            </li>
            <li>
              <button onClick={onOpenAdmission} className="text-blue-400 hover:text-blue-300 font-bold tracking-tight text-xs flex items-center gap-1 cursor-pointer">
                🎓 Apply Admission Form
              </button>
            </li>
          </ul>
        </div>

        {/* Reach Us Coordinates */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-200 mb-2 border-l-2 border-blue-600 pl-2">
            Reach Out Directly
          </h4>
          <div className="flex items-start gap-2.5 text-xs">
            <Phone className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <span className="block font-semibold text-slate-300">Admission Hotline</span>
              <a href="tel:+919999999999" className="hover:text-white transition-colors">+91 99999 99999</a>
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-xs">
            <Mail className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <span className="block font-semibold text-slate-300">Admissions Email</span>
              <a href="mailto:admissions@newdirectioncoaching.com" className="hover:text-white transition-colors">info@newdirection.com</a>
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <span className="block font-semibold text-slate-300">Patna Center (HQ)</span>
              <span className="text-slate-400 leading-relaxed block">
                2nd Floor, Sai Complex, Opposite Rajendra Nagar Terminal, Kankarbagh Main Rd, Patna, Bihar 800020
              </span>
            </div>
          </div>
        </div>

        {/* Interactive map location iframe */}
        <div className="h-full rounded-xl overflow-hidden border border-slate-800 h-[200px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14392.213271780447!2d85.1537237!3d25.6030999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58f278d91ea1%3A0xd68b209e735492d!2sRajendra%20Nagar%20Terminal%20Railway%20Station!5e0!3m2!1sen!2sin!4v1718501234321!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="New Direction Location Map"
          ></iframe>
        </div>

      </div>

      <div className="bg-slate-950 text-slate-500 text-2xs md:text-xs py-5 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {currentYear} New Direction Coaching Center. All rights reserved. Developed with Firebase Firestore and cloud deployment.</p>
          <div className="flex gap-4.5 font-mono text-3xs uppercase tracking-wide">
            <button onClick={() => onPageChange('about')} className="hover:text-slate-300">Faculty Panel</button>
            <span>•</span>
            <button onClick={() => onPageChange('admin')} className="hover:text-slate-300 font-bold text-slate-400">Admin Login</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
