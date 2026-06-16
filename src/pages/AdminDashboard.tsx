import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, LogIn, LogOut, Loader2, Sparkles, Plus, Trash2, Edit2, CheckCircle, 
  Settings, Award, MessageSquare, Volume2, BookOpen, AlertTriangle, Cloud, Save, Check,
  Mail, Lock, FileText, Users, Star
} from 'lucide-react';
import { signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { 
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, getDoc, setDoc, query, orderBy, serverTimestamp, onSnapshot 
} from 'firebase/firestore';
import { auth, db, googleAuthProvider, handleFirestoreError, OperationType } from '../firebase';
import { Notice, BlogPost, AdmissionRequest, ContactMessage, AppConfig, BlogCategory, NoticeCategory, Testimonial, FreeResource, FacultyMember } from '../types';
import CloudinaryUploader from '../components/CloudinaryUploader';
import { CATEGORIES_LABELS } from './Blog';

interface AdminDashboardProps {
  onSettingsUpdate: (settings: AppConfig) => void;
  appSettings: AppConfig;
}

export default function AdminDashboard({ onSettingsUpdate, appSettings }: AdminDashboardProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState('');

  // Login inputs properties state
  const [emailInput, setEmailInput] = useState('mdwasimalam264@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'admissions' | 'notices' | 'blogs' | 'messages' | 'courses' | 'resources' | 'faculty' | 'testimonials' | 'settings'>('admissions');

  // Firestore Lists State
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  
  // Custom synced collections
  const [courses, setCourses] = useState<any[]>([]);
  const [resources, setResources] = useState<FreeResource[]>([]);
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [loadingList, setLoadingList] = useState(false);

  // Forms State
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  
  // Notice Form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<NoticeCategory>('general');
  const [noticePinned, setNoticePinned] = useState(false);

  // Blog Form
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogCategory, setBlogCategory] = useState<BlogCategory>('exam-prep');
  const [blogImage, setBlogImage] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');

  // Course Batch Form
  const [courseName, setCourseName] = useState('');
  const [courseTarget, setCourseTarget] = useState('');
  const [courseFee, setCourseFee] = useState('');
  const [courseSubjects, setCourseSubjects] = useState('');
  const [courseSyllabus, setCourseSyllabus] = useState('');
  const [courseNotes, setCourseNotes] = useState('');

  // Resources Study Material Form (FMC System)
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceCategory, setResourceCategory] = useState<'notes' | 'pdfs' | 'syllabus' | 'papers'>('notes');
  const [resourceTarget, setResourceTarget] = useState('');
  const [resourceSubject, setResourceSubject] = useState('');
  const [resourceDownloadUrl, setResourceDownloadUrl] = useState('');
  const [resourceSize, setResourceSize] = useState('');

  // Faculty Form
  const [facultyName, setFacultyName] = useState('');
  const [facultyRole, setFacultyRole] = useState('');
  const [facultySpec, setFacultySpec] = useState('');
  const [facultyDesc, setFacultyDesc] = useState('');
  const [facultyImage, setFacultyImage] = useState('');
  const [facultySubjectTag, setFacultySubjectTag] = useState('');

  // Testimonials Toppers Form
  const [testiName, setTestiName] = useState('');
  const [testiRole, setTestiRole] = useState('');
  const [testiText, setTestiText] = useState('');
  const [testiRating, setTestiRating] = useState(5);
  const [testiAchievement, setTestiAchievement] = useState('');

  // Settings Configuration Form
  const [apkVers, setApkVers] = useState(appSettings.apkVersion);
  const [apkSizeVal, setApkSizeVal] = useState(appSettings.apkSize);
  const [apkUrlVal, setApkUrlVal] = useState(appSettings.apkUrl);
  const [bannerTitleVal, setBannerTitleVal] = useState(appSettings.bannerTitle);
  const [bannerSubVal, setBannerSubVal] = useState(appSettings.bannerSubtitle);
  const [whatsappUrlVal, setWhatsappUrlVal] = useState(appSettings.whatsappUrl);
  const [clName, setClName] = useState(appSettings.cloudinaryCloudName || (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || '');
  const [clPreset, setClPreset] = useState(appSettings.cloudinaryUploadPreset || (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || '');
  const [enableAdsVal, setEnableAdsVal] = useState(appSettings.enableAds ?? false);

  // Sync form states with appSettings once they are loaded asynchronously
  useEffect(() => {
    setApkVers(appSettings.apkVersion);
    setApkSizeVal(appSettings.apkSize);
    setApkUrlVal(appSettings.apkUrl);
    setBannerTitleVal(appSettings.bannerTitle);
    setBannerSubVal(appSettings.bannerSubtitle);
    setWhatsappUrlVal(appSettings.whatsappUrl);
    setClName(appSettings.cloudinaryCloudName || (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || '');
    setClPreset(appSettings.cloudinaryUploadPreset || (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || '');
    setEnableAdsVal(appSettings.enableAds ?? false);
  }, [appSettings]);

  // Operation statuses
  const [statusMsg, setStatusMsg] = useState('');
  const [btnSaving, setBtnSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setAuthError('');
      } else {
        setCurrentUser(null);
      }
      setAuthChecking(false);
    });
    return unsub;
  }, []);

  // Fetch Lists based on active Tab (Real-time update)
  useEffect(() => {
    if (!currentUser) return;
    if (activeTab === 'settings') return;
    
    setLoadingList(true);
    setStatusMsg('');

    let q;
    if (activeTab === 'admissions') {
      q = query(collection(db, 'admissions'), orderBy('createdAt', 'desc'));
    } else if (activeTab === 'notices') {
      q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    } else if (activeTab === 'blogs') {
      q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    } else if (activeTab === 'courses') {
      q = query(collection(db, 'courses'));
    } else if (activeTab === 'resources') {
      q = query(collection(db, 'resources'));
    } else if (activeTab === 'faculty') {
      q = query(collection(db, 'faculty'));
    } else if (activeTab === 'testimonials') {
      q = query(collection(db, 'testimonials'));
    } else { // activeTab === 'messages'
      q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snap) => {
      const data: any[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() }));

      if (activeTab === 'admissions') {
        setAdmissions(data as AdmissionRequest[]);
      } else if (activeTab === 'notices') {
        setNotices(data as Notice[]);
      } else if (activeTab === 'blogs') {
        setBlogs(data as BlogPost[]);
      } else if (activeTab === 'courses') {
        setCourses(data);
      } else if (activeTab === 'resources') {
        setResources(data as FreeResource[]);
      } else if (activeTab === 'faculty') {
        setFaculty(data as FacultyMember[]);
      } else if (activeTab === 'testimonials') {
        setTestimonials(data as Testimonial[]);
      } else if (activeTab === 'messages') {
        setMessages(data as ContactMessage[]);
      }
      setLoadingList(false);
    }, (err) => {
      console.error('Failed real-time snapshot retrieval:', err);
      setLoadingList(false);
      handleFirestoreError(err, OperationType.LIST, activeTab);
    });

    return () => unsubscribe();
  }, [currentUser, activeTab]);

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput) {
      setAuthError('Please provide both administrative Gmail/email and reference password.');
      return;
    }
    setAuthError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message;
      if (err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid administration credentials. Check your email or password.';
      } else if (err.code === 'auth/user-not-found') {
        errMsg = 'No user account found with this administrator email.';
      } else if (err.code === 'auth/wrong-password') {
        errMsg = 'Incorrect administration password key.';
      }
      setAuthError(`Sign-In error: ${errMsg}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  // ADMISSIONS ACTIONS
  const updateAdmissionStatus = async (id: string, nextStatus: 'contacted' | 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'admissions', id), { status: nextStatus });
      setAdmissions(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
      setStatusMsg('Admission status updated successfully!');
    } catch (err) {
      setStatusMsg('Update failed. Check firebase rules.');
    }
  };

  const deleteAdmission = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this admission request?')) return;
    try {
      await deleteDoc(doc(db, 'admissions', id));
      setAdmissions(prev => prev.filter(item => item.id !== id));
      setStatusMsg('Admission request deleted from database.');
    } catch (err) {
      setStatusMsg('Deletion failed.');
    }
  };

  // CONTACTS ACTIONS
  const toggleMessageStatus = async (id: string, currentStatus: 'unread' | 'read') => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      await updateDoc(doc(db, 'messages', id), { status: nextStatus });
      setMessages(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
      setStatusMsg('Message status toggled!');
    } catch (err) {
      setStatusMsg('Update failed.');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Delete message?')) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(prev => prev.filter(item => item.id !== id));
      setStatusMsg('Message deleted successfully.');
    } catch (err) {
      setStatusMsg('Deletion failed.');
    }
  };

  // NOTICES ACTIONS
  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;
    setBtnSaving(true);

    try {
      const payload = {
        title: noticeTitle.trim(),
        content: noticeContent.trim(),
        category: noticeCategory,
        pinned: noticePinned,
        createdAt: serverTimestamp()
      };

      if (editingDocId) {
        await updateDoc(doc(db, 'notices', editingDocId), {
          ...payload,
          updatedAt: serverTimestamp()
        });
        setStatusMsg('Notice updated successfully!');
      } else {
        await addDoc(collection(db, 'notices'), payload);
        setStatusMsg('New Notice posted on board!');
      }

      setNoticeTitle('');
      setNoticeContent('');
      setNoticePinned(false);
      setEditingDocId(null);
    } catch (err) {
      setStatusMsg('Failed to save notice.');
    } finally {
      setBtnSaving(false);
    }
  };

  const editNoticeTrigger = (notice: Notice) => {
    setEditingDocId(notice.id);
    setNoticeTitle(notice.title);
    setNoticeContent(notice.content);
    setNoticeCategory(notice.category);
    setNoticePinned(notice.pinned);
  };

  const deleteNotice = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteDoc(doc(db, 'notices', id));
      setNotices(prev => prev.filter(item => item.id !== id));
      setStatusMsg('Notice deleted completely.');
    } catch (err) {
      setStatusMsg('Deletion failed.');
    }
  };

  // BLOGS ACTIONS
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent || !blogSummary) return;
    setBtnSaving(true);

    try {
      const payload = {
        title: blogTitle.trim(),
        slug: blogSlug.trim() || blogTitle.toLowerCase().replace(/\s+/g, '-'),
        content: blogContent.trim(),
        summary: blogSummary.trim(),
        category: blogCategory,
        imageUrl: blogImage.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600',
        author: blogAuthor.trim() || 'Coaching Institute Admin',
        views: 0,
        createdAt: serverTimestamp()
      };

      if (editingDocId) {
        await updateDoc(doc(db, 'blogs', editingDocId), {
          ...payload,
          updatedAt: serverTimestamp()
        });
        setStatusMsg('Blog Post updated successfully!');
      } else {
        await addDoc(collection(db, 'blogs'), payload);
        setStatusMsg('New Blog Post published on site!');
      }

      setBlogTitle('');
      setBlogSlug('');
      setBlogContent('');
      setBlogSummary('');
      setBlogImage('');
      setBlogAuthor('');
      setEditingDocId(null);
    } catch (err) {
      setStatusMsg('Failed to save blog post.');
    } finally {
      setBtnSaving(false);
    }
  };

  const editBlogTrigger = (post: BlogPost) => {
    setEditingDocId(post.id);
    setBlogTitle(post.title);
    setBlogSlug(post.slug);
    setBlogContent(post.content);
    setBlogSummary(post.summary);
    setBlogCategory(post.category);
    setBlogImage(post.imageUrl);
    setBlogAuthor(post.author);
  };

  const deleteBlog = async (id: string) => {
    if (!window.confirm('Delete blog article?')) return;
    try {
      await deleteDoc(doc(db, 'blogs', id));
      setBlogs(prev => prev.filter(item => item.id !== id));
      setStatusMsg('Blog post removed.');
    } catch (err) {
      setStatusMsg('Failed deleting.');
    }
  };

  // COURSES ACTIONS
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !courseTarget || !courseFee) return;
    setBtnSaving(true);

    try {
      const payload = {
        name: courseName.trim(),
        target: courseTarget.trim(),
        fee: courseFee.trim(),
        subjects: courseSubjects.split(',').map(s => s.trim()).filter(Boolean),
        syllabus: courseSyllabus.trim() || 'Comprehensive preparation syllabus.',
        notes: courseNotes.trim() || 'PDF worksheets, lecture study notes.',
        updatedAt: serverTimestamp()
      };

      if (editingDocId) {
        await updateDoc(doc(db, 'courses', editingDocId), payload);
        setStatusMsg('Course batch details synchronized!');
      } else {
        await addDoc(collection(db, 'courses'), { ...payload, createdAt: serverTimestamp() });
        setStatusMsg('New Course batch published on directory!');
      }

      setCourseName('');
      setCourseTarget('');
      setCourseFee('');
      setCourseSubjects('');
      setCourseSyllabus('');
      setCourseNotes('');
      setEditingDocId(null);
    } catch (err) {
      setStatusMsg('Failed to save course data.');
    } finally {
      setBtnSaving(false);
    }
  };

  const editCourseTrigger = (course: any) => {
    setEditingDocId(course.id);
    setCourseName(course.name);
    setCourseTarget(course.target);
    setCourseFee(course.fee);
    setCourseSubjects(Array.isArray(course.subjects) ? course.subjects.join(', ') : '');
    setCourseSyllabus(course.syllabus || '');
    setCourseNotes(course.notes || '');
  };

  const deleteCourse = async (id: string) => {
    if (!window.confirm('Remove this coaching batch?')) return;
    try {
      await deleteDoc(doc(db, 'courses', id));
      setStatusMsg('Coaching course batch deleted completely.');
    } catch {
      setStatusMsg('Failed to delete course.');
    }
  };

  // FMC RESOURCES ACTIONS
  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle || !resourceDownloadUrl || !resourceTarget) return;
    setBtnSaving(true);

    try {
      const payload = {
        title: resourceTitle.trim(),
        category: resourceCategory,
        classTarget: resourceTarget.trim(),
        subject: resourceSubject.trim() || 'Physics',
        downloadUrl: resourceDownloadUrl.trim(),
        fileSize: resourceSize.trim() || '1.8 MB',
        updatedAt: serverTimestamp()
      };

      if (editingDocId) {
        await updateDoc(doc(db, 'resources', editingDocId), payload);
        setStatusMsg('FMC study material resource updated!');
      } else {
        await addDoc(collection(db, 'resources'), { ...payload, createdAt: serverTimestamp() });
        setStatusMsg('New FMC resource document published catalog!');
      }

      setResourceTitle('');
      setResourceTarget('');
      setResourceSubject('');
      setResourceDownloadUrl('');
      setResourceSize('');
      setEditingDocId(null);
    } catch (err) {
      setStatusMsg('Failed to save FMC study resource.');
    } finally {
      setBtnSaving(false);
    }
  };

  const editResourceTrigger = (res: any) => {
    setEditingDocId(res.id);
    setResourceTitle(res.title);
    setResourceCategory(res.category || 'notes');
    setResourceTarget(res.classTarget || res.target || '');
    setResourceSubject(res.subject || '');
    setResourceDownloadUrl(res.downloadUrl || '');
    setResourceSize(res.fileSize || '');
  };

  const deleteResource = async (id: string) => {
    if (!window.confirm('Delete study catalog item?')) return;
    try {
      await deleteDoc(doc(db, 'resources', id));
      setStatusMsg('FMC study material card removed completely.');
    } catch {
      setStatusMsg('Failed deleting.');
    }
  };

  // FACULTY ACTIONS
  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName || !facultyRole || !facultySpec) return;
    setBtnSaving(true);

    try {
      const payload = {
        name: facultyName.trim(),
        role: facultyRole.trim(),
        spec: facultySpec.trim(),
        desc: facultyDesc.trim() || 'Mentoring and managing student boards doubt cell operations.',
        imageUrl: facultyImage.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
        subjectTag: facultySubjectTag.trim() || facultyRole.split(' & ')[0] || 'Coaching Expert',
        updatedAt: serverTimestamp()
      };

      if (editingDocId) {
        await updateDoc(doc(db, 'faculty', editingDocId), payload);
        setStatusMsg('Faculty member information updated!');
      } else {
        await addDoc(collection(db, 'faculty'), { ...payload, createdAt: serverTimestamp() });
        setStatusMsg('New faculty guide registered in staff matrix!');
      }

      setFacultyName('');
      setFacultyRole('');
      setFacultySpec('');
      setFacultyDesc('');
      setFacultyImage('');
      setFacultySubjectTag('');
      setEditingDocId(null);
    } catch (err) {
      setStatusMsg('Failed saving staff information.');
    } finally {
      setBtnSaving(false);
    }
  };

  const editFacultyTrigger = (member: any) => {
    setEditingDocId(member.id);
    setFacultyName(member.name);
    setFacultyRole(member.role);
    setFacultySpec(member.spec);
    setFacultyDesc(member.desc || '');
    setFacultyImage(member.imageUrl || '');
    setFacultySubjectTag(member.subjectTag || '');
  };

  const deleteFaculty = async (id: string) => {
    if (!window.confirm('Delete this faculty guide member?')) return;
    try {
      await deleteDoc(doc(db, 'faculty', id));
      setStatusMsg('Faculty guide removed.');
    } catch {
      setStatusMsg('Failed deleting.');
    }
  };

  // TESTIMONIALS ACTIONS
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testiName || !testiRole || !testiText) return;
    setBtnSaving(true);

    try {
      const payload = {
        name: testiName.trim(),
        role: testiRole.trim(),
        text: testiText.trim(),
        rating: testiRating,
        achievement: testiAchievement.trim() || 'Alum topper',
        updatedAt: serverTimestamp()
      };

      if (editingDocId) {
        await updateDoc(doc(db, 'testimonials', editingDocId), payload);
        setStatusMsg('Testimonial chronicle updated!');
      } else {
        await addDoc(collection(db, 'testimonials'), { ...payload, createdAt: serverTimestamp() });
        setStatusMsg('New topper success chronicle posted on main home slide!');
      }

      setTestiName('');
      setTestiRole('');
      setTestiText('');
      setTestiRating(5);
      setTestiAchievement('');
      setEditingDocId(null);
    } catch (err) {
      setStatusMsg('Failed saving testimonial.');
    } finally {
      setBtnSaving(false);
    }
  };

  const editTestimonialTrigger = (testi: any) => {
    setEditingDocId(testi.id);
    setTestiName(testi.name);
    setTestiRole(testi.role);
    setTestiText(testi.text);
    setTestiRating(testi.rating || 5);
    setTestiAchievement(testi.achievement || '');
  };

  const deleteTestimonial = async (id: string) => {
    if (!window.confirm('Remove this topper achievement chronicle?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      setStatusMsg('Topper chronicle removed.');
    } catch {
      setStatusMsg('Failed removing testimonial.');
    }
  };

  // SYSTEM SETTINGS ACTIONS
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtnSaving(true);
    setStatusMsg('');

    try {
      const payload: AppConfig = {
        apkVersion: apkVers.trim() || '2.1',
        apkSize: apkSizeVal.trim() || '15.4 MB',
        apkUrl: apkUrlVal.trim() || 'https://res.cloudinary.com/new-direction/raw/upload/v2.1.apk',
        bannerTitle: bannerTitleVal.trim() || 'Your True Pathway in Patna',
        bannerSubtitle: bannerSubVal.trim() || 'NEET, JEE & State Boards Masterclass Coaching Strategy',
        whatsappUrl: whatsappUrlVal.trim() || 'https://wa.me/919999999999',
        cloudinaryCloudName: clName.trim(),
        cloudinaryUploadPreset: clPreset.trim(),
        enableAds: enableAdsVal
      };

      await setDoc(doc(db, 'settings', 'app_config'), payload);
      onSettingsUpdate(payload);
      setStatusMsg('System settings successfully synchronized with central database!');
    } catch (err: any) {
      setStatusMsg(`Settings synchronization failed: ${err.message || err}`);
    } finally {
      setBtnSaving(false);
    }
  };

  if (authChecking) {
    return (
      <div className="text-center py-24 space-y-3 max-w-7xl mx-auto">
        <Loader2 className="w-8 h-8 text-indigo-650 animate-spin mx-auto text-blue-500" />
        <p className="text-xs text-slate-400 font-mono">Verifying authorization token...</p>
      </div>
    );
  }

  // Not LoggedIn View
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-10 px-6 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-900 rounded-2xl shadow-xl space-y-6 text-center my-10 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto mb-2">
          <ShieldAlert className="w-10 h-10 animate-pulse text-blue-505" />
        </div>
        
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight select-none">
            Coaching Center Admin Login
          </h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 font-sans leading-relaxed">
            Restricted area. Please sign in using your administrative Gmail and Password to manage student requests, notices, blogs, and settings.
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-red-50 dark:bg-rose-955/30 border-l-4 border-rose-550 text-3xs text-rose-600 dark:text-rose-400 text-left rounded-r leading-relaxed">
            ⚠️ {authError}
          </div>
        )}

        <form onSubmit={handleEmailPasswordAuth} className="space-y-4 text-left">
          <div>
            <label className="block text-3xs font-mono uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
              Gmail / Admin Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="mdwasimalam264@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-3xs font-mono uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password key"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 mt-2 bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors uppercase font-mono tracking-wider shadow-md shadow-blue-500/10 disabled:opacity-50"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Login with Email & Password</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // LoggedIn Panel
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-4">
      
      {/* Admin header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/50 border border-blue-900/60 rounded-full text-blue-400 text-3xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-400" />
            <span>Authorized Administrator Panel</span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight leading-tight select-none">
            New Direction Management Console
          </h2>
          <p className="text-xs text-slate-400">
            Current Session active: <strong>{currentUser.email}</strong>
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-105 font-bold font-mono text-3xs uppercase cursor-pointer border border-slate-700 transition"
        >
          <span>Admin Logout</span>
          <LogOut className="w-4 h-4 text-red-400" />
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 text-xs text-blue-700 dark:text-blue-300 border-l-4 border-blue-600 rounded-r shadow-xs">
          {statusMsg}
        </div>
      )}

      {/* Main Panel grid: Tabs left, content right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-900 rounded-2xl p-4.5 space-y-1.5">
          <span className="text-[10px] font-mono tracking-widest text-slate-450 uppercase font-black pl-1 block pb-2 tracking-widest leading-none">
            Center Database Operations
          </span>

          {[
            { id: 'admissions', label: 'Admission Requests', icon: <Award className="w-4 h-4" /> },
            { id: 'courses', label: 'Batches / Courses', icon: <Plus className="w-4 h-4" /> },
            { id: 'notices', label: 'Notices Board', icon: <Volume2 className="w-4 h-4" /> },
            { id: 'blogs', label: 'SEO Blog Manager', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'resources', label: 'Free Materials (FMC)', icon: <FileText className="w-4 h-4" /> },
            { id: 'faculty', label: 'Staff Mentors', icon: <Users className="w-4 h-4" /> },
            { id: 'testimonials', label: 'Testimonials Toppers', icon: <Star className="w-4 h-4" /> },
            { id: 'messages', label: 'Contact Helpdesk', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'settings', label: 'System Configurations', icon: <Settings className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setEditingDocId(null); setStatusMsg(''); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-650 hover:bg-slate-50 dark:text-slate-205 dark:hover:bg-slate-900/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Workspace */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-900 rounded-2xl p-6 shadow-xs min-h-[480px]">
          
          {loadingList ? (
            <div className="text-center py-24 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-550 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Loading operations queues...</p>
            </div>
          ) : (
            <div>

              {/* TABS 1: ADMISSIONS REQUESTS */}
              {activeTab === 'admissions' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Admissions Requests ({admissions.length})</h3>
                    <p className="text-3xs text-slate-500 font-mono uppercase mt-0.5">Real-time submissions from form</p>
                  </div>

                  {admissions.length === 0 ? (
                    <p className="text-xs py-10 text-center text-slate-400 italic">No admission requests registered in database.</p>
                  ) : (
                    <div className="space-y-4.5">
                      {admissions.map(item => (
                        <div key={item.id} className="p-4 rounded-xl border border-slate-155 dark:border-slate-900 space-y-3.5 relative overflow-hidden bg-slate-50/40 dark:bg-slate-950/20">
                          
                          {/* Corner status tag */}
                          <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold capitalize ${
                            item.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' :
                            item.status === 'contacted' ? 'bg-blue-105/30 text-blue-700 dark:text-blue-400' :
                            item.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' :
                            'bg-slate-100 text-slate-500 dark:bg-slate-800'
                          }`}>
                            {item.status}
                          </span>

                          <div className="space-y-1 max-w-[80%]">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              Student: {item.name}
                            </h4>
                            <div className="text-3xs text-slate-450 dark:text-slate-500 font-mono space-y-0.5">
                              <p>📞 Phone/WA: <strong>{item.phone}</strong> | Email: <strong>{item.email || 'None'}</strong></p>
                              <p>🎓 Course Code: <strong className="text-blue-600 dark:text-blue-400 uppercase">{item.courseId}</strong></p>
                              <p>📅 Request Time: {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : 'N/A'}</p>
                            </div>
                          </div>

                          {item.message && (
                            <p className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-550 rounded-lg">
                              <strong>Query Message:</strong> {item.message}
                            </p>
                          )}

                          {/* Quick Admin Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-900 text-xs text-3xs font-mono font-bold uppercase">
                            <button 
                              onClick={() => updateAdmissionStatus(item.id, 'contacted')}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-955/35 text-blue-700 dark:text-blue-400 rounded cursor-pointer"
                            >
                              📞 Mark Contacted
                            </button>
                            <button 
                              onClick={() => updateAdmissionStatus(item.id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-955/35 text-emerald-700 dark:text-emerald-400 rounded cursor-pointer"
                            >
                              ✓ Approve Seat
                            </button>
                            <button 
                              onClick={() => updateAdmissionStatus(item.id, 'rejected')}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-955/35 text-rose-700 dark:text-rose-400 rounded cursor-pointer"
                            >
                              ✗ Reject
                            </button>
                            <button 
                              onClick={() => deleteAdmission(item.id)}
                              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded text-slate-500 hover:text-red-500 ml-auto cursor-pointer"
                              title="Delete Admission Request"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TABS COURSES Manager */}
              {activeTab === 'courses' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                    <h3 className="text-base font-bold text-slate-905 dark:text-white">Structured Batches & Courses ({courses.length})</h3>
                    <p className="text-3xs text-slate-500 font-mono uppercase mt-0.5 font-bold">Manage available coaching batches dynamically on the site</p>
                  </div>

                  <form onSubmit={handleCourseSubmit} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
                    <span className="text-xs font-bold font-mono tracking-wide uppercase block text-blue-600 dark:text-blue-400 border-b pb-2">
                      {editingDocId ? '✏️ Edit Coaching Batch' : '➕ Add General Coaching Batch'}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Batch Name *</label>
                        <input 
                          type="text" 
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                          placeholder="PCB/PCM Masterclass" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Target Class *</label>
                        <input 
                          type="text" 
                          value={courseTarget}
                          onChange={(e) => setCourseTarget(e.target.value)}
                          placeholder="Class 11-12th boards" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Fee Structure *</label>
                        <input 
                          type="text" 
                          value={courseFee}
                          onChange={(e) => setCourseFee(e.target.value)}
                          placeholder="₹2,500/month or ₹35,000 One-time" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Subjects covered (comma separated) *</label>
                      <input 
                        type="text" 
                        value={courseSubjects}
                        onChange={(e) => setCourseSubjects(e.target.value)}
                        placeholder="Physics, Chemistry, Biology, English Core" 
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Curriculum Scope *</label>
                        <textarea 
                          value={courseSyllabus}
                          onChange={(e) => setCourseSyllabus(e.target.value)}
                          placeholder="Describe syllabus scope..." 
                          rows={2}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Batch deliverables / materials *</label>
                        <textarea 
                          value={courseNotes}
                          onChange={(e) => setCourseNotes(e.target.value)}
                          placeholder="Worksheets, Mock papers..." 
                          rows={2}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex gap-2.5 justify-end">
                      {editingDocId && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setCourseName('');
                            setCourseTarget('');
                            setCourseFee('');
                            setCourseSubjects('');
                            setCourseSyllabus('');
                            setCourseNotes('');
                            setEditingDocId(null);
                          }}
                          className="px-4 py-2 border border-slate-205 text-slate-500 rounded-lg text-xs cursor-pointer"
                        >
                          Cancel override
                        </button>
                      )}
                      <button 
                        type="submit" 
                        disabled={btnSaving}
                        className="px-6 py-2 bg-blue-650 hover:bg-blue-700 text-white font-mono tracking-wider text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer uppercase"
                      >
                        {btnSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{editingDocId ? 'Update Batch' : 'Create Batch'}</span>
                      </button>
                    </div>

                  </form>

                  {/* Batches list */}
                  <div className="space-y-3 pt-2">
                    {courses.map(course => (
                      <div key={course.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-900 flex justify-between items-start gap-4 hover:bg-slate-50/20">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-3xs font-mono font-bold uppercase text-slate-400">
                            <span>{course.target}</span>
                            <span>•</span>
                            <span className="text-blue-500 font-mono font-bold shrink-0">{course.fee}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-905 dark:text-white">{course.name}</h4>
                          <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal font-sans pt-0.5">
                            <strong>Subjects:</strong> {Array.isArray(course.subjects) ? course.subjects.join(', ') : 'None'}
                          </p>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <button 
                            onClick={() => editCourseTrigger(course)}
                            className="p-1.5 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 rounded cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteCourse(course.id)}
                            className="p-1.5 bg-slate-50 hover:bg-red-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-red-500 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TABS 2: NOTICES BOARD MANAGER */}
              {activeTab === 'notices' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-900 pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Notices Board Manager ({notices.length})</h3>
                      <p className="text-3xs text-slate-550 font-mono uppercase mt-0.5">Manage live coaching news bulletins</p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleNoticeSubmit} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                      {editingDocId ? '✏️ Edit Bulletin Bulletin' : '📢 Post New Notice Bulletin'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Notice Title *</label>
                        <input 
                          type="text" 
                          value={noticeTitle}
                          onChange={(e) => setNoticeTitle(e.target.value)}
                          placeholder="E.g. Holiday on Independence Day" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Notice Category *</label>
                        <select 
                          value={noticeCategory}
                          onChange={(e) => setNoticeCategory(e.target.value as NoticeCategory)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs cursor-pointer"
                        >
                          <option value="general">🔔 General Notices</option>
                          <option value="batch">⚡ Batch updates</option>
                          <option value="holiday">🌴 Holiday notices</option>
                          <option value="exam">✍ Exam alerts</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Content Details *</label>
                      <textarea 
                        value={noticeContent}
                        onChange={(e) => setNoticeContent(e.target.value)}
                        placeholder="Write detailed announcements description..." 
                        rows={3}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        required
                      ></textarea>
                    </div>

                    <div className="flex items-center gap-4.5 pt-1 text-xs font-bold">
                      <label className="flex items-center gap-2 text-slate-700 dark:text-slate-205 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={noticePinned}
                          onChange={(e) => setNoticePinned(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <span>Pin notice at the top (High priority banner)</span>
                      </label>
                    </div>

                    <div className="pt-2 flex gap-3 justify-end">
                      {editingDocId && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setNoticeTitle('');
                            setNoticeContent('');
                            setNoticePinned(false);
                            setEditingDocId(null);
                          }}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Cancel Override
                        </button>
                      )}
                      <button 
                        type="submit" 
                        disabled={btnSaving}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer uppercase font-mono tracking-wide"
                      >
                        {btnSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{editingDocId ? 'Update Notice' : 'Post Notice'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Bulletins list */}
                  <div className="space-y-3">
                    {notices.map(item => (
                      <div key={item.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-900 flex justify-between items-start gap-4">
                        <div className="space-y-1 max-w-[80%]">
                          <div className="flex items-center gap-2 text-[10px] uppercase font-mono font-bold text-slate-450">
                            {item.pinned && <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded font-mono uppercase text-3xs flex items-center gap-0.5 font-bold">📌 Pinned</span>}
                            <span>{item.category}</span>
                            <span>•</span>
                            <span>{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Active Date'}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">{item.title}</h4>
                          <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.content}</p>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => editNoticeTrigger(item)}
                            className="p-1.5 bg-slate-50 hover:bg-indigo-550/15 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded cursor-pointer"
                            title="Edit Notice"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteNotice(item.id)}
                            className="p-1.5 bg-slate-50 hover:bg-rose-550/15 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-505 dark:text-slate-400 rounded cursor-pointer"
                            title="Delete Notice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TABS 3: SEO ARTICLES MANAGER */}
              {activeTab === 'blogs' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">SEO Study Blogs Manager ({blogs.length})</h3>
                    <p className="text-3xs text-slate-550 font-mono uppercase mt-0.5">Edit, create, or delete articles and tips</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleBlogSubmit} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-850 rounded-xl space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                      {editingDocId ? '✏️ Edit Study Article' : '📝 Publish New SEO Article'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Article Title *</label>
                        <input 
                          type="text" 
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          placeholder="E.g. Class 12 Boards Science Checklist" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Slug URL path (optional)</label>
                        <input 
                          type="text" 
                          value={blogSlug}
                          onChange={(e) => setBlogSlug(e.target.value)}
                          placeholder="class-12-boards-science-checklist" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">SEO Category *</label>
                        <select 
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value as BlogCategory)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs cursor-pointer"
                        >
                          {Object.entries(CATEGORIES_LABELS).map(([key, val]) => (
                            <option key={key} value={key}>{val}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Author Name / Role</label>
                        <input 
                          type="text" 
                          value={blogAuthor}
                          onChange={(e) => setBlogAuthor(e.target.value)}
                          placeholder="Prof. Rohit Verma" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Short Summary (SEO meta snippet)*</label>
                      <input 
                        type="text" 
                        value={blogSummary}
                        onChange={(e) => setBlogSummary(e.target.value)}
                        placeholder="A continuous board examination guidance report designed around..." 
                        maxLength={500}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        required
                      />
                    </div>

                    {/* Image Cloudinary integrated uploader */}
                    <CloudinaryUploader 
                      label="Upload Blog Thumbnail / Header Image" 
                      allowedTypes="image/*"
                      initialValue={blogImage}
                      onUploadSuccess={(url) => setBlogImage(url)}
                      cloudinaryConfig={{
                        cloudName: clName,
                        uploadPreset: clPreset
                      }}
                    />

                    <div>
                      <label className="block text-[11px] font-bold text-slate-705 dark:text-slate-350 mb-1">Article Body Content (Markdown Supported) *</label>
                      <textarea 
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        placeholder="# Title of the chapter\nWrite detailed formulas or curriculum maps chemistry or physics." 
                        rows={8}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg text-xs font-mono leading-relaxed"
                        required
                      ></textarea>
                    </div>

                    <div className="pt-2 flex gap-3 justify-end">
                      {editingDocId && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setBlogTitle('');
                            setBlogSlug('');
                            setBlogContent('');
                            setBlogSummary('');
                            setBlogImage('');
                            setBlogAuthor('');
                            setEditingDocId(null);
                          }}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                      <button 
                        type="submit" 
                        disabled={btnSaving}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer uppercase font-mono tracking-wide"
                      >
                        {btnSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{editingDocId ? 'Update Article' : 'Publish Article'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Blog articles list */}
                  <div className="space-y-3 pt-4">
                    {blogs.map(post => (
                      <div key={post.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-900 flex justify-between items-start gap-4 hover:bg-slate-50/30">
                        <div className="flex gap-4 items-start max-w-[80%]">
                          {post.imageUrl && (
                            <img 
                              src={post.imageUrl} 
                              alt="" 
                              className="w-14 h-14 rounded object-cover shrink-0 border dark:border-slate-805 bg-slate-100" 
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div className="space-y-0.5">
                            <span className="text-3xs uppercase font-mono font-bold text-slate-450">
                              {CATEGORIES_LABELS[post.category]} • By: {post.author}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">{post.title}</h4>
                            <p className="text-3xs text-slate-450 leading-relaxed font-sans line-clamp-1">{post.summary}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button 
                            onClick={() => editBlogTrigger(post)}
                            className="p-1.5 bg-slate-50 hover:bg-indigo-550/15 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteBlog(post.id)}
                            className="p-1.5 bg-slate-50 hover:bg-rose-550/15 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-505 dark:text-slate-400 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TABS 4: FREE MATERIALS (FMC) MANAGER */}
              {activeTab === 'resources' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Free Materials Library Center (FMC)</h3>
                    <p className="text-3xs text-slate-500 font-mono uppercase mt-0.5 font-bold">Manage PDF notes, chapter guides and syllabus outlines</p>
                  </div>

                  <form onSubmit={handleResourceSubmit} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
                    <span className="text-xs font-bold font-mono tracking-wide uppercase block text-blue-600 dark:text-blue-400 border-b pb-2">
                      {editingDocId ? '✏️ Edit Study Material' : '➕ Upload Study Material PDF/Notes'}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Resource Title *</label>
                        <input 
                          type="text" 
                          value={resourceTitle}
                          onChange={(e) => setResourceTitle(e.target.value)}
                          placeholder="Class 12th Chemistry Naming Reactions" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Library Category *</label>
                        <select 
                          value={resourceCategory}
                          onChange={(e) => setResourceCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs cursor-pointer"
                        >
                          <option value="notes">📘 Study Notes</option>
                          <option value="pdfs">📁 Free PDF Guides</option>
                          <option value="syllabus">📋 Exam Syllabus</option>
                          <option value="papers">🎯 Mock Test Papers</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Target Class/Prep *</label>
                        <input 
                          type="text" 
                          value={resourceTarget}
                          onChange={(e) => setResourceTarget(e.target.value)}
                          placeholder="NEET Prep, Class 12th boards" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Subject Tag *</label>
                        <input 
                          type="text" 
                          value={resourceSubject}
                          onChange={(e) => setResourceSubject(e.target.value)}
                          placeholder="Chemistry, Biology" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">File Size estimate *</label>
                        <input 
                          type="text" 
                          value={resourceSize}
                          onChange={(e) => setResourceSize(e.target.value)}
                          placeholder="E.g. 2.4 MB" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Integrated Cloudinary raw/pdf uploader */}
                    <CloudinaryUploader 
                      label="Upload PDF Note File directly to Cloudinary" 
                      allowedTypes=".pdf,.zip,.doc"
                      initialValue={resourceDownloadUrl}
                      onUploadSuccess={(url) => setResourceDownloadUrl(url)}
                      cloudinaryConfig={{
                        cloudName: clName,
                        uploadPreset: clPreset
                      }}
                    />

                    <div>
                      <label className="block text-3xs font-mono uppercase tracking-wide text-slate-455 mb-1 font-bold">Direct Material URL *</label>
                      <input 
                        type="text" 
                        value={resourceDownloadUrl}
                        onChange={(e) => setResourceDownloadUrl(e.target.value)}
                        placeholder="https://res.cloudinary.com/..." 
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                        required
                      />
                    </div>

                    <div className="flex gap-2.5 justify-end">
                      {editingDocId && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setResourceTitle('');
                            setResourceTarget('');
                            setResourceSubject('');
                            setResourceDownloadUrl('');
                            setResourceSize('');
                            setEditingDocId(null);
                          }}
                          className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        type="submit" 
                        disabled={btnSaving}
                        className="px-6 py-2 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer font-mono uppercase tracking-wider"
                      >
                        {btnSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{editingDocId ? 'Update Material' : 'Upload Material'}</span>
                      </button>
                    </div>

                  </form>

                  {/* List of library resources */}
                  <div className="space-y-3 pt-2">
                    {resources.map(res => (
                      <div key={res.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-900 flex justify-between items-start gap-4 hover:bg-slate-50/20">
                        <div className="space-y-0.5">
                          <span className="text-3xs uppercase font-mono font-bold text-blue-600 dark:text-blue-400">
                            {res.subject} • {res.classTarget} ({res.category})
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{res.title}</h4>
                          <p className="text-3xs text-slate-450 font-mono truncate max-w-sm">File Size: {res.fileSize} | Link: {res.downloadUrl}</p>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <button 
                            onClick={() => editResourceTrigger(res)}
                            className="p-1 text-slate-500 hover:text-indigo-650 rounded cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteResource(res.id)}
                            className="p-1 text-slate-500 hover:text-red-500 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TABS STAFF (Faculty) MANAGER */}
              {activeTab === 'faculty' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Faculty Guide Matrix Directory</h3>
                    <p className="text-3xs text-slate-500 font-mono uppercase mt-0.5 font-bold">Manage mentors listed on the About Us page</p>
                  </div>

                  <form onSubmit={handleFacultySubmit} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-800 rounded-xl space-y-4">
                    <span className="text-xs font-bold font-mono tracking-wide uppercase block text-blue-600 dark:text-blue-400 border-b pb-2">
                      {editingDocId ? '✏️ Edit Faculty Member Details' : '➕ Register New Faculty Staff Mentor'}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Mentor Full Name *</label>
                        <input 
                          type="text" 
                          value={facultyName}
                          onChange={(e) => setFacultyName(e.target.value)}
                          placeholder="Dr. Ravi Ranjan" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Role / Title *</label>
                        <input 
                          type="text" 
                          value={facultyRole}
                          onChange={(e) => setFacultyRole(e.target.value)}
                          placeholder="Organic Chemistry Head & Director" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Academic Credentials / Spec *</label>
                        <input 
                          type="text" 
                          value={facultySpec}
                          onChange={(e) => setFacultySpec(e.target.value)}
                          placeholder="Ph.D. Organic Chemistry (12+ Years Exp)" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Subject Tag (For page footer annotation)*</label>
                        <input 
                          type="text" 
                          value={facultySubjectTag}
                          onChange={(e) => setFacultySubjectTag(e.target.value)}
                          placeholder="Chemistry doubt lead" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Brief Description / Bio *</label>
                      <textarea 
                        value={facultyDesc}
                        onChange={(e) => setFacultyDesc(e.target.value)}
                        placeholder="Dr. Ravi coordinates advanced board examination systems..." 
                        rows={3}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-202 dark:border-slate-800 rounded-lg text-xs"
                        required
                      ></textarea>
                    </div>

                    {/* Integrated Cloudinary image uploader for staff guides */}
                    <CloudinaryUploader 
                      label="Upload Mentor Portait Picture directly" 
                      allowedTypes="image/*"
                      initialValue={facultyImage}
                      onUploadSuccess={(url) => setFacultyImage(url)}
                      cloudinaryConfig={{
                        cloudName: clName,
                        uploadPreset: clPreset
                      }}
                    />

                    <div>
                      <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Mentor Portrait URL</label>
                      <input 
                        type="text" 
                        value={facultyImage}
                        onChange={(e) => setFacultyImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..." 
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div className="flex gap-2.5 justify-end">
                      {editingDocId && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setFacultyName('');
                            setFacultyRole('');
                            setFacultySpec('');
                            setFacultyDesc('');
                            setFacultyImage('');
                            setFacultySubjectTag('');
                            setEditingDocId(null);
                          }}
                          className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs cursor-pointer"
                        >
                          Cancel style
                        </button>
                      )}
                      <button 
                        type="submit" 
                        disabled={btnSaving}
                        className="px-6 py-2 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer font-mono uppercase tracking-wider"
                      >
                        {btnSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{editingDocId ? 'Update Mentor' : 'Add Mentor'}</span>
                      </button>
                    </div>

                  </form>

                  {/* List of Faculty guides */}
                  <div className="space-y-3 pt-2">
                    {faculty.map(member => (
                      <div key={member.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-900 flex justify-between items-start gap-4 hover:bg-slate-50/20">
                        <div className="flex gap-4 items-center">
                          {member.imageUrl && (
                            <img 
                              src={member.imageUrl} 
                              alt="" 
                              className="w-12 h-12 rounded-full object-cover shrink-0 border bg-slate-100" 
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div>
                            <span className="text-3xs uppercase font-mono font-bold text-indigo-500">{member.role}</span>
                            <h4 className="text-xs font-bold text-slate-905 dark:text-white leading-tight">{member.name}</h4>
                            <p className="text-3xs text-slate-455 font-mono">{member.spec} | {member.subjectTag}</p>
                          </div>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <button 
                            onClick={() => editFacultyTrigger(member)}
                            className="p-1 text-slate-500 hover:text-indigo-655 rounded cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteFaculty(member.id)}
                            className="p-1 text-slate-500 hover:text-red-500 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TABS TESTIMONIALS MANAGER */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Patna Center Toppers Success Chronicles</h3>
                    <p className="text-3xs text-slate-500 font-mono uppercase mt-0.5 font-bold">Manage student reviews displayed dynamically on the Home page</p>
                  </div>

                  <form onSubmit={handleTestimonialSubmit} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-800 rounded-xl space-y-4">
                    <span className="text-xs font-bold font-mono tracking-wide uppercase block text-blue-600 dark:text-blue-400 border-b pb-2">
                      {editingDocId ? '✏️ Edit Topper success Story' : '➕ Write Topper Success Chronicle'}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Student Name *</label>
                        <input 
                          type="text" 
                          value={testiName}
                          onChange={(e) => setTestiName(e.target.value)}
                          placeholder="Aman Kumar" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Academic Result / Rank *</label>
                        <input 
                          type="text" 
                          value={testiRole}
                          onChange={(e) => setTestiRole(e.target.value)}
                          placeholder="JEE Advanced AIR 1420" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Placement / College Target *</label>
                        <input 
                          type="text" 
                          value={testiAchievement}
                          onChange={(e) => setTestiAchievement(e.target.value)}
                          placeholder="IIT Kharagpur CSE or PMCH Patna" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 mb-1 font-bold">Star Rating *</label>
                        <select 
                          value={testiRating}
                          onChange={(e) => setTestiRating(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs cursor-pointer font-bold"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ 5 Stars Estimate</option>
                          <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                          <option value="3">⭐⭐⭐ 3 Stars</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-3xs font-mono uppercase tracking-wide text-slate-405 mb-1 font-bold">Success review testimonial text *</label>
                      <textarea 
                        value={testiText}
                        onChange={(e) => setTestiText(e.target.value)}
                        placeholder="Describe exact student feedback with formulas short-cuts..." 
                        rows={3}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-202 dark:border-slate-800 rounded-lg text-xs"
                        required
                      ></textarea>
                    </div>

                    <div className="flex gap-2.5 justify-end">
                      {editingDocId && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setTestiName('');
                            setTestiRole('');
                            setTestiText('');
                            setTestiRating(5);
                            setTestiAchievement('');
                            setEditingDocId(null);
                          }}
                          className="px-4 py-2 border border-slate-200 text-slate-505 rounded-lg text-xs cursor-pointer"
                        >
                          Cancel style
                        </button>
                      )}
                      <button 
                        type="submit" 
                        disabled={btnSaving}
                        className="px-6 py-2 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer font-mono uppercase tracking-wider"
                      >
                        {btnSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{editingDocId ? 'Update Chronicle' : 'Post Chronicle'}</span>
                      </button>
                    </div>

                  </form>

                  {/* List of Testimonials */}
                  <div className="space-y-3 pt-2">
                    {testimonials.map(testi => (
                      <div key={testi.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-900 flex justify-between items-start gap-4 hover:bg-slate-50/20">
                        <div>
                          <div className="flex gap-0.5 text-amber-500 pb-1">
                            {[...Array(testi.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-3xs font-mono font-bold uppercase text-slate-400">{testi.role} | {testi.achievement}</span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight mt-0.5">{testi.name}</h4>
                          <p className="text-3xs text-slate-550 dark:text-slate-400 italic line-clamp-2 mt-1 leading-relaxed">"{testi.text}"</p>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <button 
                            onClick={() => editTestimonialTrigger(testi)}
                            className="p-1 text-slate-500 hover:text-indigo-650 rounded cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteTestimonial(testi.id)}
                            className="p-1 text-slate-500 hover:text-red-500 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TABS 5: CONTACT MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Contact Helpdesk Queries ({messages.length})</h3>
                    <p className="text-3xs text-slate-550 font-mono uppercase mt-0.5 font-bold">Parent and student tickets queue</p>
                  </div>

                  {messages.length === 0 ? (
                    <p className="text-xs py-10 text-center text-slate-450 italic font-sans">No incoming helpdesk queries in database.</p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div key={msg.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-950/20 relative">
                          <span className={`absolute top-4 right-4 px-2 py-0.5 rounded text-3xs font-mono font-bold capitalize ${msg.status === 'unread' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {msg.status}
                          </span>

                          <div className="max-w-[80%] space-y-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">From: {msg.name}</h4>
                            <p className="text-3xs font-mono text-slate-455">
                              Subject: <strong>{msg.subject}</strong> | Phone: {msg.phone} | Email: {msg.email}
                            </p>
                          </div>

                          <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg mt-3 leading-relaxed text-slate-605 dark:text-slate-300">
                            {msg.message}
                          </div>

                          <div className="flex gap-2.5 pt-3 border-t border-slate-105 mt-3 justify-end text-3xs font-mono tracking-wide uppercase font-bold">
                            <button 
                              onClick={() => toggleMessageStatus(msg.id, msg.status)}
                              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-bold cursor-pointer"
                            >
                              {msg.status === 'unread' ? '🏷️ Mark Read' : '🏷️ Mark Unread'}
                            </button>
                            <button 
                              onClick={() => deleteMessage(msg.id)}
                              className="px-2.5 py-1 text-rose-600 border border-rose-200 rounded font-bold cursor-pointer"
                            >
                              ✗ Delete Message
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TABS 5: SYSTEM CONFIGURATION */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Central Website Configuration</h3>
                    <p className="text-3xs text-slate-550 font-mono uppercase mt-0.5 font-bold">Configure active APK parameters, home banners, and Cloudinary keys</p>
                  </div>

                  <form onSubmit={handleSettingsSave} className="space-y-6 max-w-xl">
                    
                    {/* APK management */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-xl space-y-4">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-605 dark:text-blue-400 border-b pb-2 select-none">
                        🤖 Download App (APK) Parameters Management
                      </h4>

                      {/* Integrated Cloudinary uploader for APK files */}
                      <CloudinaryUploader 
                        label="Upload Stable APK Package directly" 
                        allowedTypes=".apk"
                        initialValue={apkUrlVal}
                        onUploadSuccess={(url) => setApkUrlVal(url)}
                        cloudinaryConfig={{
                          cloudName: clName,
                          uploadPreset: clPreset
                        }}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-3xs font-mono uppercase tracking-wide text-slate-450 mb-1 font-bold">APK Version Code *</label>
                          <input 
                            type="text" 
                            value={apkVers}
                            onChange={(e) => setApkVers(e.target.value)}
                            placeholder="E.g. 2.1" 
                            className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-3xs font-mono uppercase tracking-wide text-slate-450 mb-1 font-bold">APK File Size *</label>
                          <input 
                            type="text" 
                            value={apkSizeVal}
                            onChange={(e) => setApkSizeVal(e.target.value)}
                            placeholder="E.g. 15.4 MB" 
                            className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-455 mb-1 font-bold">APK Target Download Link *</label>
                        <input 
                          type="text" 
                          value={apkUrlVal}
                          onChange={(e) => setApkUrlVal(e.target.value)}
                          placeholder="https://example.com/build.apk" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Banner and links configurations */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-xl space-y-4">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b pb-2 select-none">
                        🎨 Home Hero & WhatsApp Parameters
                      </h4>

                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-455 mb-1 font-bold">Main Banner Title (SEO Heading)*</label>
                        <input 
                          type="text" 
                          value={bannerTitleVal}
                          onChange={(e) => setBannerTitleVal(e.target.value)}
                          placeholder="Your True Pathway in Patna" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-455 mb-1 font-bold">Sub-Banner text *</label>
                        <textarea 
                          value={bannerSubVal}
                          onChange={(e) => setBannerSubVal(e.target.value)}
                          placeholder="NEET, JEE & State Boards masterclass coaching strategy." 
                          rows={2}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                          required
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-3xs font-mono uppercase tracking-wide text-slate-455 mb-1">WhatsApp Group/Chat Link *</label>
                        <input 
                          type="text" 
                          value={whatsappUrlVal}
                          onChange={(e) => setWhatsappUrlVal(e.target.value)}
                          placeholder="https://wa.me/919999999999" 
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Monetization & Advertising Controls */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-xl space-y-4">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-650 dark:text-blue-450 border-b pb-2 flex items-center gap-1.5 select-none">
                        <span>📢 Monetization & Advertising Controls</span>
                      </h4>
                      
                      <div className="flex items-start gap-3 pt-1">
                        <input 
                          id="admin-toggle-ads"
                          type="checkbox" 
                          checked={enableAdsVal}
                          onChange={(e) => setEnableAdsVal(e.target.checked)}
                          className="mt-1 w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <div>
                          <label htmlFor="admin-toggle-ads" className="block text-xs font-bold text-slate-800 dark:text-slate-105 cursor-pointer select-none">
                            Enable Companion Ad Space Campaigns
                          </label>
                          <p className="text-3xs text-slate-450 dark:text-slate-500 leading-normal mt-0.5">
                            Check this option to enable responsive banner ads and sidebar monetization campaigns across the entire platform. If unchecked, all ad spaces are completely deactivated and hidden.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cloudinary credentials */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-850 rounded-xl space-y-4">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-655 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5 select-none">
                        <Cloud className="w-4.5 h-4.5" />
                        <span>Cloudinary Storage Settings (APK & Images)</span>
                      </h4>

                      <p className="text-3xs text-slate-500 leading-normal">
                        To activate real-time server uploads, provide your Unsigned upload preset. These credentials will remain stored securely inside the database settings container.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-bold">
                        <div>
                          <label className="block text-3xs font-mono uppercase tracking-wide text-slate-455 mb-1">Cloud Name</label>
                          <input 
                            type="text" 
                            value={clName}
                            onChange={(e) => setClName(e.target.value)}
                            placeholder="E.g. dxyz123ab" 
                            className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-3xs font-mono uppercase tracking-wide text-slate-455 mb-1">Upload Preset (Unsigned)</label>
                          <input 
                            type="text" 
                            value={clPreset}
                            onChange={(e) => setClPreset(e.target.value)}
                            placeholder="E.g. unsigned_preset_name" 
                            className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={btnSaving}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase font-mono tracking-wider shadow-md shadow-blue-500/10 font-bold"
                    >
                      {btnSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Synchronize Central Settings</span>
                    </button>

                  </form>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
