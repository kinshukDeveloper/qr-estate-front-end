// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Palette, Globe, CheckCircle2, AlertCircle, Loader2,
//   Copy, ExternalLink, Lock, Eye,
// } from 'lucide-react';
// import { brandAPI, type BrandConfig } from '@/lib/features';

// const FONTS  = ['Outfit','Poppins','Inter','Raleway','Lato','DM Sans'];
// const COLORS = [
//   { label: 'Teal (default)', val: '#00D4C8' },
//   { label: 'Royal Blue',     val: '#3B5BDB' },
//   { label: 'Emerald',        val: '#087F5B' },
//   { label: 'Crimson',        val: '#C92A2A' },
//   { label: 'Purple',         val: '#7048E8' },
//   { label: 'Charcoal',       val: '#1C1C1C' },
// ];

// function ColorSwatch({ value, selected, onChange }: { value: string; selected: boolean; onChange: (v: string) => void }) {
//   return (
//     <button
//       type="button"
//       onClick={() => onChange(value)}
//       className={`w-8 h-8 rounded-full border-2 transition-all ${selected ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
//       style={{ background: value }}
//       title={value}
//     />
//   );
// }

// function Card({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
//   return (
//     <div className="bg-[#111C28] border border-[#1A2D40]">
//       <div className="px-6 py-4 border-b border-[#1A2D40] flex items-center gap-2">
//         <Icon size={14} className="text-[#00D4C8]" />
//         <span className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase font-mono">{title}</span>
//       </div>
//       <div className="px-6 py-5">{children}</div>
//     </div>
//   );
// }

// function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
//   return (
//     <div>
//       <label className="block text-xs font-bold text-[#7A95AE] mb-1.5 uppercase tracking-wide font-mono">{label}</label>
//       {hint && <p className="text-[10px] text-[#4A6580] font-mono mb-1.5">{hint}</p>}
//       {children}
//     </div>
//   );
// }

// const INPUT = "w-full bg-[#0D1821] border border-[#1A2D40] text-white text-sm px-3 py-2 outline-none focus:border-[#00D4C8] transition-colors placeholder-[#2A3D52] font-mono";

// export default function BrandPage() {
//   const [config,   setConfig]   = useState<BrandConfig | null>(null);
//   const [loading,  setLoading]  = useState(true);
//   const [saving,   setSaving]   = useState(false);
//   const [saved,    setSaved]    = useState(false);
//   const [err,      setErr]      = useState('');
//   const [domainInput, setDomainInput] = useState('');
//   const [domainMsg,   setDomainMsg]   = useState('');
//   const [verifyMsg,   setVerifyMsg]   = useState('');
//   const [form, setForm] = useState<BrandConfig>({
//     brand_name:       '',
//     logo_url:         '',
//     primary_color:    '#00D4C8',
//     secondary_color:  '#FFB830',
//     font_choice:      'Outfit',
//     support_email:    '',
//     support_phone:    '',
//     website:          '',
//     footer_text:      '',
//     hide_powered_by:  false,
//   });

//   useEffect(() => {
//     brandAPI.get().then(r => {
//       const cfg = r.data.data.config;
//       if (cfg) {
//         setConfig(cfg);
//         setForm({
//           brand_name:      cfg.brand_name      || '',
//           logo_url:        cfg.logo_url         || '',
//           primary_color:   cfg.primary_color    || '#00D4C8',
//           secondary_color: cfg.secondary_color  || '#FFB830',
//           font_choice:     cfg.font_choice      || 'Outfit',
//           support_email:   cfg.support_email    || '',
//           support_phone:   cfg.support_phone    || '',
//           website:         cfg.website          || '',
//           footer_text:     cfg.footer_text      || '',
//           hide_powered_by: cfg.hide_powered_by  || false,
//         });
//       }
//     }).catch(() => setErr('Could not load brand settings.')).finally(() => setLoading(false));
//   }, []);

