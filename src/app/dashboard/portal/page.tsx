'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key, Webhook, Plus, Trash2, Copy, Check,
  Eye, EyeOff, ExternalLink, RefreshCw, Globe,
  AlertCircle, CheckCircle2, Loader2, ChevronDown,
} from 'lucide-react';
import api from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ApiKey { id:string; name:string; key_preview:string; scopes:string[]; rate_limit:number; is_active:boolean; usage_count:number; last_used_at:string|null; expires_at:string|null; created_at:string; key?:string }
interface Webhook { id:string; name:string; url:string; events:string[]; is_active:boolean; success_count:number; fail_count:number; last_triggered_at:string|null }

const ALL_SCOPES  = ['listings:read','leads:read','analytics:read','qr:read'];
const ALL_EVENTS  = ['listing.created','listing.updated','listing.deleted','listing.sold','lead.created','lead.updated','qr.scanned','callback.missed'];

const INPUT = "w-full bg-[#0D1821] border border-[#1A2D40] text-white text-sm px-3 py-2 outline-none focus:border-[#00D4C8] transition-colors placeholder-[#2A3D52] font-mono";

function Badge({ label, color }: { label:string; color:string }) {
  return <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 border" style={{ color, borderColor: color + '40', background: color + '12' }}>{label}</span>;
}

