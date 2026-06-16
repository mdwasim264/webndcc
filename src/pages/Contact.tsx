import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckSquare, Loader2, Sparkles } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface ContactProps {
  whatsappUrl: string;
}

export default function Contact({ whatsappUrl }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorText('Please fill in Name, Email, and your Message details.');
      return;
    }

    setErrorText('');
    setLoading(true);

    try {
      await addDoc(collection(db, 'messages'), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || 'not_provided',
        subject: subject.trim() || 'General Website Feedback',
        message: message.trim(),
        status: 'unread',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorText('Temporary database sync timeout. Make sure you are online, or contact us directly on WhatsApp.');
      handleFirestoreError(err, OperationType.CREATE, 'messages');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-12">
      
      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-3xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
          REACH US
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Get in Touch Instantly
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
          Have queries regarding class XII board timings, formula sheets, or admission terms? Connect with us through the form, call our helpline, or click to join the chat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        
        {/* Left Side: Detail Cards & Maps */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card list */}
          <div className="grid grid-cols-1 gap-4">
            
            <a 
              href="tel:+919999999999"
              className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-900 flex items-start gap-4 hover:border-blue-500 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xs font-mono font-bold text-slate-450 uppercase">Helpline Telephone</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-500 transition-colors">+91 99999 99999</span>
                <p className="text-3xs text-slate-500 mt-1">Available 09:00 AM to 07:00 PM (Monday to Saturday)</p>
              </div>
            </a>

            <a 
              href="mailto:contact@newdirectioncoaching.com"
              className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-900 flex items-start gap-4 hover:border-blue-500 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xs font-mono font-bold text-slate-450 uppercase">Admissions Email</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-500 transition-colors">info@newdirection.com</span>
                <p className="text-3xs text-slate-500 mt-1">Send us mock papers requests, business terms or parent feedback sheets</p>
              </div>
            </a>

            <a 
              href={whatsappUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-900 flex items-start gap-4 hover:border-blue-500 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-2xs font-mono font-bold text-slate-450 uppercase">Instant WhatsApp Chat</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-500 transition-colors">Join WhatsApp Stream</span>
                <p className="text-3xs text-slate-500 mt-1">Access immediate daily notices, modified syllabus links, and PDFs</p>
              </div>
            </a>

          </div>

          {/* Interactive responsive maps */}
          <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-900 h-[280px] bg-slate-100 shadow-3xs">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14392.213271780447!2d85.1537237!3d25.6030999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58f278d91ea1%3A0xd68b209e735492d!2sRajendra%20Nagar%20Terminal%20Railway%20Station!5e0!3m2!1sen!2sin!4v1718501234321!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="HQ Location Direction Map"
            ></iframe>
          </div>

        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-150 dark:border-slate-900 shadow-2xs">
          
          <div className="flex items-center gap-2.5 mb-6 border-b border-dashed border-slate-100 dark:border-slate-900 pb-4">
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Send a Support Ticket</h3>
              <p className="text-3xs text-slate-500 uppercase tracking-widest font-mono font-medium">Free coordination, no login required</p>
            </div>
          </div>

          {success ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
              <CheckSquare className="w-16 h-16 text-emerald-500" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Your message is securely queued!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                Thank you! Your helpdesk request is logged in Firestore, and our academic advisors will reach out to you within one business day.
              </p>
              <button 
                onClick={() => {
                  setSuccess(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setSubject('');
                  setMessage('');
                }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold leading-none select-none cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {errorText && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-3xs text-rose-600 rounded">
                  {errorText}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 dark:text-slate-505 mb-1.5 font-bold">
                    your name *
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Dr. Alok" 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-hidden text-slate-800 dark:text-slate-100 placeholder:text-slate-450 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 dark:text-slate-505 mb-1.5 font-bold">
                    Email address *
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com" 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-hidden text-slate-800 dark:text-slate-100 placeholder:text-slate-450 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 dark:text-slate-505 mb-1.5 font-bold">
                    Phone / Whatsapp (optional)
                  </label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.g. +91 9999999999" 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-hidden text-slate-800 dark:text-slate-100 placeholder:text-slate-450 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 dark:text-slate-505 mb-1.5 font-bold">
                    Subject / Concern
                  </label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="E.g. Batch Timings question" 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-hidden text-slate-800 dark:text-slate-100 placeholder:text-slate-450 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-3xs font-mono uppercase tracking-wide text-slate-400 dark:text-slate-505 mb-1.5 font-bold">
                  Write message details *
                </label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details of your academic query or admissions terms..." 
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden text-slate-800 dark:text-slate-100 placeholder:text-slate-450 focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <div className="pt-2 text-3xs text-slate-405 leading-relaxed font-sans">
                ⚠️ All submitted queries are publicly tracked inside the admin console safely. Do not send passwords or credentials maps.
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 uppercase font-mono"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 stroke-2" />
                )}
                <span>Send Support Ticket</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
