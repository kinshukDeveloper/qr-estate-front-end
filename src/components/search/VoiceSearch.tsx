'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Search, Loader2 } from 'lucide-react';
import { voiceSearchAPI, type VoiceSearchFilters } from '@/lib/buyer';

interface VoiceSearchProps {
  onResults: (listings: any[], filters: VoiceSearchFilters) => void;
  onClose?: () => void;
  className?: string;
}

type MicState = 'idle' | 'listening' | 'processing' | 'error';

// Check browser support
const hasSpeechAPI = () =>
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

export function VoiceSearch({ onResults, onClose, className = '' }: VoiceSearchProps) {
  const [micState, setMicState] = useState<MicState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [parsedFilters, setParsedFilters] = useState<VoiceSearchFilters | null>(null);
  const [error, setError] = useState('');
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setSupported(hasSpeechAPI());
  }, []);

  const startListening = useCallback(() => {
    if (!hasSpeechAPI()) {
      setError('Voice search not supported in this browser. Try Chrome.');
      setMicState('error');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';  // Indian English
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setMicState('listening');
      setTranscript('');
      setInterimTranscript('');
      setError('');
      setParsedFilters(null);
    };

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) final += result[0].transcript;
        else interim += result[0].transcript;
      }
      if (final) setTranscript((prev) => prev + final);
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setError('No speech detected. Try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied.');
      } else {
        setError(`Mic error: ${event.error}`);
      }
      setMicState('error');
    };

    recognition.onend = async () => {
      setInterimTranscript('');
      const finalTranscript = transcript || '';
      if (finalTranscript.trim().length < 3) {
        setMicState('idle');
        return;
      }
      await processSearch(finalTranscript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [transcript]);

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const processSearch = async (text: string) => {
    setMicState('processing');
    try {
      const res = await voiceSearchAPI.search(text);
      const { listings, filters } = res.data.data;
      setParsedFilters(filters);
      onResults(listings, filters);
      setMicState('idle');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Search failed. Try again.');
      setMicState('error');
    }
  };

  const handleManualSearch = () => {
    if (transcript.trim().length >= 3) processSearch(transcript);
  };

  const reset = () => {
    setTranscript('');
    setInterimTranscript('');
    setParsedFilters(null);
    setError('');
    setMicState('idle');
    recognitionRef.current?.abort();
  };

  if (!supported) {
    return (
      <div className={`flex items-center gap-2 text-white/30 text-xs ${className}`}>
        <MicOff size={14} />
        <span>Voice search not available</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        onClick={micState === 'listening' ? stopListening : micState === 'idle' || micState === 'error' ? startListening : undefined}
        disabled={micState === 'processing'}
        title="Voice search"
        className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200
          ${micState === 'listening'
            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
            : micState === 'processing'
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 cursor-not-allowed'
            : 'bg-white/[0.04] text-white/50 border border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20'
          }
          active:scale-95`}
      >
        {micState === 'processing' ? (
          <Loader2 size={15} className="animate-spin" />
        ) : micState === 'listening' ? (
          <>
            <Mic size={15} />
            {/* Pulse rings */}
            <span className="absolute inset-0 rounded-xl animate-ping bg-red-400/20 pointer-events-none" />
          </>
        ) : (
          <Mic size={15} />
        )}
      </button>

      {/* Expanded panel (shown while listening or has transcript) */}
      {(micState !== 'idle' || transcript || error) && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Status bar */}
          <div className={`px-4 py-3 border-b border-white/[0.06] flex items-center gap-2.5
            ${micState === 'listening' ? 'bg-red-500/[0.04]' : micState === 'processing' ? 'bg-cyan-500/[0.04]' : 'bg-transparent'}`}>
            <div className={`flex-shrink-0 w-2 h-2 rounded-full
              ${micState === 'listening' ? 'bg-red-400 animate-pulse' : micState === 'processing' ? 'bg-cyan-400 animate-pulse' : 'bg-white/20'}`} />
            <span className="text-xs font-medium text-white/60">
              {micState === 'listening' ? 'Listening...' :
               micState === 'processing' ? 'Searching...' :
               micState === 'error' ? 'Error' : 'Done'}
            </span>
            <button onClick={reset} className="ml-auto text-white/30 hover:text-white/60 transition-colors">
              <X size={13} />
            </button>
          </div>

          {/* Transcript display */}
          <div className="px-4 py-3 min-h-[48px]">
            {error ? (
              <p className="text-xs text-red-400">{error}</p>
            ) : (
              <p className="text-sm text-white leading-relaxed">
                {transcript}
                {interimTranscript && (
                  <span className="text-white/30"> {interimTranscript}</span>
                )}
                {!transcript && !interimTranscript && (
                  <span className="text-white/20 italic">
                    Try: "3BHK apartment in Andheri under 2 crore for sale"
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Parsed filters chips */}
          {parsedFilters && Object.values(parsedFilters).some(Boolean) && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {Object.entries(parsedFilters).map(([key, val]) => {
                if (!val) return null;
                const label = key === 'min_price' ? `Min ₹${formatPrice(val as number)}`
                  : key === 'max_price' ? `Max ₹${formatPrice(val as number)}`
                  : key === 'listing_type' ? (val as string).toUpperCase()
                  : key === 'bedrooms' ? `${val} BHK`
                  : String(val);
                return (
                  <span key={key} className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-full font-medium">
                    {label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Action buttons */}
          {transcript && micState !== 'listening' && (
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => { reset(); startListening(); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/10 transition-all"
              >
                <Mic size={12} />
                Try again
              </button>
              {micState !== 'processing' && (
                <button
                  onClick={handleManualSearch}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-all active:scale-95"
                >
                  <Search size={12} />
                  Search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(0)}L`;
  return price.toLocaleString('en-IN');
}
