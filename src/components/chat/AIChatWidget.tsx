'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, User, Bot, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { getSessionToken } from '@/lib/buyer';

interface Message { role: 'user' | 'assistant'; content: string; ts?: string; }

interface AIChatWidgetProps {
  listingId: string;
  listingTitle?: string;
  agentName?: string;
}

export function AIChatWidget({ listingId, listingTitle, agentName }: AIChatWidgetProps) {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showCapture, setCapture] = useState(false);
  const [captured, setCaptured]   = useState(false);
  const [captureForm, setCapForm] = useState({ name: '', phone: '', email: '' });
  const [captureLoading, setCapL] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load history on open
  useEffect(() => {
    if (!open || messages.length) return;
    const token = getSessionToken();
    api.get(`/v3/listings/${listingId}/chat/history`, { headers: { 'x-session-token': token } })
      .then((r) => {
        if (r.data.data.messages.length) {
          setMessages(r.data.data.messages);
          if (r.data.data.lead_captured) setCaptured(true);
        } else {
          setMessages([{ role: 'assistant', content: `Hi! 👋 I'm your AI assistant for this property. Ask me anything about ${listingTitle || 'this listing'} — price, location, amenities, or to schedule a visit!` }]);
        }
      }).catch(() => {});
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages((p) => [...p, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const token = getSessionToken();
      const res = await api.post(`/v3/listings/${listingId}/chat`,
        { message: msg },
        { headers: { 'x-session-token': token } }
      );
      const { message, leadCapture, sessionId: sid } = res.data.data;
      setMessages((p) => [...p, { role: 'assistant', content: message }]);
      if (sid) setSessionId(sid);
      if (leadCapture && !captured) setTimeout(() => setCapture(true), 800);
    } catch {
      setMessages((p) => [...p, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again or contact the agent directly." }]);
    }
    finally { setLoading(false); }
  };

  const captureLead = async () => {
    if (!captureForm.name || !captureForm.phone) return;
    setCapL(true);
    try {
      await api.post('/v3/chat/capture-lead', { sessionId, ...captureForm });
      setCaptured(true);
      setCapture(false);
      setMessages((p) => [...p, { role: 'assistant', content: `✅ Got it, ${captureForm.name}! ${agentName || 'The agent'} will call you at ${captureForm.phone} soon.` }]);
    } catch (_) {}
    finally { setCapL(false); }
  };

  const QUICK_QUESTIONS = [
  "What's the price?",
  "Is parking available?",
  "Schedule a visit"
];

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-24 right-4 lg:bottom-8 lg:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-[0_4px_20px_rgba(0,212,200,0.4)] flex items-center justify-center hover:scale-110 transition-all active:scale-95 group">
          <MessageCircle size={22} color="black" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#07090D] animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 w-[340px] max-w-[calc(100vw-32px)] bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300"
          style={{ maxHeight: 520 }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[#0C1018] border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 border rounded-full bg-cyan-500/20 border-cyan-500/30">
              <Bot size={14} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white">AI Property Assistant</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[9px] text-green-400/80">Online · Replies instantly</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="transition-colors text-white/30 hover:text-white/60"><X size={16} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 p-4 space-y-3 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5
                  ${m.role === 'user' ? 'bg-white/10' : 'bg-cyan-500/20 border border-cyan-500/30'}`}>
                  {m.role === 'user' ? <User size={11} className="text-white/60" /> : <Bot size={11} className="text-cyan-400" />}
                </div>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed
                  ${m.role === 'user'
                    ? 'bg-cyan-500 text-black font-medium rounded-tr-sm'
                    : 'bg-white/[0.06] text-white/80 rounded-tl-sm border border-white/[0.06]'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="flex items-center justify-center w-6 h-6 border rounded-full bg-cyan-500/20 border-cyan-500/30">
                  <Bot size={11} className="text-cyan-400" />
                </div>
                <div className="bg-white/[0.06] border border-white/[0.06] px-3 py-2 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    {[0,1,2].map((i) => <div key={i} className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}

            {/* Lead capture prompt */}
            {showCapture && !captured && (
              <div className="bg-cyan-500/[0.08] border border-cyan-500/20 rounded-2xl p-3 space-y-2">
                <div className="text-xs font-semibold text-cyan-400">Leave your details for a callback</div>
                <input value={captureForm.name} onChange={(e) => setCapForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name" className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-cyan-500/40" />
                <input value={captureForm.phone} onChange={(e) => setCapForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="Phone number" className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-cyan-500/40" />
                <div className="flex gap-2">
                  <button onClick={() => setCapture(false)} className="flex-1 py-2 text-xs font-semibold transition-colors rounded-xl text-white/40 hover:text-white/60">Skip</button>
                  <button onClick={captureLead} disabled={captureLoading || !captureForm.name || !captureForm.phone}
                    className="flex items-center justify-center flex-1 gap-1 py-2 text-xs font-bold text-black transition-all rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50">
                    {captureLoading ? <Loader2 size={11} className="animate-spin" /> : <><CheckCircle2 size={11} /> Submit</>}
                  </button>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex gap-1.5 flex-wrap flex-shrink-0">
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} onClick={() => { setInput(q); }}
                  className="text-[10px] text-cyan-400/70 border border-cyan-500/20 bg-cyan-500/[0.06] px-2.5 py-1 rounded-full hover:bg-cyan-500/10 transition-all">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center flex-shrink-0 gap-2 px-3 pb-3">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
              placeholder="Ask about this property..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-cyan-500/30 transition-all" />
            <button onClick={send} disabled={!input.trim() || loading}
              className="flex items-center justify-center transition-all w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 disabled:opacity-40">
              {loading ? <Loader2 size={14} className="text-black animate-spin" /> : <Send size={14} className="text-black" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
