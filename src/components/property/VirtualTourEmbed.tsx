'use client';

import { useState, useEffect } from 'react';
import { Play, Maximize2, ExternalLink } from 'lucide-react';

interface Props {
  tourUrl:   string;
  embedUrl:  string;
  shortCode: string;
  apiBase:   string;
}

const PROVIDER_LABELS: Record<string, { label: string; color: string }> = {
  'matterport': { label: '3D Matterport', color: '#E91E8C' },
  'youtube':    { label: 'YouTube Tour',  color: '#FF0000' },
  'vimeo':      { label: 'Vimeo Tour',    color: '#1AB7EA' },
  'kuula':      { label: 'Kuula 360°',    color: '#FF6B35' },
};

function detectProvider(url: string) {
  if (url.includes('matterport')) return 'matterport';
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo')) return 'vimeo';
  if (url.includes('kuula')) return 'kuula';
  return 'other';
}

export function VirtualTourEmbed({ tourUrl, embedUrl, shortCode, apiBase }: Props) {
  const [loaded,    setLoaded]    = useState(false);
  const [fullscreen,setFullscreen]= useState(false);
  const provider   = detectProvider(tourUrl);
  const providerMeta = PROVIDER_LABELS[provider] || { label: 'Virtual Tour', color: '#333' };

  // Track view when iframe loads
  useEffect(() => {
    if (!loaded) return;
    fetch(`${apiBase}/tours/view/${shortCode}`, { method: 'POST' }).catch(() => {});
  }, [loaded]);

  return (
    <div className="bg-white -mx-4 mt-3 border-b border-[#EEE]">
      {/* Section header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#EEE]">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: providerMeta.color }}
          />
          <span className="text-[10px] font-black tracking-[2px] text-[#999] uppercase">
            {providerMeta.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={tourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-[#999] hover:text-[#333] transition-colors"
          >
            <ExternalLink size={11} /> Open in new tab
          </a>
          <button
            onClick={() => setFullscreen(f => !f)}
            className="flex items-center gap-1 text-[10px] text-[#999] hover:text-[#333] transition-colors"
          >
            <Maximize2 size={11} /> {fullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* Thumbnail / play gate */}
      {!loaded ? (
        <button
          onClick={() => setLoaded(true)}
          className="relative w-full flex items-center justify-center bg-[#1C1C1C] group"
          style={{ height: '220px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="relative flex flex-col items-center gap-2 text-white z-10">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ background: providerMeta.color }}
            >
              <Play size={22} fill="white" />
            </div>
            <div className="text-sm font-bold">Click to load {providerMeta.label}</div>
            <div className="text-xs opacity-60">Interactive 3D / 360° experience</div>
          </div>
        </button>
      ) : (
        <div
          className={`relative w-full ${fullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}
          style={{ height: fullscreen ? '100vh' : '56.25vw', maxHeight: fullscreen ? '100vh' : '360px' }}
        >
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking; fullscreen"
            allowFullScreen
            loading="lazy"
            title="Virtual Tour"
          />
          {fullscreen && (
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 text-xs font-bold z-10"
            >
              ✕ Close
            </button>
          )}
        </div>
      )}
    </div>
  );
}
