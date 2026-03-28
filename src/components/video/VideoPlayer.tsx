'use client';
import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Upload, Trash2, Loader2, Film } from 'lucide-react';
import { videoAPI, type ListingVideo } from '@/lib/features';

// ── VideoPlayer ───────────────────────────────────────────────────────────────
export function VideoPlayer({ video, className = '' }: { video: ListingVideo; className?: string }) {
  const ref  = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [muted, setMuted]       = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else         { ref.current.play(); setPlaying(true); }
  };

  const onTimeUpdate = () => {
    if (!ref.current) return;
    setProgress((ref.current.currentTime / ref.current.duration) * 100);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    ref.current.currentTime = ((e.clientX - rect.left) / rect.width) * ref.current.duration;
  };

  const fmt = (s?: number) => {
    if (!s) return '0:00';
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative bg-black rounded-2xl overflow-hidden group ${className}`}>
      <video
        ref={ref} src={video.url} poster={video.thumbnail_url || undefined}
        onTimeUpdate={onTimeUpdate} onEnded={() => setPlaying(false)}
        muted={muted} playsInline className="w-full aspect-video object-contain"
      />
      {/* Controls overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
        {/* Progress bar */}
        <div className="h-1 bg-white/20 rounded-full mb-3 cursor-pointer" onClick={seek}>
          <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
            {playing ? <Pause size={14} fill="white" color="white" /> : <Play size={14} fill="white" color="white" />}
          </button>
          <button onClick={() => { setMuted(!muted); if (ref.current) ref.current.muted = !muted; }}
            className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
            {muted ? <VolumeX size={13} color="white" /> : <Volume2 size={13} color="white" />}
          </button>
          <span className="text-xs text-white/70 ml-auto">
            {fmt(ref.current?.currentTime)} / {fmt(video.duration_seconds)}
          </span>
          <button onClick={() => ref.current?.requestFullscreen()}
            className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
            <Maximize2 size={13} color="white" />
          </button>
        </div>
      </div>
      {!playing && (
        <button onClick={toggle}
          className="absolute inset-0 flex items-center justify-center group/play">
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover/play:bg-black/70 transition-all">
            <Play size={22} fill="white" color="white" className="ml-1" />
          </div>
        </button>
      )}
      <div className="absolute top-3 left-3 text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
        {video.label}
      </div>
    </div>
  );
}

// ── VideoUploader ─────────────────────────────────────────────────────────────
interface VideoUploaderProps {
  listingId: string;
  videos: ListingVideo[];
  onUploaded: (v: ListingVideo) => void;
  onDeleted: (id: string) => void;
  maxVideos?: number;
}

export function VideoUploader({ listingId, videos, onUploaded, onDeleted, maxVideos = 3 }: VideoUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (videos.length >= maxVideos) { setError(`Max ${maxVideos} videos per listing`); return; }
    if (file.size > 100 * 1024 * 1024) { setError('File exceeds 100MB'); return; }
    setError(''); setUploading(true); setUploadProgress(0);
    try {
      const res = await videoAPI.upload(listingId, file, setUploadProgress);
      onUploaded(res.data.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); setUploadProgress(0); }
  };

  const handleDelete = async (videoId: string) => {
    try { await videoAPI.delete(videoId); onDeleted(videoId); }
    catch { setError('Delete failed'); }
  };

  return (
    <div className="space-y-3">
      {/* Existing videos */}
      {videos.map((v) => (
        <div key={v.id} className="relative">
          <VideoPlayer video={v} />
          <button onClick={() => handleDelete(v.id)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/40 transition-all">
            <Trash2 size={12} />
          </button>
        </div>
      ))}

      {/* Upload area */}
      {videos.length < maxVideos && (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
            ${uploading ? 'border-cyan-500/40 bg-cyan-500/[0.03]' : 'border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/[0.02]'}`}
        >
          <input ref={fileRef} type="file" accept="video/mp4,video/quicktime,video/avi" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {uploading ? (
            <div>
              <Loader2 size={28} className="text-cyan-400 mx-auto mb-3 animate-spin" />
              <div className="text-sm font-semibold text-white mb-2">Uploading... {uploadProgress}%</div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <Film size={28} className="text-white/20 mx-auto mb-3" />
              <div className="text-sm font-semibold text-white mb-1">Upload Property Video</div>
              <div className="text-xs text-white/30">MP4, MOV or AVI · Max 100MB · {maxVideos - videos.length} slot{maxVideos - videos.length !== 1 ? 's' : ''} remaining</div>
            </>
          )}
        </div>
      )}
      {error && <div className="text-xs text-red-400 px-1">{error}</div>}
    </div>
  );
}
