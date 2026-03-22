'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Upload, QrCode, Download, Plus,
  Trash2, Copy, CheckCircle2, AlertCircle,
  Loader2, FileText, Zap,
} from 'lucide-react';
import api from '@/lib/api';

interface Template { id:string; name:string; is_shared:boolean; use_count:number; creator_name:string; template_data:any; created_at:string }

function TabBtn({ active, onClick, children }: any) {
  return (
    <button onClick={onClick} className={`px-5 py-2.5 text-xs font-bold font-mono transition-colors ${active ? 'text-[#00D4C8] border-b-2 border-[#00D4C8] -mb-px' : 'text-[#4A6580] hover:text-[#7A95AE]'}`}>
      {children}
    </button>
  );
}

const INPUT = "w-full bg-[#0D1821] border border-[#1A2D40] text-white text-sm px-3 py-2 outline-none focus:border-[#00D4C8] transition-colors placeholder-[#2A3D52] font-mono";

// ── Templates ──────────────────────────────────────────────────────────────────
function TemplatesTab() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [listings, setListings]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveForm, setSaveForm]   = useState({ listingId:'', name:'', isShared:false });
  const [saving, setSaving]       = useState(false);
  const [cloneForm, setCloneForm] = useState<{[k:string]:any}>({});
  const [cloning, setCloning]     = useState('');
  const [cloned, setCloned]       = useState('');
  const [err, setErr]             = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/builder/templates'),
      api.get('/listings?limit=50'),
    ]).then(([t, l]) => {
      setTemplates(t.data.data.templates);
      setListings(l.data.data.listings);
    }).finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!saveForm.listingId || !saveForm.name.trim()) return;
    setSaving(true); setErr('');
    try {
      const r = await api.post('/builder/templates', saveForm);
      setTemplates(prev => [r.data.data.template, ...prev]);
      setShowSaveForm(false); setSaveForm({ listingId:'', name:'', isShared:false });
    } catch (e:any) { setErr(e?.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  }

  async function del(id:string) {
    if (!confirm('Delete this template?')) return;
    await api.delete(`/builder/templates/${id}`);
    setTemplates(prev => prev.filter(t => t.id !== id));
  }

  async function clone(tmpl:Template) {
    const overrides = cloneForm[tmpl.id] || {};
    if (!overrides.price || !overrides.address) {
      setCloneForm(f => ({...f, [tmpl.id]: {...(f[tmpl.id]||{}), _showOverrides:true}}));
      return;
    }
    setCloning(tmpl.id); setErr('');
    try {
      await api.post(`/builder/templates/${tmpl.id}/clone`, overrides);
      setCloned(tmpl.id);
      setTimeout(() => setCloned(''), 2500);
    } catch (e:any) { setErr(e?.response?.data?.message || 'Clone failed'); }
    finally { setCloning(''); }
  }

  if (loading) return <div className="py-10 text-center text-[#4A6580] font-mono text-sm">Loading templates…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#4A6580] font-mono">Save a listing as a reusable template. Clone it to create similar listings faster.</p>
        <button onClick={() => setShowSaveForm(f=>!f)} className="flex items-center gap-1.5 text-xs font-bold text-[#00D4C8] border border-[rgba(0,212,200,0.3)] px-3 py-1.5 hover:bg-[rgba(0,212,200,0.06)] transition-colors">
          <Plus size={13} /> Save Template
        </button>
      </div>

      <AnimatePresence>
        {showSaveForm && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden">
            <div className="bg-[#0D1821] border border-[#1A2D40] p-4 space-y-3">
              <select className={INPUT} value={saveForm.listingId} onChange={e => setSaveForm(f=>({...f,listingId:e.target.value}))}>
                <option value="">Select listing to save as template…</option>
                {listings.map(l => <option key={l.id} value={l.id}>{l.title} — {l.city}</option>)}
              </select>
              <input className={INPUT} value={saveForm.name} onChange={e=>setSaveForm(f=>({...f,name:e.target.value}))} placeholder="Template name (e.g. Standard 2BHK Mumbai)" />
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#7A95AE]">
                <input type="checkbox" checked={saveForm.isShared} onChange={e=>setSaveForm(f=>({...f,isShared:e.target.checked}))} className="accent-[#00D4C8]" />
                Share with all agents in my agency
              </label>
              {err && <p className="text-xs text-[#FF4D6A] font-mono">{err}</p>}
              <div className="flex gap-2">
                <button onClick={save} disabled={saving || !saveForm.listingId || !saveForm.name.trim()} className="bg-[#00D4C8] text-[#080F17] px-4 py-2 text-xs font-bold hover:bg-[#00B8AD] disabled:opacity-40 transition-colors flex items-center gap-1.5">
                  {saving ? <Loader2 size={12} className="animate-spin"/> : null} Save Template
                </button>
                <button onClick={() => setShowSaveForm(false)} className="text-xs text-[#4A6580] px-3 py-2 border border-[#1A2D40]">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {templates.length === 0 ? (
        <div className="text-center py-12 text-[#4A6580]"><Layers size={32} strokeWidth={1} className="mx-auto mb-2"/><p className="text-sm">No templates yet. Save a listing as a template to get started.</p></div>
      ) : (
        <div className="space-y-2">
          {templates.map(t => (
            <div key={t.id} className="bg-[#0D1821] border border-[#1A2D40] p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-bold text-sm text-white">{t.name}</div>
                  <div className="text-[10px] font-mono text-[#4A6580] mt-0.5">
                    By {t.creator_name} · {t.use_count} uses · {t.is_shared ? <span className="text-[#00D4C8]">Shared</span> : 'Private'} · {t.template_data.property_type} · {t.template_data.city}
                  </div>
                </div>
                <div className="flex gap-2">
                  {cloned === t.id && <span className="text-[10px] font-mono text-[#2ECC8A] flex items-center gap-1"><CheckCircle2 size={10}/> Cloned!</span>}
                  <button onClick={() => clone(t)} disabled={cloning === t.id} className="flex items-center gap-1 text-xs font-bold text-[#A78BFA] border border-[rgba(167,139,250,0.3)] px-3 py-1 hover:bg-[rgba(167,139,250,0.06)] disabled:opacity-40 transition-colors">
                    {cloning===t.id ? <Loader2 size={11} className="animate-spin"/> : <Copy size={11}/>} Clone
                  </button>
                  <button onClick={() => del(t.id)} className="text-[#FF4D6A] hover:bg-[rgba(255,77,106,0.1)] p-1.5"><Trash2 size={13}/></button>
                </div>
              </div>
              {/* Override fields for clone */}
              {cloneForm[t.id]?._showOverrides && (
                <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t border-[#1A2D40]">
                  <input className={INPUT + ' text-xs'} placeholder="Price (₹) *" type="number" onChange={e=>setCloneForm(f=>({...f,[t.id]:{...f[t.id],price:parseFloat(e.target.value)}}))} />
                  <input className={INPUT + ' text-xs'} placeholder="Address *" onChange={e=>setCloneForm(f=>({...f,[t.id]:{...f[t.id],address:e.target.value}}))} />
                  <input className={INPUT + ' text-xs'} placeholder="Title (optional)" onChange={e=>setCloneForm(f=>({...f,[t.id]:{...f[t.id],title:e.target.value}}))} />
                  <input className={INPUT + ' text-xs'} placeholder="Locality (optional)" onChange={e=>setCloneForm(f=>({...f,[t.id]:{...f[t.id],locality:e.target.value}}))} />
                  <button onClick={() => clone(t)} className="col-span-2 bg-[#A78BFA] text-[#080F17] py-2 text-xs font-bold hover:bg-[#9571F7] transition-colors">Clone with these details</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CSV Import ─────────────────────────────────────────────────────────────────
function ImportTab() {
  const [csv, setCsv]         = useState('');
  const [result, setResult]   = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileRef               = useRef<HTMLInputElement>(null);

  async function downloadTemplate() {
    const r = await fetch(
      (process.env.NEXT_PUBLIC_API_URL || '') + '/builder/import/template',
      { headers: { Authorization: `Bearer ${localStorage.getItem('qre_access_token') || ''}` } }
    );
    const blob = await r.blob();
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'qrestate-import-template.csv'; a.click();
  }

  async function importCsv() {
    if (!csv.trim()) return;
    setLoading(true); setResult(null);
    try {
      const r = await api.post('/builder/import', { csv });
      setResult(r.data.data);
    } catch (e:any) {
      setResult({ error: e?.response?.data?.message || 'Import failed' });
    } finally { setLoading(false); }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setCsv(ev.target?.result as string || '');
    reader.readAsText(f);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#4A6580] font-mono">Import multiple listings from a CSV file in one shot.</p>
        <button onClick={downloadTemplate} className="flex items-center gap-1.5 text-xs font-bold text-[#60A5FA] border border-[rgba(96,165,250,0.3)] px-3 py-1.5 hover:bg-[rgba(96,165,250,0.06)] transition-colors">
          <Download size={13}/> Download CSV Template
        </button>
      </div>

      <div className="bg-[#0D1821] border border-dashed border-[#1A2D40] p-6 text-center hover:border-[#00D4C8] transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
        <Upload size={24} className="text-[#4A6580] mx-auto mb-2"/>
        <p className="text-sm text-[#4A6580]">Click to upload a CSV file, or paste content below</p>
        <p className="text-[10px] font-mono text-[#2A3D52] mt-1">Max 500 rows per import</p>
        <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile}/>
      </div>

      <textarea className={INPUT + ' resize-none h-32 text-xs'} value={csv} onChange={e=>setCsv(e.target.value)} placeholder="Or paste CSV content here..." />

      <button onClick={importCsv} disabled={loading || !csv.trim()} className="w-full bg-[#00D4C8] text-[#080F17] font-bold py-3 text-sm hover:bg-[#00B8AD] disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
        {loading ? <><Loader2 size={15} className="animate-spin"/>Importing…</> : 'Import Listings'}
      </button>

      {result && (
        <div className={`p-4 border ${result.error ? 'border-[rgba(255,77,106,0.3)] bg-[rgba(255,77,106,0.06)]' : 'border-[rgba(46,204,138,0.3)] bg-[rgba(46,204,138,0.06)]'}`}>
          {result.error ? <p className="text-xs text-[#FF4D6A] font-mono">{result.error}</p> : (
            <div className="space-y-2">
              <div className="flex gap-6 text-sm font-bold">
                <span className="text-[#2ECC8A]">✓ {result.success} created</span>
                {result.failed > 0 && <span className="text-[#FF4D6A]">✗ {result.failed} failed</span>}
                <span className="text-[#4A6580] font-normal font-mono">Total: {result.total}</span>
              </div>
              {result.errors?.length > 0 && (
                <div className="bg-[#060C12] p-3 text-[10px] font-mono text-[#FF4D6A] space-y-1 max-h-32 overflow-y-auto">
                  {result.errors.map((e:any) => <div key={e.row}>Row {e.row}: {e.errors.join(', ')}</div>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Bulk QR + Export ──────────────────────────────────────────────────────────
function ToolsTab() {
  const [qrResult, setQrResult] = useState<any>(null);
  const [qrLoading, setQrLoad]  = useState(false);
  const [exporting, setExport]  = useState(false);
  const [exportFilter, setExportFilter] = useState({ status:'', city:'', property_type:'' });

  async function bulkQR() {
    setQrLoad(true); setQrResult(null);
    try {
      const r = await api.post('/builder/qr/bulk-generate');
      setQrResult(r.data.data);
    } finally { setQrLoad(false); }
  }

  async function exportCsv() {
    setExport(true);
    const params = Object.fromEntries(Object.entries(exportFilter).filter(([,v])=>v));
    const qs = new URLSearchParams(params as any).toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/builder/export${qs?'?'+qs:''}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('qre_access_token') || ''}` }});
    const blob = await r.blob();
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `listings-export-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    setExport(false);
  }

  const SELECT = "bg-[#0D1821] border border-[#1A2D40] text-white text-xs px-2 py-1.5 outline-none focus:border-[#00D4C8] font-mono";

  return (
    <div className="space-y-6">
      {/* Bulk QR */}
      <div className="bg-[#0D1821] border border-[#1A2D40] p-5">
        <div className="flex items-center gap-2 mb-2">
          <QrCode size={15} className="text-[#00D4C8]" />
          <span className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase font-mono">Bulk QR Generation</span>
        </div>
        <p className="text-xs text-[#4A6580] mb-4">Generate QR codes for all active listings that don't have one yet. One click.</p>
        <button onClick={bulkQR} disabled={qrLoading} className="flex items-center gap-2 bg-[#00D4C8] text-[#080F17] font-bold px-5 py-2.5 text-sm hover:bg-[#00B8AD] disabled:opacity-40 transition-colors">
          {qrLoading ? <Loader2 size={14} className="animate-spin"/> : <Zap size={14}/>}
          {qrLoading ? 'Generating…' : 'Generate All Missing QR Codes'}
        </button>
        {qrResult && (
          <div className={`mt-3 p-3 text-xs font-mono border ${qrResult.generated > 0 ? 'border-[rgba(46,204,138,0.3)] text-[#2ECC8A]' : 'border-[#1A2D40] text-[#4A6580]'}`}>
            {qrResult.message || `✓ Generated: ${qrResult.generated} | Failed: ${qrResult.failed}`}
          </div>
        )}
      </div>

      {/* Export */}
      <div className="bg-[#0D1821] border border-[#1A2D40] p-5">
        <div className="flex items-center gap-2 mb-2">
          <Download size={15} className="text-[#60A5FA]" />
          <span className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase font-mono">Export Listings CSV</span>
        </div>
        <p className="text-xs text-[#4A6580] mb-4">Export all your listings to CSV with analytics (views, scans, leads, quality scores).</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <select className={SELECT} value={exportFilter.status} onChange={e=>setExportFilter(f=>({...f,status:e.target.value}))}>
            <option value="">All statuses</option>
            {['active','draft','sold','rented','inactive'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select className={SELECT} value={exportFilter.property_type} onChange={e=>setExportFilter(f=>({...f,property_type:e.target.value}))}>
            <option value="">All types</option>
            {['apartment','villa','house','plot','commercial','pg'].map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <input className={SELECT} placeholder="City filter" value={exportFilter.city} onChange={e=>setExportFilter(f=>({...f,city:e.target.value}))} />
        </div>
        <button onClick={exportCsv} disabled={exporting} className="flex items-center gap-2 border border-[rgba(96,165,250,0.4)] text-[#60A5FA] font-bold px-5 py-2.5 text-sm hover:bg-[rgba(96,165,250,0.06)] disabled:opacity-40 transition-colors">
          {exporting ? <Loader2 size={14} className="animate-spin"/> : <Download size={14}/>}
          {exporting ? 'Preparing…' : 'Download CSV'}
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BuilderPage() {
  const [tab, setTab] = useState<'templates'|'import'|'tools'>('templates');

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3"><Layers size={22} className="text-[#2ECC8A]"/> Builder Suite</h1>
        <p className="text-[#7A95AE] text-sm mt-1">Templates, bulk import, mass QR generation, and CSV export.</p>
      </div>

      <div className="flex gap-0 border-b border-[#1A2D40]">
        <TabBtn active={tab==='templates'} onClick={() => setTab('templates')}>Templates</TabBtn>
        <TabBtn active={tab==='import'}    onClick={() => setTab('import')}>CSV Import</TabBtn>
        <TabBtn active={tab==='tools'}     onClick={() => setTab('tools')}>Bulk Tools</TabBtn>
      </div>

      <div className="bg-[#111C28] border border-[#1A2D40] p-6">
        {tab === 'templates' && <TemplatesTab />}
        {tab === 'import'    && <ImportTab />}
        {tab === 'tools'     && <ToolsTab />}
      </div>
    </div>
  );
}
