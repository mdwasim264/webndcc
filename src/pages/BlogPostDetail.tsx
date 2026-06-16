import React, { useEffect, useState } from 'react';
import { ChevronLeft, Calendar, User, Eye, Sparkles, MessageCircle } from 'lucide-react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import Markdown from 'react-markdown';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { BlogPost } from '../types';
import AdvertSpace from '../components/AdvertSpace';

interface BlogPostDetailProps {
  blogId: string;
  onBack: () => void;
  whatsappUrl: string;
  enableAds?: boolean;
}

export default function BlogPostDetail({ blogId, onBack, whatsappUrl, enableAds }: BlogPostDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const docRef = doc(db, 'blogs', blogId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const loaded = { id: docSnap.id, ...docSnap.data() } as BlogPost;
          setPost(loaded);

          // Increment public views safely inside security rule permissions
          await updateDoc(docRef, {
            views: increment(1)
          });
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Failed blog retrieval:', err);
        handleFirestoreError(err, OperationType.GET, `blogs/${blogId}`);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [blogId]);

  if (loading) {
    return (
      <div className="text-center py-24 space-y-2 max-w-7xl mx-auto">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400 font-mono">Retrieving core concepts map...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 max-w-7xl mx-auto space-y-4">
        <h4 className="text-sm font-bold text-slate-700">Article mapping error</h4>
        <button onClick={onBack} className="text-xs text-blue-600 underline">Return to articles feed</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
      
      {/* Return button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to SEO Articles Feed</span>
      </button>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
          {post.title}
        </h1>
        
        {/* Author metadata */}
        <div className="flex flex-wrap items-center gap-4 text-2xs md:text-xs text-slate-500 dark:text-slate-400 font-mono border-b border-slate-100 dark:border-slate-900 pb-4">
          <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded font-sans font-semibold capitalize text-3xs">
            {post.category.replace('-', ' ')}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-blue-500" />
            By: {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-500" />
            {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Active Article'}
          </span>
          <span className="flex items-center gap-1.5 ml-auto">
            <Eye className="w-4 h-4 text-blue-500" />
            {post.views || 0} read iterations
          </span>
        </div>
      </div>

      {/* Big Hero Head image */}
      {post.imageUrl && (
        <div className="rounded-2xl overflow-hidden shadow-md max-h-[380px] bg-slate-100">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* In Article Monetization Banner */}
      <AdvertSpace position="in-article" showAds={enableAds} />

      {/* Render Markdown Content */}
      <article className="prose dark:prose-invert max-w-none font-sans text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300 space-y-6">
        <div className="markdown-body">
          <Markdown>{post.content}</Markdown>
        </div>
      </article>

      {/* Live Telegram/WhatsApp promo bottom */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-150 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-3xs uppercase font-mono tracking-widest text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 justify-center sm:justify-start">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Direct study updates
          </span>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 font-sans mt-1">
            Enjoying this study booklet? Share with friends or join WhatsApp!
          </p>
        </div>
        <button 
          onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
          className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs cursor-pointer tracking-wider font-mono uppercase"
        >
          <MessageCircle className="w-4.5 h-4.5" />
          <span>Join WhatsApp Forum</span>
        </button>
      </div>

    </div>
  );
}
