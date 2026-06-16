import React, { useEffect, useState } from 'react';
import { Compass, Eye, Users, CheckSquare, Heart } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import { FacultyMember } from '../types';

const DEFAULT_FACULTY: FacultyMember[] = [
  {
    id: "ravi-ranjan",
    name: "Dr. Ravi Ranjan",
    role: "Director & Organic Chemistry Lead",
    spec: "Ph.D. Chemistry (12+ Years Coaching Experience)",
    desc: "Architect of the New Direction coaching strategy. Ravi has helped train over 1400+ candidates secure top chemical engineering and government NEET positions.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
    subjectTag: "Chemistry doubt lead"
  },
  {
    id: "sk-singh",
    name: "Dr. S. K. Singh",
    role: "Biology Masterclasses Head",
    spec: "MBBS (8+ Years Anatomy & Botany Lead)",
    desc: "Specialized in mapping high-yield NEET botany classifications. Dr. Singh focuses heavily on structural worksheets and easy calculation techniques.",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400",
    subjectTag: "Biology doubt lead"
  },
  {
    id: "rohit-verma",
    name: "Prof. Rohit Verma",
    role: "IIT Advanced Mathematics Lead",
    spec: "M.Tech IIT Kanpur (10+ Years Calculus Specialist)",
    desc: "Recognized for devising short-check algebra systems. Rohit’s weekly test graphs help identify weak mathematical formulas instantly.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    subjectTag: "Mathematics doubt lead"
  },
  {
    id: "alok-sen",
    name: "Prof. Alok Sen",
    role: "Physics Mechanics Specialist",
    spec: "B.Tech IIT Kharagpur (9+ Years Theoretical Physics Master)",
    desc: "Dedicated to building physical models behind electromagnetism. Alok coordinates custom mock exam papers inside Patna centers.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    subjectTag: "Physics doubt lead"
  }
];

export default function About() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'faculty'));
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list: FacultyMember[] = [];
        snap.forEach(doc => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || '',
            role: data.role || '',
            spec: data.spec || '',
            desc: data.desc || '',
            imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
            subjectTag: data.subjectTag || data.role.split(' & ')[0] || 'Coaching Expert'
          });
        });
        setFaculty(list);
      } else {
        setFaculty(DEFAULT_FACULTY);
      }
    }, (err) => {
      console.error("Failed to load faculty from Firestore:", err);
      setFaculty(DEFAULT_FACULTY);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-12">
      
      {/* Intro Banner */}
      <section className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 md:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl space-y-5">
          <span className="text-3xs fabrics font-mono tracking-widest text-blue-400 font-bold bg-slate-850 px-3 py-1 rounded-full uppercase">
            WHO WE ARE
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white leading-tight">
            Setting the Right Direction for Patna's Aspirants
          </h2>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed font-sans mt-3">
            Founded in Patna, Bihar, in 2018, <strong>New Direction Coaching Center</strong> was established to address the critical gap in personalized accountability. We believe student success comes from combining expert physical lectures with dynamic offline study tools.
          </p>
        </div>
      </section>

      {/* Mission & Vision panels */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        <div id="mission-card" className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-150 dark:border-slate-900 shadow-3xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white tracking-tight">Our Core Mission</h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
            To provide high-quality competitive syllabus training that bypasses high pricing gates. We are dedicated to ensuring that every student in Bihar, regardless of economic backgrounds, has direct access to solved NEET papers, formulas cheatbooks, and physical coaching centers.
          </p>
        </div>

        <div id="vision-card" className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-150 dark:border-slate-900 shadow-3xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white tracking-tight">Our Vision Map</h3>
          <p className="text-xs md:text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-sans">
            We envision a modernized, zero-distraction student ecosystem. By leveraging our offline centers alongside our stable companion Android application, our vision is to train the next generation of physicians, researchers, and scientific innovators.
          </p>
        </div>

      </section>

      {/* Faculty grid */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-3xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
            FACULTY MATRIX
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Learn from Certified IIT / NEET Mentors
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            Meet the primary guides responsible for compiling chapters checklists, managing doubt cells, and maintaining topper results year after year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {faculty.map((member, idx) => (
            <div 
              key={member.id || idx} 
              id={`faculty-card-${member.id || idx}`}
              className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-900 overflow-hidden shadow-2xs hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent flex items-end p-4">
                    <div>
                      <span className="block text-2xs uppercase font-mono text-blue-400 font-semibold tracking-wider">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {member.name}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400">
                    {member.spec}
                  </p>
                  <p className="text-3xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans pt-1.5 line-clamp-4">
                    {member.desc}
                  </p>
                </div>
              </div>

              {/* Action query tag */}
              {member.subjectTag && (
                <div className="p-4 pt-0">
                  <div className="w-full bg-slate-50 dark:bg-slate-900 py-1.5 text-center rounded text-[10px] font-mono text-slate-550 font-medium tracking-tight border dark:border-slate-800">
                    {member.subjectTag}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </section>

      {/* Facilities checklist section */}
      <section className="bg-slate-50 dark:bg-slate-900/40 p-6 md:p-10 rounded-2xl border border-slate-200/50 dark:border-slate-900/60 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">30-Student Batch Cap</h4>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 leading-normal font-sans">
              No crowded halls. Small density limits ensure your doubts are cleared individually in every chemistry and physics equation lecture.
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">CCTV Secured Classrooms</h4>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 leading-normal font-sans">
              Your security is paramount. Fully air-conditioned centers, power backups, drinking water plants, and security mapping.
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Free Offline App Keys</h4>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 leading-normal font-sans">
              All notes, PDF blueprints, batch notices, previous papers, and formula guides are mirrored on our Android offline app client.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
