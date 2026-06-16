import React, { useEffect, useState } from 'react';
import { Award, Clock, CreditCard, Sparkles, Milestone } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { AVAILABLE_COURSES } from '../components/AdmissionModal';

interface CoursesProps {
  onOpenAdmission: (courseId?: string) => void;
}

interface DbCourse {
  id: string;
  name: string;
  target: string;
  fee: string;
  subjects: string[];
  syllabus: string;
  notes: string;
}

const BATCH_DETAILS_EXT = {
  'foundation-junior': {
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Mental Ability'],
    syllabus: 'CBSE / ICSE School Curriculum + NTSE early foundation preparation maps.',
    notes: 'Weekly printed worksheets, online mock challenges in app, monthly parent consultation.'
  },
  'boards-science': {
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English Core'],
    syllabus: 'State Board (BSEB) & Central Board (CBSE) syllabus alignment.',
    notes: 'Specialized focus on solving board model test question booklets with manual feedback.'
  },
  'boards-commerce': {
    subjects: ['Accountancy', 'Economics', 'Business Studies', 'Entrepreneurship'],
    syllabus: 'High-focus preparation for class XII board sheets & CA-Foundation pre-alignment.',
    notes: 'Special doubt clearing hours for solving ledger equations and numerical balance sheets.'
  },
  'neet-prep': {
    subjects: ['Physics (Mechanics + Electrodynamics)', 'Chemistry (Organic/Inorganic)', 'Biology (Botany + Zoology)'],
    syllabus: 'NEET Target level MCQ solving speed exercises.',
    notes: 'Daily practice sheets (DPPs), state-rank scoring maps, 15 complete mock paper series.'
  },
  'jee-ultimate': {
    subjects: ['Advanced Mathematics', 'Analytical Chemistry', 'Theoretical Physics'],
    syllabus: 'JEE Mains & Advanced comprehensive conceptual shortcuts.',
    notes: 'Access to physics simulation tools, IIT alumni doubt sessions, 20 complete mock tests.'
  },
  'competitive-maths': {
    subjects: ['Quantitative Arithmetic', 'Logical Reasoning', 'Data Interpretation'],
    syllabus: 'Government competitive pre-exams (SSC, Bank, State exams aptitude foundation).',
    notes: 'Speed calculation shortcuts, formula memory guides, offline app test access included.'
  }
};

// Combine hardcoded defaults to map initial local items 
const DEFAULT_COURSES: DbCourse[] = AVAILABLE_COURSES.map(course => {
  const ext = BATCH_DETAILS_EXT[course.id as keyof typeof BATCH_DETAILS_EXT] || {
    subjects: [],
    syllabus: 'Comprehensive NCERT syllabus coordination.',
    notes: 'Faculty guidance, standard PDFs, mock test paper worksheets.'
  };
  return {
    id: course.id,
    name: course.name,
    target: course.target,
    fee: course.fee,
    subjects: ext.subjects,
    syllabus: ext.syllabus,
    notes: ext.notes
  };
});