//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault();
//     setSaving(true); setErr(''); setSaved(false);
//     try {
//       const r = await brandAPI.update(form);
//       setConfig(r.data.data.config);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 3000);
//     } catch (ex: any) {
//       setErr(ex?.response?.data?.message || 'Save failed.');
//     } finally { setSaving(false); }
//   }

//   async function handleDomainSetup() {
//     if (!domainInput.trim()) return;
//     try {
//       const r = await brandAPI.setupDomain(domainInput.trim());
//       setDomainMsg(r.data.data.dns_instruction + '\n\n' + r.data.data.cname_instruction);
//     } catch (ex: any) {
//       setDomainMsg('Error: ' + (ex?.response?.data?.message || 'Failed'));
//     }
//   }

//   async function handleVerify() {
//     try {
//       const r = await brandAPI.verifyDomain();
//       setVerifyMsg(r.data.data.message);
//       if (r.data.data.verified && config) setConfig({ ...config, domain_verified: true });
//     } catch (ex: any) {
//       setVerifyMsg('Error: ' + (ex?.response?.data?.message || 'Verify failed'));
//     }
//   }

//   const update = (k: keyof BrandConfig, v: any) => setForm(f => ({ ...f, [k]: v }));

//   if (loading) return (
//     <div className="flex items-center justify-center h-64 gap-3 text-[#4A6580]">
//       <Loader2 size={20} className="animate-spin" /> Loading brand settings…
//     </div>
//   );

//   return (
//     <div className="max-w-3xl space-y-6 animate-fade-in">
//       {/* Header */}
//       <div>
//         <h1 className="flex items-center gap-3 text-2xl font-black text-white">
//           <Palette size={22} className="text-[#00D4C8]" />
//           White-label Brand
//         </h1>
//         <p className="text-[#7A95AE] text-sm mt-1">
//           Brand your buyer-facing property pages with your own identity.
//           {!config && <span className="text-[#FFB830] font-mono"> — Agency plan required.</span>}
//         </p>
//       </div>

//       {err && (
//         <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(255,77,106,0.08)] border border-[rgba(255,77,106,0.2)] text-[#FF4D6A] text-sm">
//           <AlertCircle size={14} /> {err}
//         </div>
//       )}
//       {saved && (
//         <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
//           className="flex items-center gap-2 px-4 py-3 bg-[rgba(46,204,138,0.08)] border border-[rgba(46,204,138,0.2)] text-[#2ECC8A] text-sm">
//           <CheckCircle2 size={14} /> Brand settings saved.
//         </motion.div>
//       )}

//       <form onSubmit={handleSave} className="space-y-6">
//         {/* Branding */}
//         <Card title="Branding" icon={Palette}>
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <Field label="Brand name *" hint="Shown in page title and footer">
//                 <input className={INPUT} value={form.brand_name} onChange={e => update('brand_name', e.target.value)} required placeholder="Acme Realty" />
//               </Field>
//               <Field label="Logo URL" hint="Direct link to your logo image (PNG/SVG)">
//                 <input className={INPUT} value={form.logo_url || ''} onChange={e => update('logo_url', e.target.value)} placeholder="https://cdn.yourdomain.com/logo.png" />
//               </Field>
//             </div>

//             <Field label="Primary colour">
//               <div className="flex items-center gap-3">
//                 <div className="flex flex-wrap gap-2">
//                   {COLORS.map(c => (
//                     <ColorSwatch key={c.val} value={c.val} selected={form.primary_color === c.val} onChange={v => update('primary_color', v)} />
//                   ))}
//                 </div>
//                 <input type="color" value={form.primary_color || '#00D4C8'} onChange={e => update('primary_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-[#1A2D40]" title="Custom colour" />
//                 <span className="font-mono text-xs text-[#4A6580]">{form.primary_color}</span>
//               </div>
//             </Field>

