import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Loader2, Award, Phone } from 'lucide-react';
import { collection, addDoc, serverTimestamp, getDocs, onSnapshot, query } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourseId?: string;
}

export const AVAILABLE_COURSES = [
  { id: 'foundation-junior', name: 'Junior Foundation (Classes 8th to 10th Science & Math)', fee: '₹1,500/month', target: 'Class 8-10' },
  { id: 'boards-science', name: 'PCB/PCM Masterclass (Class 11th & 12th Board Exams)', fee: '₹2,500/month', target: 'Class 11-12' },
  { id: 'boards-commerce', name: 'Commerce Pathway (Accounts, Economics, Business Studies)', fee: '₹2,000/month', target: 'Class 11-12' },
  { id: 'neet-prep', name: 'NEET Achievers Target Batch (Physics, Chemistry, Biology)', fee: '₹35,000 One-time', target: 'NEET Aspirants' },
  { id: 'jee-ultimate', name: 'JEE Ultimate (Mains + Advanced Comprehensive Prep)', fee: '₹40,000 One-time', target: 'JEE Aspirants' },
  { id: 'competitive-maths', name: 'Quantitative Aptitude & Reasoning Foundation', fee: '₹1,200/month', target: 'Govt. Exams' }
];

export default function AdmissionModal({ isOpen, onClose, selectedCourseId = '' }: AdmissionModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState(selectedCourseId);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [dynamicCourses, setDynamicCourses] = useState<{ id: string; name: string; target: string; fee: string }[]>([]);

  // Update selection when selectedCourseId changes
  useEffect(() => {
    if (selectedCourseId) {
      setCourseId(selectedCourseId);
    }
  }, [selectedCourseId]);

  // Load active courses
  useEffect(() => {
    const q = query(collection(db, 'courses'));
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list: { id: string; name: string; target: string; fee: string }[] = [];
        snap.forEach(doc => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || '',
            target: data.target || '',
            fee: data.fee || ''
          });
        });
        setDynamicCourses(list);
      } else {
        setDynamicCourses(AVAILABLE_COURSES);
      }
    }, (err) => {
      console.warn("Using local courses inside admission select:", err);
      setDynamicCourses(AVAILABLE_COURSES);
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !courseId) {
      setErrorText('Please fill in all mandatory fields (Name, Phone number, and Course selection).');
      return;
    }

    setErrorText('');
    setLoading(true);

    try {
      const admissionData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        courseId,
        message: message.trim(),
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'admissions'), admissionData);
      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'admissions');
      } catch (composedErr: any) {
        setErrorText('Failed to submit application. Server is offline, or permissions are insufficient.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        id="admission-modal-body" 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Application Submitted!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-sm">
              Thank you for choosing <strong>New Direction Coaching Center</strong>. Our admissions team will contact you on your number or WhatsApp shortly to finalize your batch schedule!
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
              <a 
                href="https://wa.me/919999999999" 
                target="_blank" 
                referrerPolicy="no-referrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Contact on WhatsApp
              </a>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all cursor-pointer"
              >
                Close Portal
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Student Admission Form
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Join New Direction Offline/Online Batches
                </p>
              </div>
            </div>

            {errorText && (
              <div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 text-2xs md:text-xs text-rose-700 dark:text-rose-300 rounded">
                {errorText}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-2xs font-mono uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 font-semibold">
                  Name of Student *
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name" 
                  className="w-full px-4 py-2.5 bg-slate-55/40 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-mono uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 font-semibold">
                    Phone / WhatsApp *
                  </label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.g. +91 9876543210" 
                    className="w-full px-4 py-2.5 bg-slate-55/40 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-2xs font-mono uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 font-semibold">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com" 
                    className="w-full px-4 py-2.5 bg-slate-55/40 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-mono uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 font-semibold">
                  Select Target Admission Batch *
                </label>
                <select 
                  value={courseId} 
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-55/40 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-0 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  required
                >
                  <option value="" disabled>-- Click list to select batch --</option>
                  {dynamicCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      [{course.target}] {course.name} ~ {course.fee}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-2xs font-mono uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 font-semibold">
                  Any Special Queries, Target Score, or Previous Marks
                </label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details of your goals or classes" 
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-55/40 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors"
                ></textarea>
              </div>

              <div className="pt-2 text-2xs text-slate-400 dark:text-slate-500 leading-relaxed font-sans flex items-start gap-1">
                <span>ℹ️</span>
                <span>By submitting, you agree to receive follow-up guidance on WhatsApp, calls, or newsletters for your chosen batch coordinates. No account creation required.</span>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-3 text-slate-605 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      processing...
                    </>
                  ) : 'Submit Admission'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
