export interface Course {
  id: string;
  name: string;
  targetClass: string;
  subjects: string[];
  duration: string;
  fee: number;
  feePeriod: 'monthly' | 'one-time' | 'yearly';
  features: string[];
  schedule: string;
}

export type NoticeCategory = 'general' | 'batch' | 'holiday' | 'exam';

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  pinned: boolean;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any;
}

export type BlogCategory = 'exam-prep' | 'study-tips' | 'career-guide' | 'scholarship' | 'board-exams' | 'gov-exams';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: BlogCategory;
  imageUrl: string;
  author: string;
  views: number;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any;
}

export interface AdmissionRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
  message: string;
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
  createdAt: any;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: any;
}

export interface AppConfig {
  apkVersion: string;
  apkUrl: string;
  apkSize: string;
  releaseNotes?: string;
  releaseDate?: string;
  bannerTitle: string;
  bannerSubtitle: string;
  whatsappUrl: string;
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
  enableAds?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  achievement?: string;
}

export interface FreeResource {
  id: string;
  title: string;
  category: 'notes' | 'pdfs' | 'syllabus' | 'papers';
  classTarget: string;
  subject: string;
  downloadUrl: string;
  fileSize: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  spec: string;
  desc: string;
  imageUrl: string;
  subjectTag?: string;
}