//             <Field label="Font">
//               <div className="flex flex-wrap gap-2">
//                 {FONTS.map(f => (
//                   <button key={f} type="button" onClick={() => update('font_choice', f)}
//                     className={`px-3 py-1.5 text-xs border transition-colors ${form.font_choice === f ? 'border-[#00D4C8] text-[#00D4C8] bg-[rgba(0,212,200,0.08)]' : 'border-[#1A2D40] text-[#4A6580] hover:text-white'}`}
//                     style={{ fontFamily: f }}>
//                     {f}
//                   </button>
//                 ))}
//               </div>
//             </Field>
//           </div>
//         </Card>

//         {/* Contact */}
//         <Card title="Contact & Footer" icon={Globe}>
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <Field label="Support email"><input className={INPUT} type="email" value={form.support_email || ''} onChange={e => update('support_email', e.target.value)} placeholder="support@youragency.com" /></Field>
//               <Field label="Support phone"><input className={INPUT} type="tel" value={form.support_phone || ''} onChange={e => update('support_phone', e.target.value)} placeholder="+91 98765 43210" /></Field>
//               <Field label="Website"><input className={INPUT} type="url" value={form.website || ''} onChange={e => update('website', e.target.value)} placeholder="https://youragency.com" /></Field>
//               <Field label="Footer text"><input className={INPUT} value={form.footer_text || ''} onChange={e => update('footer_text', e.target.value)} placeholder="© 2025 Acme Realty. All rights reserved." /></Field>
//             </div>

//             <div className="flex items-center gap-3 pt-1">
//               <button type="button" onClick={() => update('hide_powered_by', !form.hide_powered_by)}
//                 className={`relative w-10 h-5 rounded-full transition-colors ${form.hide_powered_by ? 'bg-[#00D4C8]' : 'bg-[#1A2D40]'}`}>
//                 <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.hide_powered_by ? 'translate-x-5' : 'translate-x-0.5'}`} />
//               </button>
//               <div>
//                 <span className="text-sm font-bold text-white">Hide "Powered by QR Estate"</span>
//                 {!form.hide_powered_by && <span className="ml-2 text-[10px] font-mono text-[#FFB830]">Agency plan required</span>}
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Save button */}
//         <button type="submit" disabled={saving} className="w-full bg-[#00D4C8] text-[#080F17] font-black py-3 text-sm hover:bg-[#00B8AD] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
//           {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Brand Settings'}
//         </button>
//       </form>

//       {/* Custom domain */}
//       <Card title="Custom Domain" icon={Globe}>
//         <div className="space-y-4">
//           <p className="text-xs text-[#4A6580] font-mono">
//             Point your own domain at QR Estate property pages. Buyers will see <code className="text-[#00D4C8]">properties.yourdomain.com/p/...</code> instead of <code className="text-[#4A6580]">qrestate.app/p/...</code>.
//           </p>

//           {config?.custom_domain && (
//             <div className={`flex items-center gap-2 px-3 py-2 text-xs font-mono ${config.domain_verified ? 'bg-[rgba(46,204,138,0.06)] border border-[rgba(46,204,138,0.2)] text-[#2ECC8A]' : 'bg-[rgba(255,184,48,0.06)] border border-[rgba(255,184,48,0.2)] text-[#FFB830]'}`}>
//               {config.domain_verified ? <CheckCircle2 size={12} /> : <Loader2 size={12} className="animate-spin" />}
//               {config.custom_domain} — {config.domain_verified ? 'Verified ✓' : 'Pending verification'}
//               {config.domain_verified && <a href={`https://${config.custom_domain}`} target="_blank" rel="noopener noreferrer" className="ml-auto"><ExternalLink size={11} /></a>}
//             </div>
//           )}

//           <div className="flex gap-2">
//             <input className={INPUT + ' flex-1'} value={domainInput} onChange={e => setDomainInput(e.target.value)} placeholder="properties.yourdomain.com" />
//             <button type="button" onClick={handleDomainSetup} className="bg-[#1A2D40] border border-[#1A2D40] text-white px-4 py-2 text-xs font-bold hover:bg-[#243347] transition-colors">Setup</button>
//           </div>

