'use client';

import { useState } from 'react';
import { Video, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';
import { tourAPI } from '@/lib/features';

const PROVIDERS = [
  { name: 'Matterport', example: 'https://my.matterport.com/show/?m=SxQL3iGyvde', color: '#E91E8C' },
  { name: 'YouTube',    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',  color: '#FF0000' },
  { name: 'Vimeo',      example: 'https://vimeo.com/123456789',                   color: '#1AB7EA' },
  { name: 'Kuula',      example: 'https://kuula.co/share/...',                    color: '#FF6B35' },
];

interface Props {
  listingId: string;
  currentUrl: string | null;
  onSaved:    (url: string | null) => void;
}

export function TourUrlEditor({ listingId, currentUrl, onSaved }: Props) {
  const [url,    setUrl]    = useState(currentUrl || '');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle'|'ok'|'err'>('idle');
  const [errMsg, setErrMsg] = useState('');

  async function save() {
    setSaving(true);
    setStatus('idle');
    try {
      const trimmed = url.trim() || null;
      await tourAPI.setUrl(listingId, trimmed);
      setStatus('ok');
      onSaved(trimmed);
      setTimeout(() => setStatus('idle'), 2500);
    } catch (e: any) {
      setErrMsg(e?.response?.data?.message || 'Invalid URL or unsupported provider');
      setStatus('err');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    try {
      await tourAPI.setUrl(listingId, null);
      setUrl('');
      onSaved(null);
      setStatus('ok');
      setTimeout(() => setStatus('idle'), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-[#111C28] border border-[#1A2D40] p-5">
      <div className="flex items-center gap-2 mb-1">
        <Video size={14} className="text-[#00D4C8]" />
        <span className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase font-mono">
          Virtual Tour URL
        </span>
      </div>
      <p className="text-xs text-[#4A6580] mb-4 font-mono">
        Paste a Matterport, YouTube, Vimeo, or Kuula URL. Buyers will see an embedded tour on the property page.
      </p>

      {/* Input row */}
      <div className="flex gap-2 mb-3">
        <input
          type="url"
          value={url}
          onChange={e => { setUrl(e.target.value); setStatus('idle'); }}
          placeholder="https://my.matterport.com/show/?m=..."
          className="flex-1 bg-[#0D1821] border border-[#1A2D40] text-white text-sm px-3 py-2 outline-none focus:border-[#00D4C8] font-mono placeholder-[#2A3D52] transition-colors"
        />
        {currentUrl && (
          <button
            onClick={remove}
            disabled={saving}
            className="border border-[rgba(255,77,106,0.3)] text-[#FF4D6A] px-3 py-2 text-xs hover:bg-[rgba(255,77,106,0.1)] transition-colors disabled:opacity-40"
            title="Remove tour"
          >
            <X size={14} />
          </button>
        )}
        <button
          onClick={save}
          disabled={saving || !url.trim()}
          className="bg-[#00D4C8] text-[#080F17] px-4 py-2 text-xs font-bold hover:bg-[#00B8AD] disabled:opacity-40 transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* Status feedback */}
      {status === 'ok' && (
        <div className="flex items-center gap-1.5 text-xs text-[#2ECC8A] font-mono">
          <CheckCircle2 size={12} /> Tour URL saved
          {url && <a href={url} target="_blank" rel="noopener noreferrer" className="ml-2 underline opacity-70"><ExternalLink size={10} className="inline" /> Preview</a>}
        </div>
      )}
      {status === 'err' && (
        <div className="flex items-center gap-1.5 text-xs text-[#FF4D6A] font-mono">
          <AlertCircle size={12} /> {errMsg}
        </div>
      )}

      {/* Provider chips */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {PROVIDERS.map(p => (
          <button
            key={p.name}
            onClick={() => setUrl(p.example)}
            className="text-[9px] font-mono px-2 py-0.5 border border-[#1A2D40] text-[#4A6580] hover:border-[#00D4C8] hover:text-[#00D4C8] transition-colors"
            title={`Use ${p.name} example URL`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