export default function Courses({ onOpenAdmission }: CoursesProps) {
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'courses'));
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list: DbCourse[] = [];
        snap.forEach(doc => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || '',
            target: data.target || '',
            fee: data.fee || '',
            subjects: Array.isArray(data.subjects) ? data.subjects : typeof data.subjects === 'string' ? (data.subjects as string).split(',').map(s => s.trim()) : [],
            syllabus: data.syllabus || '',
            notes: data.notes || ''
          });
        });
        setCourses(list);
      } else {
        setCourses(DEFAULT_COURSES);
      }
      setLoading(false);
    }, (err) => {
      console.error("Failed to load courses from Firestore:", err);
      setCourses(DEFAULT_COURSES);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-4">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-3xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full uppercase">
          ACADEMIC CATALOG
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
          Structured Coaching Batches & Fees
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-sans max-w-xl mx-auto leading-relaxed">
          Start moving in the right direction. Explore our scientific stream, commerce tracks, and highly specialized JEE/NEET medical and engineering pathways below. No registration account required to browse.
        </p>
      </div>

      {/* Courses Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {courses.map((course) => {
          return (
            <div 
              key={course.id} 
              id={`course-card-${course.id}`}
              className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-900 p-6 md:p-8 flex flex-col justify-between hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <div className="space-y-5">
                {/* Header title */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/10 rounded-lg text-3xs font-mono font-bold uppercase tracking-wider">
                      {course.target}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold font-sans text-slate-900 dark:text-white mt-1.5 tracking-tight leading-snug">
                      {course.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-sm font-black text-blue-600 dark:text-blue-400 font-mono">
                      {course.fee}
                    </span>
                    <span className="text-3xs text-slate-400 dark:text-slate-500 font-medium">
                      Fee structure
                    </span>
                  </div>
                </div>

                {/* Subjects tags list */}
                {course.subjects && course.subjects.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="block text-3xs font-mono font-bold uppercase tracking-widest text-slate-400">
                      Subjects Covered
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.subjects.map((sub, i) => (
                        <span 
                          key={i} 
                          className="text-3xs font-sans font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded"
                        >
                          ✓ {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Curriculum Description details */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-900 pt-4 text-xs font-sans text-slate-550 space-y-2">
                  <p className="leading-relaxed">
                    <strong>Curriculum Scope:</strong> {course.syllabus}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong>Batch deliverables:</strong> {course.notes}
                  </p>
                </div>
              </div>

              {/* Admission Launch Button */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-4">
                <span className="text-3xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Interactive batches twice daily</span>
                </span>
                
                <button
                  id={`course-btn-${course.id}`}
                  onClick={() => onOpenAdmission(course.id)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow-md hover:shadow-blue-500/10 cursor-pointer transition-all flex items-center gap-1 shrink-0"
                >
                  <span>Request Seat Admission</span>
                  <Award className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Fee Regulations / FAQ Panels */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900/60 p-6 md:p-10 rounded-2xl space-y-6">
        <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-500" />
          <span>Transparent Fee Regulations & Benefits</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans leading-relaxed text-slate-550">
          <div className="space-y-4">
            <div className="space-y-1">
              <h5 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Milestone className="w-4 h-4 text-emerald-500" /> Are there any hidden service costs?
              </h5>
              <p className="text-slate-500 dark:text-slate-400">
                No. All printed chapter-wise study materials, revision mock sheets, and offline Android Mobile App access are fully integrated inside the listed tuition fee module.
              </p>
            </div>
            
            <div className="space-y-1">
              <h5 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Milestone className="w-4 h-4 text-emerald-500" /> Do we offer scholarship waivers?
              </h5>
              <p className="text-slate-500 dark:text-slate-400">
                Yes! We host our New Direction Scholarship Admission Test (ND-SAT) periodically. Outstanding candidates can grab up to 100% waiver on total one-time fees. Check our notice board or main blog regularly for ND-SAT schedules.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h5 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Milestone className="w-4 h-4 text-emerald-500" /> Is double installment payment supported?
              </h5>
              <p className="text-slate-500 dark:text-slate-400">
                For target preparation batches (NEET Ultimate and JEE Comprehensive), parents can request paying the fee in two equal monthly chunks of 50%. Mention this in the admission application, and our coordinator will approve it.
              </p>
            </div>

            <div className="space-y-1 bg-white dark:bg-slate-950 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <span className="text-3xs uppercase font-mono font-black text-blue-600 dark:text-blue-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Direct Batches Guarantee
              </span>
              <p className="text-3xs mt-1 text-slate-500 leading-relaxed font-sans">
                New Direction is recognized by teachers networks in Patna for delivering small batch density (maximum 30 pupils per class) to maintain absolute personalized attention. Securing raw scores has never been this tailored.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