//           {domainMsg && (
//             <pre className="bg-[#060C12] border border-[#1A2D40] p-3 text-[10px] font-mono text-[#7A95AE] whitespace-pre-wrap leading-relaxed">
//               {domainMsg}
//             </pre>
//           )}

//           {config?.custom_domain && !config?.domain_verified && (
//             <button type="button" onClick={handleVerify} className="w-full border border-[#1A2D40] text-[#7A95AE] py-2 text-xs font-mono hover:text-white hover:border-[#00D4C8] transition-colors">
//               Check DNS verification
//             </button>
//           )}
//           {verifyMsg && <p className="text-xs font-mono text-[#7A95AE]">{verifyMsg}</p>}

//           <div className="bg-[#060C12] border border-[#1A2D40] p-3 text-[10px] font-mono text-[#4A6580]">
//             <div className="text-[#FFB830] mb-1">DNS setup instructions (after clicking Setup):</div>
//             <div>1. Add TXT record: <code className="text-[#7A95AE]">_qrestate-verify.yourdomain.com</code></div>
//             <div>2. Add CNAME: <code className="text-[#7A95AE]">yourdomain.com → cname.vercel-dns.com</code></div>
//             <div>3. Click "Check DNS verification" (may take up to 48h)</div>
//           </div>
//         </div>
//       </Card>

//       {/* Preview card */}
//       {form.brand_name && (
//         <Card title="Preview" icon={Eye}>
//           <div className="bg-[#F5F2EE] p-4 max-w-xs">
//             <div className="flex items-center gap-2 mb-3">
//               {form.logo_url
//                 ? <img src={form.logo_url} alt="logo" className="object-contain h-8" onError={e => (e.currentTarget.style.display='none')} />
//                 : <div className="w-8 h-8 rounded" style={{ background: form.primary_color || '#00D4C8' }} />
//               }
//               <span className="font-black text-[#1C1C1C] text-sm" style={{ fontFamily: form.font_choice || 'Outfit' }}>
//                 {form.brand_name}
//               </span>
//             </div>
//             <div className="h-px bg-[#DDD] mb-3" />
//             <div className="text-xs text-[#666] font-mono mb-2">Property page will use your brand colours and font.</div>
//             {!form.hide_powered_by && <div className="text-[9px] text-[#CCC]">Powered by QR Estate</div>}
//             {form.hide_powered_by  && <div className="text-[9px]" style={{ color: form.primary_color }}>{form.footer_text || `© ${form.brand_name}`}</div>}
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Globe, Check, AlertCircle, Loader2, ExternalLink, Lock, Eye, EyeOff } from 'lucide-react';
import { brandAPI, type BrandConfig } from '@/lib/features';

