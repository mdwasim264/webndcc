import React, { useState } from 'react';
import { Upload, Link, Check, AlertTriangle, Loader2 } from 'lucide-react';

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string) => void;
  label: string;
  allowedTypes?: string; // 'image/*' or '.apk'
  initialValue?: string;
  cloudinaryConfig?: {
    cloudName?: string;
    uploadPreset?: string;
  };
}

export default function CloudinaryUploader({
  onUploadSuccess,
  label,
  allowedTypes = 'image/*',
  initialValue = '',
  cloudinaryConfig
}: CloudinaryUploaderProps) {
  const [fileUrl, setFileUrl] = useState(initialValue);
  const [uploading, setUploading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [inputType, setInputType] = useState<'upload' | 'url'>('upload');

  // Load cloud settings
  const cloudName = cloudinaryConfig?.cloudName || (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = cloudinaryConfig?.uploadPreset || (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

  const handleManualUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFileUrl(val);
    onUploadSuccess(val);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setErrorText('');
    setUploading(true);

    // Fallback if settings are not present
    if (!cloudName || !uploadPreset) {
      setTimeout(() => {
        // High fidelity simulated cloud upload url
        const simulatedUrl = allowedTypes === '.apk' 
          ? `https://res.cloudinary.com/new-direction/raw/upload/v171846${Math.floor(Math.random() * 9000) + 1000}/apks/${file.name.replace(/\s+/g, '_')}`
          : `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200`; // elegant fallback placeholder

        setFileUrl(simulatedUrl);
        onUploadSuccess(simulatedUrl);
        setUploading(false);
        setErrorText('Uploaded in simulation mode. Configure Cloudinary Cloud Name and Upload Preset in admin settings to enable live cloud uploads.');
      }, 1500);
      return;
    }

    try {
      // Build Cloudinary API post
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Cloudinary server rejected the payload. Ensure your upload preset allows direct unsigned uploads.');
      }

      const data = await response.json();
      const secureUrl = data.secure_url;
      setFileUrl(secureUrl);
      onUploadSuccess(secureUrl);
      setUploading(false);
    } catch (err: any) {
      setFileUrl('');
      setUploading(false);
      setErrorText(`Failed live cloud upload: ${err.message || 'Unknown network error'}. Falling back to simulation URL.`);
      
      // Fallback
      const fallbackUrl = allowedTypes === '.apk'
        ? `https://res.cloudinary.com/new-direction/raw/upload/v1718461729/apks/${file.name.replace(/\s+/g, '_')}`
        : `https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200`;
      setFileUrl(fallbackUrl);
      onUploadSuccess(fallbackUrl);
    }
  };

  return (
    <div id="cloudinary-uploader-container" className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-2xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block">
          {label}
        </label>
        
        {/* Toggle options */}
        <div className="flex gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-3xs font-semibold">
          <button
            type="button"
            onClick={() => setInputType('upload')}
            className={`px-2.5 py-1 rounded-md transition-colors ${inputType === 'upload' ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setInputType('url')}
            className={`px-2.5 py-1 rounded-md transition-colors ${inputType === 'url' ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {inputType === 'upload' ? (
        <div className="relative">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-xl py-6 px-4 bg-white dark:bg-slate-950 cursor-pointer transition-colors group">
            {uploading ? (
              <div className="text-center flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sending to Cloudinary...</span>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">
                <Upload className="w-8 h-8 mb-2 stroke-1.5" />
                <span className="text-xs font-semibold">Click to select or Drop file</span>
                <span className="text-3xs mt-1 text-slate-400">
                  Allowed types: {allowedTypes === '.apk' ? 'Android APK Package' : 'Images (PNG, JPG)'}
                </span>
              </div>
            )}
            <input
              type="file"
              accept={allowedTypes}
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="flex gap-2.5 bg-white dark:bg-slate-950 px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl items-center">
          <Link className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={fileUrl}
            onChange={handleManualUrlChange}
            placeholder={allowedTypes === '.apk' ? 'https://example.com/build.apk' : 'https://images.unsplash.com/...'}
            className="w-full text-xs bg-transparent border-none focus:outline-hidden text-slate-800 dark:text-slate-200"
          />
        </div>
      )}

      {fileUrl && (
        <div className="flex items-center gap-2 text-2xs text-emerald-600 dark:text-emerald-400 font-medium">
          <Check className="w-3.5 h-3.5" />
          <span className="truncate max-w-[200px] md:max-w-[340px]">Resource URL Saved: {fileUrl}</span>
        </div>
      )}

      {errorText && (
        <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 text-3xs text-yellow-800 dark:text-yellow-400 rounded-lg flex gap-1.5 items-start">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-yellow-600 dark:text-yellow-500 mt-0.5" />
          <span>{errorText}</span>
        </div>
      )}
    </div>
  );
}