function CopyChip({ text }: { text:string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
      className="flex items-center gap-1 text-[10px] font-mono text-[#4A6580] hover:text-[#00D4C8] transition-colors">
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ── API Keys tab ───────────────────────────────────────────────────────────────
function ApiKeysTab() {
  const [keys, setKeys]       = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newScopes, setNewScopes] = useState<string[]>(['listings:read']);
  const [newKey, setNewKey]   = useState<string|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [err, setErr]         = useState('');

  useEffect(() => { api.get('/portal/keys').then(r => setKeys(r.data.data.keys)).finally(() => setLoading(false)); }, []);

  async function create() {
    if (!newName.trim()) return;
    setCreating(true); setErr('');
    try {
      const r = await api.post('/portal/keys', { name: newName, scopes: newScopes });
      setNewKey(r.data.data.key.key);
      setKeys(prev => [r.data.data.key, ...prev]);
      setNewName(''); setShowForm(false);
    } catch (e:any) { setErr(e?.response?.data?.message || 'Failed'); }
    finally { setCreating(false); }
  }

  async function revoke(id: string) {
    if (!confirm('Revoke this API key? Any integrations using it will stop working.')) return;
    await api.delete(`/portal/keys/${id}`);
    setKeys(prev => prev.map(k => k.id === id ? { ...k, is_active: false } : k));
  }

  const toggleScope = (s:string) => setNewScopes(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev,s]);

  return (
    <div className="space-y-4">
      {/* New key reveal */}
      <AnimatePresence>
        {newKey && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="bg-[rgba(0,212,200,0.06)] border border-[#00D4C8]/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={14} className="text-[#00D4C8]" />
              <span className="text-[#00D4C8] font-bold text-sm">API key created — copy it now!</span>
            </div>
            <div className="flex items-center gap-3 bg-[#060C12] px-3 py-2">
              <code className="flex-1 text-[#2ECC8A] font-mono text-xs break-all">{newKey}</code>
              <CopyChip text={newKey} />
            </div>
            <p className="text-[10px] text-[#FFB830] font-mono mt-2">⚠ This key will never be shown again. Copy it before closing.</p>
            <button onClick={() => setNewKey(null)} className="text-[10px] text-[#4A6580] mt-2 underline">I've saved it — dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#4A6580] font-mono">Max 10 active keys. Use Bearer authentication in your integration.</p>
        <button onClick={() => setShowForm(f => !f)} className="flex items-center gap-1.5 text-xs font-bold text-[#00D4C8] border border-[rgba(0,212,200,0.3)] px-3 py-1.5 hover:bg-[rgba(0,212,200,0.06)] transition-colors">
          <Plus size={13} /> New Key
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden">
            <div className="bg-[#0D1821] border border-[#1A2D40] p-4 space-y-3">
              <input className={INPUT} value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Name (e.g. MagicBricks Integration)" />
              <div>
                <p className="text-[10px] font-mono text-[#4A6580] uppercase tracking-wide mb-2">Scopes (permissions)</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_SCOPES.map(s => (
                    <button key={s} type="button" onClick={() => toggleScope(s)}
                      className={`text-[10px] font-mono px-2 py-1 border transition-colors ${newScopes.includes(s) ? 'border-[#00D4C8] text-[#00D4C8] bg-[rgba(0,212,200,0.08)]' : 'border-[#1A2D40] text-[#4A6580]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {err && <p className="text-xs text-[#FF4D6A] font-mono">{err}</p>}
              <div className="flex gap-2">
                <button onClick={create} disabled={creating || !newName.trim()} className="bg-[#00D4C8] text-[#080F17] px-4 py-2 text-xs font-bold hover:bg-[#00B8AD] disabled:opacity-40 transition-colors flex items-center gap-1.5">
                  {creating ? <><Loader2 size={12} className="animate-spin" /> Creating…</> : 'Create Key'}
                </button>
                <button onClick={() => setShowForm(false)} className="text-xs text-[#4A6580] px-3 py-2 border border-[#1A2D40] hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keys list */}
      {loading ? <div className="text-sm text-[#4A6580] text-center py-8 font-mono">Loading keys…</div> : keys.length === 0 ? (
        <div className="text-center py-12 text-[#4A6580]"><Key size={32} strokeWidth={1} className="mx-auto mb-2" /><p className="text-sm">No API keys yet. Create one to start integrating.</p></div>
      ) : (
        <div className="space-y-2">
          {keys.map(k => (
            <div key={k.id} className={`bg-[#0D1821] border ${k.is_active ? 'border-[#1A2D40]' : 'border-[#1A2D40] opacity-50'} p-4`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-white">{k.name}</span>
                    {!k.is_active && <Badge label="REVOKED" color="#FF4D6A" />}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <code className="font-mono text-xs text-[#4A6580]">{k.key_preview}</code>
                    <span className="text-[10px] text-[#4A6580] font-mono">{k.usage_count.toLocaleString()} requests</span>
                    {k.last_used_at && <span className="text-[10px] text-[#4A6580] font-mono">Last used: {new Date(k.last_used_at).toLocaleDateString('en-IN')}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {k.scopes.map(s => <Badge key={s} label={s} color="#60A5FA" />)}
                  </div>
                </div>
                {k.is_active && (
                  <button onClick={() => revoke(k.id)} className="text-[#FF4D6A] hover:bg-[rgba(255,77,106,0.1)] p-1.5 transition-colors flex-shrink-0" title="Revoke key">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Webhooks tab ───────────────────────────────────────────────────────────────
function WebhooksTab() {
  const [hooks,    setHooks]    = useState<Webhook[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [err,      setErr]      = useState('');
  const [secret,   setSecret]   = useState<string|null>(null);
  const [form,     setForm]     = useState({ name:'', url:'', events:['lead.created'] });

  useEffect(() => { api.get('/portal/webhooks').then(r => setHooks(r.data.data.webhooks)).finally(() => setLoading(false)); }, []);

  async function create() {
    if (!form.name.trim() || !form.url.trim()) return;
    setCreating(true); setErr('');
    try {
      const r = await api.post('/portal/webhooks', form);
      setSecret(r.data.data.webhook.secret);
      setHooks(prev => [r.data.data.webhook, ...prev]);
      setForm({ name:'', url:'', events:['lead.created'] });
      setShowForm(false);
    } catch (e:any) { setErr(e?.response?.data?.message || 'Failed'); }
    finally { setCreating(false); }
  }

  async function del(id:string) {
    if (!confirm('Delete this webhook?')) return;
    await api.delete(`/portal/webhooks/${id}`);
    setHooks(prev => prev.filter(h => h.id !== id));
  }

  const toggleEvent = (e:string) => setForm(f => ({...f, events: f.events.includes(e) ? f.events.filter(x=>x!==e) : [...f.events,e]}));

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {secret && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="bg-[rgba(167,139,250,0.06)] border border-[#A78BFA]/30 p-4">
            <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={14} className="text-[#A78BFA]" /><span className="text-[#A78BFA] font-bold text-sm">Webhook created — save your signing secret!</span></div>
            <div className="flex items-center gap-3 bg-[#060C12] px-3 py-2"><code className="flex-1 text-[#2ECC8A] font-mono text-xs break-all">{secret}</code><CopyChip text={secret} /></div>
            <p className="text-[10px] text-[#FFB830] font-mono mt-2">Verify webhook signatures: <code>HMAC-SHA256(secret, body) === X-QRE-Signature</code></p>
            <button onClick={() => setSecret(null)} className="text-[10px] text-[#4A6580] mt-2 underline">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#4A6580] font-mono">Receive HTTP POST events when things happen in QR Estate.</p>
        <button onClick={() => setShowForm(f => !f)} className="flex items-center gap-1.5 text-xs font-bold text-[#A78BFA] border border-[rgba(167,139,250,0.3)] px-3 py-1.5 hover:bg-[rgba(167,139,250,0.06)] transition-colors">
          <Plus size={13} /> Add Webhook
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden">
            <div className="bg-[#0D1821] border border-[#1A2D40] p-4 space-y-3">
              <input className={INPUT} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Name (e.g. Lead Notifications)" />
              <input className={INPUT} value={form.url}  onChange={e=>setForm(f=>({...f,url:e.target.value}))}  placeholder="https://your-server.com/webhook" />
              <div>
                <p className="text-[10px] font-mono text-[#4A6580] uppercase tracking-wide mb-2">Events to subscribe to</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_EVENTS.map(ev => (
                    <button key={ev} type="button" onClick={() => toggleEvent(ev)}
                      className={`text-[10px] font-mono px-2 py-1 border transition-colors ${form.events.includes(ev) ? 'border-[#A78BFA] text-[#A78BFA] bg-[rgba(167,139,250,0.08)]' : 'border-[#1A2D40] text-[#4A6580]'}`}>
                      {ev}
                    </button>
                  ))}
                </div>
              </div>
              {err && <p className="text-xs text-[#FF4D6A] font-mono">{err}</p>}
              <div className="flex gap-2">
                <button onClick={create} disabled={creating} className="bg-[#A78BFA] text-[#080F17] px-4 py-2 text-xs font-bold hover:bg-[#9571F7] disabled:opacity-40 transition-colors flex items-center gap-1.5">
                  {creating ? <><Loader2 size={12} className="animate-spin"/>Creating…</> : 'Create Webhook'}
                </button>
                <button onClick={() => setShowForm(false)} className="text-xs text-[#4A6580] px-3 py-2 border border-[#1A2D40]">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <div className="text-sm text-[#4A6580] text-center py-8 font-mono">Loading webhooks…</div> : hooks.length === 0 ? (
        <div className="text-center py-12 text-[#4A6580]"><Globe size={32} strokeWidth={1} className="mx-auto mb-2" /><p className="text-sm">No webhooks yet.</p></div>
      ) : (
        <div className="space-y-2">
          {hooks.map(h => (
            <div key={h.id} className="bg-[#0D1821] border border-[#1A2D40] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-white mb-1">{h.name}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="font-mono text-xs text-[#4A6580] truncate max-w-xs">{h.url}</code>
                    <CopyChip text={h.url} />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">{h.events.map(e => <Badge key={e} label={e} color="#A78BFA" />)}</div>
                  <div className="flex gap-3 text-[10px] font-mono text-[#4A6580]">
                    <span className="text-[#2ECC8A]">✓ {h.success_count}</span>
                    {h.fail_count > 0 && <span className="text-[#FF4D6A]">✗ {h.fail_count}</span>}
                    {h.last_triggered_at && <span>Last: {new Date(h.last_triggered_at).toLocaleDateString('en-IN')}</span>}
                  </div>
                </div>
                <button onClick={() => del(h.id)} className="text-[#FF4D6A] hover:bg-[rgba(255,77,106,0.1)] p-1.5 flex-shrink-0"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PortalPage() {
  const [tab, setTab] = useState<'keys'|'webhooks'|'docs'>('keys');

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3"><Key size={22} className="text-[#00D4C8]" /> Portal API</h1>
        <p className="text-[#7A95AE] text-sm mt-1">Connect MagicBricks, 99acres, or your own portal via API keys and webhooks.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#1A2D40]">
        {[['keys','API Keys'],['webhooks','Webhooks'],['docs','Quick Start']] .map(([k,l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            className={`px-5 py-2.5 text-xs font-bold font-mono transition-colors ${tab===k ? 'text-[#00D4C8] border-b-2 border-[#00D4C8] -mb-px' : 'text-[#4A6580] hover:text-[#7A95AE]'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-[#111C28] border border-[#1A2D40] p-6">
        {tab === 'keys'     && <ApiKeysTab />}
        {tab === 'webhooks' && <WebhooksTab />}
        {tab === 'docs' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white">Quick Start</h3>
            <div className="bg-[#060C12] border border-[#1A2D40] p-4 text-xs font-mono text-[#7A95AE] space-y-2">
              <div className="text-[#00D4C8]"># 1. Get listings for your portal</div>
              <div>GET {process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1','') || 'http://localhost:5000'}/api/v1/portal/listings</div>
              <div>Authorization: Bearer qre_live_your_key</div>
              <br/>
              <div className="text-[#00D4C8]"># 2. Filter by city, type, price</div>
              <div>?city=Mumbai&property_type=apartment&listing_type=sale&min_price=5000000&page=1&limit=20</div>
              <br/>
              <div className="text-[#00D4C8]"># 3. Get single listing by short code</div>
              <div>GET .../portal/listings/V7xKp2Qm</div>
              <br/>
              <div className="text-[#00D4C8]"># 4. Verify webhook signatures</div>
              <div>X-QRE-Signature: sha256=HMAC_SHA256(secret, body)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