const FONTS = ['Outfit','Poppins','Inter','Raleway','Lato','DM Sans'];
const PRESET_COLORS = [
  { label:'Teal',    val:'#18D4C8' },
  { label:'Blue',    val:'#3B5BDB' },
  { label:'Emerald', val:'#087F5B' },
  { label:'Crimson', val:'#C92A2A' },
  { label:'Purple',  val:'#7048E8' },
  { label:'Gold',    val:'#E8B84B' },
];

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, hint, children }: { label:string; hint?:string; children:React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-1.5" style={{ fontFamily:'var(--font-mono)' }}>{label}</label>
      {hint && <p className="text-[11px] text-[var(--dim)] mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

const CLS = "w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] text-[var(--white)] outline-none focus:border-[var(--teal)] transition-colors placeholder:text-[var(--dim)]";

// ── Section card ───────────────────────────────────────────────────────────────
function Section({ title, color, icon:Icon, children }: any) {
  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-xl" style={{ background:`${color}12`, border:`1px solid ${color}25` }}>
          <Icon size={15} style={{ color }} strokeWidth={1.8}/>
        </div>
        <span className="text-[13px] font-bold text-[var(--white)]" style={{ fontFamily:'var(--font-syne)' }}>{title}</span>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

export default function BrandPage() {
  const [config,   setConfig]   = useState<BrandConfig|null>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ type:'success'|'error'; text:string }|null>(null);
  const [preview,  setPreview]  = useState(false);

  const [agencyName,    setAgencyName]    = useState('');
  const [tagline,       setTagline]       = useState('');
  const [primaryColor,  setPrimaryColor]  = useState('#18D4C8');
  const [font,          setFont]          = useState('Outfit');
  const [domain,        setDomain]        = useState('');
  const [logoUrl,       setLogoUrl]       = useState('');
  const [whatsappMsg,   setWhatsappMsg]   = useState('');

  useEffect(() => {
    brandAPI.getConfig().then(r => {
      const c = r.data.data.brand;
      setConfig(c);
      if (c) {
        setAgencyName(c.agency_name||'');
        setTagline(c.tagline||'');
        setPrimaryColor(c.primary_color||'#18D4C8');
        setFont(c.font_family||'Outfit');
        setDomain(c.custom_domain||'');
        setLogoUrl(c.logo_url||'');
        setWhatsappMsg(c.whatsapp_message||'');
      }
    }).finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true); setMsg(null);
    try {
      await brandAPI.updateConfig({
        brand_name: agencyName,
        tagline,
        primary_color: primaryColor,
        font_choice: font,
        custom_domain: domain || undefined,
        logo_url: logoUrl || undefined,
        whatsapp_message: whatsappMsg || undefined,
      });
      setMsg({ type:'success', text:'Brand settings saved successfully.' });
    } catch (e:any) {
      setMsg({ type:'error', text:e?.response?.data?.message||'Save failed.' });
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-2xl pb-8 space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[1.5rem] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily:'var(--font-syne)' }}>Brand</h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">White-label your property pages — buyers see your brand, not QR Estate</p>
        </div>
        <motion.button onClick={() => setPreview(v=>!v)}
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] text-[11px] font-bold text-[var(--muted)] hover:text-[var(--teal)] hover:border-[rgba(24,212,200,0.3)] transition-all flex-shrink-0"
          style={{ fontFamily:'var(--font-mono)' }}>
          {preview ? <EyeOff size={13}/> : <Eye size={13}/>}
          {preview ? 'Hide' : 'Preview'}
        </motion.button>
      </div>

      {/* ── Save feedback ── */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-[12px] border ${msg.type==='success'?'bg-[rgba(40,216,144,0.06)] border-[rgba(40,216,144,0.2)] text-[var(--green)]':'bg-[rgba(240,64,96,0.06)] border-[rgba(240,64,96,0.2)] text-[var(--red)]'}`}>
            {msg.type==='success'?<Check size={13}/>:<AlertCircle size={13}/>}{msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin"/>
        </div>
      ) : (
        <>
          {/* ── Agency Identity ── */}
          <Section title="Agency Identity" color="var(--teal)" icon={Palette}>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Agency Name" hint="Shown on all buyer-facing pages">
                  <input value={agencyName} onChange={e=>setAgencyName(e.target.value)} placeholder="Your Agency Name" className={CLS}/>
                </Field>
                <Field label="Tagline (optional)">
                  <input value={tagline} onChange={e=>setTagline(e.target.value)} placeholder="Trusted since 2010" className={CLS}/>
                </Field>
              </div>
              <Field label="Logo URL (optional)" hint="HTTPS link to your logo image">
                <input value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} placeholder="https://youragency.com/logo.png" className={CLS}/>
              </Field>
              <Field label="WhatsApp Message (optional)" hint="Custom message when buyers tap 'WhatsApp Agent'">
                <textarea value={whatsappMsg} onChange={e=>setWhatsappMsg(e.target.value)} rows={2} placeholder="Hi, I'm interested in…" className={CLS+' resize-none'}/>
              </Field>
            </div>
          </Section>

          {/* ── Colours & Typography ── */}
          <Section title="Colours & Typography" color="var(--purple)" icon={Palette}>
            <div className="space-y-5">
              <Field label="Brand Colour">
                <div className="flex flex-wrap items-center gap-4">
                  <input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[var(--border)] bg-transparent p-0.5 flex-shrink-0"/>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map(c=>(
                      <motion.button key={c.val} onClick={()=>setPrimaryColor(c.val)} title={c.label}
                        whileHover={{ scale:1.1 }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${primaryColor===c.val?'border-white scale-110':'border-transparent opacity-70 hover:opacity-100'}`}
                        style={{ background:c.val }}/>
                    ))}
                  </div>
                  <span className="text-[11px] text-[var(--muted)]" style={{ fontFamily:'var(--font-mono)' }}>{primaryColor}</span>
                </div>
              </Field>

              <Field label="Font Family">
                <div className="flex flex-wrap gap-2">
                  {FONTS.map(f=>(
                    <button key={f} onClick={()=>setFont(f)}
                      className={`px-3 py-2 rounded-xl border text-[12px] font-semibold transition-all ${font===f?'border-[rgba(24,212,200,0.35)] bg-[rgba(24,212,200,0.08)] text-[var(--teal)]':'border-[var(--border)] text-[var(--muted)] hover:border-[var(--border2)]'}`}
                      style={{ fontFamily:f }}>
                      {f}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </Section>

          {/* ── Custom Domain ── */}
          <Section title="Custom Domain" color="var(--gold)" icon={Globe}>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 border border-[rgba(232,184,75,0.2)] bg-[rgba(232,184,75,0.04)]">
                <Lock size={13} className="text-[var(--gold)] flex-shrink-0 mt-0.5"/>
                <p className="text-[12px] text-[var(--muted)]">Custom domain is available on the Agency plan (₹4,999/month). Point your domain's CNAME to <code className="text-[var(--teal)] font-mono">qrestate.in</code></p>
              </div>
              <Field label="Domain" hint="Enter the domain you've pointed to us">
                <div className="relative">
                  <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dim)] pointer-events-none"/>
                  <input value={domain} onChange={e=>setDomain(e.target.value)} placeholder="property.youragency.com"
                    className={CLS+' pl-9'}/>
                </div>
              </Field>
              {domain && (
                <a href={`https://${domain}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-[var(--teal)] hover:underline" style={{ fontFamily:'var(--font-mono)' }}>
                  <ExternalLink size={11}/> Test domain →
                </a>
              )}
            </div>
          </Section>

          {/* ── Live preview ── */}
          <AnimatePresence>
            {preview && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                className="rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="px-5 py-3 bg-[var(--surface)] border-b border-[var(--border)] flex items-center gap-2">
                  <Eye size={13} className="text-[var(--muted)]"/>
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>Buyer page preview</span>
                </div>
                <div className="p-6 bg-[#F5F2EE]" style={{ fontFamily:font }}>
                  <div className="flex items-center gap-3 mb-4">
                    {logoUrl && <img src={logoUrl} alt="" className="object-contain h-8"/>}
                    <div>
                      <div className="font-bold text-[#1C1C1C] text-[15px]" style={{ color:primaryColor }}>{agencyName||'Your Agency'}</div>
                      {tagline && <div className="text-[11px] text-[#666]">{tagline}</div>}
                    </div>
                  </div>
                  <div className="w-24 h-1.5 rounded-full mb-3" style={{ background:primaryColor }}/>
                  <div className="text-[12px] text-[#666] mb-4">3BHK Apartment · Andheri West, Mumbai · ₹2.4 Cr</div>
                  <button className="px-4 py-2 rounded-lg text-white text-[12px] font-semibold" style={{ background:primaryColor }}>
                    Contact Agent
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Save button ── */}
          <div className="flex justify-end pt-1">
            <motion.button onClick={save} disabled={saving}
              whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold text-[var(--bg)] disabled:opacity-50"
              style={{ background:'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)', fontFamily:'var(--font-syne)' }}>
              {saving ? <><Loader2 size={13} className="animate-spin"/>Saving…</> : <><Check size={13}/>Save Brand Settings</>}
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
