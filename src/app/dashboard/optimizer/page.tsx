// 'use client';

// import { useState, useEffect } from 'react';
// import { TrendingUp, Wand2, CheckCircle2, AlertCircle, Loader2, RefreshCw, Copy } from 'lucide-react';
// import api from '@/lib/api';

// interface Listing { id:string; title:string; price:number; city:string; status:string }

// const TOOL_COLOR: Record<string,string> = { price:'#00D4C8', title:'#A78BFA', amenities:'#2ECC8A', conversion:'#FFB830' };

// function LoadBtn({ onClick, loading, color, children }: any) {
//   return (
//     <button onClick={onClick} disabled={loading}
//       className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 border transition-colors disabled:opacity-40"
//       style={{ borderColor: color+'40', color, background: loading ? color+'10' : 'transparent' }}>
//       {loading ? <Loader2 size={12} className="animate-spin"/> : null}
//       {children}
//     </button>
//   );
// }

// function Section({ title, color, children }: any) {
//   return (
//     <div className="bg-[#0D1821] border border-[#1A2D40] overflow-hidden">
//       <div className="px-5 py-3 border-b border-[#1A2D40] flex items-center gap-2">
//         <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
//         <span className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase font-mono">{title}</span>
//       </div>
//       <div className="px-5 py-4">{children}</div>
//     </div>
//   );
// }

// export default function OptimizerPage() {
//   const [listings,  setListings]  = useState<Listing[]>([]);
//   const [selected,  setSelected]  = useState('');
//   const [loadingL,  setLoadingL]  = useState(true);

//   const [priceData,  setPriceData]  = useState<any>(null);
//   const [titleData,  setTitleData]  = useState<any>(null);
//   const [amenData,   setAmenData]   = useState<any>(null);
//   const [convData,   setConvData]   = useState<any>(null);

//   const [loading, setLoading]     = useState<Record<string,boolean>>({});
//   const [copiedTitle, setCopied]  = useState('');

//   useEffect(() => {
//     api.get('/listings').then(r => {
//       const ls = r.data.data.listings || [];
//       setListings(ls);
//       if (ls.length > 0) setSelected(ls[0].id);
//     }).finally(() => setLoadingL(false));
//   }, []);

//   const run = async (tool: string, setter: any) => {
//     if (!selected) return;
//     setLoading(l => ({ ...l, [tool]: true }));
//     setter(null);
//     try {
//       const r = await api.post(`/optimizer/${tool}/${selected}`);
//       setter(r.data.data);
//     } catch (e:any) {
//       setter({ error: e?.response?.data?.message || 'Failed' });
//     } finally {
//       setLoading(l => ({ ...l, [tool]: false }));
//     }
//   };

//   function fmtPrice(p:number) {
//     if (!p) return '—';
//     if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Cr`;
//     if (p >= 100000)   return `₹${(p/100000).toFixed(2)} L`;
//     return `₹${p.toLocaleString('en-IN')}`;
//   }

//   const selectedListing = listings.find(l => l.id === selected);

//   return (
//     <div className="max-w-3xl space-y-6 animate-fade-in">
//       <div>
//         <h1 className="flex items-center gap-3 text-2xl font-black text-white"><TrendingUp size={22} className="text-[#FFB830]" /> AI Optimizer</h1>
//         <p className="text-[#7A95AE] text-sm mt-1">Optimise any listing for maximum conversion — price, title, amenities, and more.</p>
//       </div>

//       {/* Listing selector */}
//       <div className="bg-[#111C28] border border-[#1A2D40] px-5 py-4">
//         <p className="text-[10px] font-mono text-[#4A6580] uppercase tracking-wide mb-2">Select listing to optimise</p>
//         {loadingL ? <div className="text-sm text-[#4A6580] font-mono">Loading listings…</div> : (
//           <select value={selected} onChange={e => { setSelected(e.target.value); setPriceData(null); setTitleData(null); setAmenData(null); setConvData(null); }}
//             className="w-full bg-[#0D1821] border border-[#1A2D40] text-white text-sm px-3 py-2 outline-none focus:border-[#00D4C8]">
//             {listings.map(l => <option key={l.id} value={l.id}>{l.title} — {l.city}</option>)}
//           </select>
//         )}
//       </div>

//       {/* ── Price Suggestion ── */}
//       <Section title="Price Suggestion" color={TOOL_COLOR.price}>
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs text-[#4A6580]">Compare your price against similar active + sold listings in the same city.</p>
//           <LoadBtn onClick={() => run('price', setPriceData)} loading={loading.price} color={TOOL_COLOR.price}>
//             Analyse Price
//           </LoadBtn>
//         </div>
//         {priceData?.error && <p className="text-xs text-[#FF4D6A] font-mono">{priceData.error}</p>}
//         {priceData && !priceData.error && (
//           <div className="space-y-3">
//             <div className="grid grid-cols-3 gap-2">
//               {[['Min',priceData.suggested_min,'#4A6580'],['Mid ★',priceData.suggested_mid,'#00D4C8'],['Max',priceData.suggested_max,'#2ECC8A']].map(([l,v,c]) => (
//                 <div key={l as string} className="bg-[#060C12] border border-[#1A2D40] p-3 text-center">
//                   <div className="text-[9px] font-mono text-[#4A6580] uppercase mb-1">{l}</div>
//                   <div className="font-mono text-sm font-bold" style={{color:c as string}}>{fmtPrice(v as number)}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex items-center gap-3">
//               <span className="text-[10px] font-mono uppercase tracking-wide text-[#4A6580]">vs Market:</span>
//               <span className={`text-[10px] font-bold px-2 py-0.5 font-mono ${priceData.price_vs_market==='fair' ? 'bg-[rgba(46,204,138,0.1)] text-[#2ECC8A]' : priceData.price_vs_market==='above' ? 'bg-[rgba(255,77,106,0.1)] text-[#FF4D6A]' : 'bg-[rgba(0,212,200,0.1)] text-[#00D4C8]'}`}>
//                 {priceData.price_vs_market?.toUpperCase()} {priceData.adjustment_pct !== 0 && `(${priceData.adjustment_pct > 0 ? '+' : ''}${priceData.adjustment_pct}%)`}
//               </span>
//               <span className="text-[10px] font-mono text-[#4A6580]">Confidence: {priceData.confidence}</span>
//               <span className="text-[10px] font-mono text-[#4A6580]">{priceData.comps_count} comparables</span>
//               <span className="text-[10px] font-mono text-[#4A6580]">Source: {priceData.source}</span>
//             </div>
//             <p className="text-xs text-[#7A95AE] bg-[#060C12] p-3 leading-relaxed">{priceData.reasoning}</p>
//           </div>
//         )}
//       </Section>

//       {/* ── Title Optimizer ── */}
//       <Section title="Title Optimizer" color={TOOL_COLOR.title}>
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs text-[#4A6580]">Get 3 SEO-optimised title variants with keyword analysis.</p>
//           <LoadBtn onClick={() => run('title', setTitleData)} loading={loading.title} color={TOOL_COLOR.title}>
//             Optimise Title
//           </LoadBtn>
//         </div>
//         {titleData?.error && <p className="text-xs text-[#FF4D6A] font-mono">{titleData.error}</p>}
//         {titleData && !titleData.error && (
//           <div className="space-y-3">
//             {titleData.current_issues?.length > 0 && (
//               <div className="flex flex-wrap gap-1 mb-1">
//                 {titleData.current_issues.map((i:string) => <span key={i} className="text-[9px] font-mono bg-[rgba(255,77,106,0.08)] text-[#FF4D6A] border border-[rgba(255,77,106,0.2)] px-2 py-0.5">{i}</span>)}
//               </div>
//             )}
//             {titleData.variants?.map((v:any, i:number) => (
//               <div key={i} className="bg-[#060C12] border border-[#1A2D40] p-3">
//                 <div className="flex items-start justify-between gap-2 mb-2">
//                   <div className="flex items-center gap-2">
//                     <span className="font-mono text-[9px] text-[#A78BFA] font-bold">#{i+1}</span>
//                     <span className="font-mono text-[9px] text-[#4A6580]">Score: {v.score}/10</span>
//                     <span className="text-[9px] font-mono text-[#4A6580]">Source: {titleData.source}</span>
//                   </div>
//                   <div className="flex flex-shrink-0 gap-2">
//                     <button onClick={() => { navigator.clipboard.writeText(v.title); setCopied(v.title); setTimeout(()=>setCopied(''),1600); }}
//                       className="flex items-center gap-1 text-[10px] font-mono text-[#4A6580] hover:text-[#A78BFA]">
//                       {copiedTitle === v.title ? <Check size={10}/> : <Copy size={10}/>} Copy
//                     </button>
//                   </div>
//                 </div>
//                 <p className="mb-2 text-sm font-medium text-white">{v.title}</p>
//                 {v.improvements?.length > 0 && (
//                   <div className="flex flex-wrap gap-1">
//                     {v.improvements.map((imp:string) => <span key={imp} className="text-[9px] font-mono bg-[rgba(46,204,138,0.08)] text-[#2ECC8A] border border-[rgba(46,204,138,0.2)] px-1.5 py-0.5">{imp}</span>)}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </Section>

//       {/* ── Amenity Gap ── */}
//       <Section title="Amenity Gap Analysis" color={TOOL_COLOR.amenities}>
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs text-[#4A6580]">See which amenities top-performing listings in your market have that yours is missing.</p>
//           <LoadBtn onClick={() => run('amenities', setAmenData)} loading={loading.amenities} color={TOOL_COLOR.amenities}>
//             Analyse Amenities
//           </LoadBtn>
//         </div>
//         {amenData?.error && <p className="text-xs text-[#FF4D6A] font-mono">{amenData.error}</p>}
//         {amenData && !amenData.error && (
//           <div className="space-y-3">
//             <div className="flex gap-4 text-xs font-mono text-[#4A6580]">
//               <span>You have: <strong className="text-white">{amenData.current_count}</strong> amenities</span>
//               <span>Comparables analysed: <strong className="text-white">{amenData.comparables_analyzed}</strong></span>
//             </div>
//             {amenData.missing_amenities?.length > 0 && (
//               <div>
//                 <p className="text-[10px] font-mono text-[#FF4D6A] uppercase tracking-wide mb-2">Missing from your listing</p>
//                 <div className="space-y-1.5">
//                   {amenData.missing_amenities.map((m:any) => (
//                     <div key={m.amenity} className="flex items-center gap-3 bg-[#060C12] px-3 py-2">
//                       <span className="flex-shrink-0 text-sm text-white w-28">{m.amenity}</span>
//                       <div className="flex-1 h-1.5 bg-[#1A2D40] overflow-hidden"><div className="h-full bg-[#2ECC8A]" style={{width:`${m.prevalence_pct}%`}}/></div>
//                       <span className="text-[10px] font-mono text-[#2ECC8A] w-12 text-right">{m.prevalence_pct}%</span>
//                       <span className={`text-[9px] font-mono px-1.5 py-0.5 ${m.impact==='high'?'bg-[rgba(255,77,106,0.1)] text-[#FF4D6A]':'bg-[rgba(255,184,48,0.1)] text-[#FFB830]'}`}>{m.impact}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {amenData.unique_selling_amenities?.length > 0 && (
//               <div>
//                 <p className="text-[10px] font-mono text-[#2ECC8A] uppercase tracking-wide mb-1">Your unique selling amenities</p>
//                 <div className="flex flex-wrap gap-1">{amenData.unique_selling_amenities.map((a:string) => <span key={a} className="text-[10px] font-mono bg-[rgba(46,204,138,0.08)] text-[#2ECC8A] border border-[rgba(46,204,138,0.2)] px-2 py-0.5">{a}</span>)}</div>
//               </div>
//             )}
//             <p className="text-xs text-[#7A95AE] bg-[#060C12] p-3">{amenData.recommendation}</p>
//           </div>
//         )}
//       </Section>

//       {/* ── Conversion Score ── */}
//       <Section title="Conversion Predictor" color={TOOL_COLOR.conversion}>
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs text-[#4A6580]">Score your listing's ability to convert scans into enquiries.</p>
//           <LoadBtn onClick={() => run('conversion', setConvData)} loading={loading.conversion} color={TOOL_COLOR.conversion}>
//             Predict Conversion
//           </LoadBtn>
//         </div>
//         {convData?.error && <p className="text-xs text-[#FF4D6A] font-mono">{convData.error}</p>}
//         {convData && !convData.error && (
//           <div className="space-y-4">
//             <div className="flex items-center gap-6">
//               <div className="text-center">
//                 <div className="font-mono text-4xl font-black" style={{color:convData.grade==='A'?'#2ECC8A':convData.grade==='B'?'#00D4C8':convData.grade==='C'?'#FFB830':'#FF4D6A'}}>
//                   {convData.grade}
//                 </div>
//                 <div className="text-[10px] font-mono text-[#4A6580] mt-0.5">Grade</div>
//               </div>
//               <div className="text-center">
//                 <div className="font-mono font-black text-4xl text-[#FFB830]">{convData.conversion_score}</div>
//                 <div className="text-[10px] font-mono text-[#4A6580] mt-0.5">/ 100 pts</div>
//               </div>
//               <div className="flex-1 space-y-1">
//                 <div className="flex gap-4 text-xs font-mono text-[#4A6580]">
//                   <span>{convData.stats?.qr_scans} QR scans</span>
//                   <span>{convData.stats?.leads_generated} leads</span>
//                   <span>Rate: {convData.stats?.scan_to_lead_rate}</span>
//                 </div>
//               </div>
//             </div>

//             {convData.factors_to_improve?.length > 0 && (
//               <div>
//                 <p className="text-[10px] font-mono text-[#FFB830] uppercase tracking-wide mb-2">Top improvements (by impact)</p>
//                 <div className="space-y-2">
//                   {convData.factors_to_improve.map((f:any) => (
//                     <div key={f.factor} className="flex items-start gap-3 bg-[#060C12] p-3">
//                       <div className="flex-shrink-0 w-20">
//                         <div className="text-[9px] font-mono text-[#4A6580] uppercase">{f.factor}</div>
//                         <div className="text-[10px] font-mono text-[#FFB830] font-bold">+{f.pts_available} pts</div>
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="text-[10px] font-mono text-[#4A6580]">{f.current} → {f.target}</div>
//                         <div className="text-xs text-[#7A95AE] mt-0.5">{f.action}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </Section>
//     </div>
//   );
// }


// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { TrendingUp, Wand2, CheckCircle2, AlertCircle, Loader2, Copy, Check, Sparkles } from 'lucide-react';
// // import api from '@/lib/api';

// // interface Listing { id: string; title: string; price: number; city: string; status: string }

// // const TOOLS = [
// //   { key: 'price',      label: 'Price Analysis',   color: '#18D4C8', icon: TrendingUp,   desc: 'Compare with 20+ similar listings to find your optimal price point' },
// //   { key: 'title',      label: 'Title Rewrite',    color: '#A870F8', icon: Wand2,        desc: 'GPT-4o rewrites your title to maximise buyer attention and clicks' },
// //   { key: 'amenities',  label: 'Missing Amenities',color: '#28D890', icon: CheckCircle2, desc: 'Detects amenities buyers expect but your listing is missing' },
// //   { key: 'conversion', label: 'Conversion Score', color: '#E8B84B', icon: Sparkles,     desc: 'Overall 0–100 score with specific improvements to close deals faster' },
// // ];

// // function fmtPrice(p: number) {
// //   if (!p) return '—';
// //   if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
// //   if (p >= 100000)   return `₹${(p / 100000).toFixed(2)} L`;
// //   return `₹${p.toLocaleString('en-IN')}`;
// // }

// // function ResultCard({ data, color }: { data: any; color: string }) {
// //   const [copied, setCopied] = useState('');

// //   if (!data) return null;
// //   if (data.error) return (
// //     <div className="flex items-start gap-2.5 bg-[rgba(240,64,96,0.06)] border border-[rgba(240,64,96,0.2)] rounded-xl px-4 py-3">
// //       <AlertCircle size={14} className="text-[var(--red)] flex-shrink-0 mt-0.5" />
// //       <p className="text-[13px] text-[var(--red)]">{data.error}</p>
// //     </div>
// //   );

// //   function copy(text: string, key: string) {
// //     navigator.clipboard.writeText(text);
// //     setCopied(key);
// //     setTimeout(() => setCopied(''), 1800);
// //   }

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 8 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       className="rounded-2xl bg-[var(--card)] border overflow-hidden"
// //       style={{ borderColor: `${color}30` }}
// //     >
// //       {/* Price insight */}
// //       {data.recommended_price && (
// //         <div className="p-5 space-y-3">
// //           <div className="grid grid-cols-3 gap-3">
// //             {[
// //               { label: 'Current',     value: fmtPrice(data.current_price),     color: 'var(--muted)' },
// //               { label: 'Recommended', value: fmtPrice(data.recommended_price), color },
// //               { label: 'Comparables', value: `${data.comparable_count || 0} found`, color: 'var(--dim)' },
// //             ].map(item => (
// //               <div key={item.label} className="text-center p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
// //                 <div className="text-[16px] font-extrabold" style={{ color: item.color, fontFamily: 'var(--font-syne)' }}>{item.value}</div>
// //                 <div className="text-[9px] uppercase tracking-[0.12em] text-[var(--dim)] mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>{item.label}</div>
// //               </div>
// //             ))}
// //           </div>
// //           {data.analysis && <p className="text-[12px] text-[var(--muted)] leading-relaxed">{data.analysis}</p>}
// //         </div>
// //       )}

// //       {/* Title suggestions */}
// //       {data.suggestions && (
// //         <div className="p-5 space-y-2.5">
// //           {data.suggestions.map((title: string, i: number) => (
// //             <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] group">
// //               <span className="text-[10px] font-bold text-[var(--dim)] w-4 flex-shrink-0 mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
// //               <span className="flex-1 text-[13px] text-[var(--white)]">{title}</span>
// //               <button onClick={() => copy(title, `title-${i}`)} className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[var(--border)] text-[10px] text-[var(--dim)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all opacity-0 group-hover:opacity-100">
// //                 {copied === `title-${i}` ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* Missing amenities */}
// //       {data.missing && (
// //         <div className="p-5">
// //           {data.missing.length === 0 ? (
// //             <div className="flex items-center gap-2 text-[var(--green)]">
// //               <CheckCircle2 size={16} />
// //               <span className="text-[13px] font-semibold">All expected amenities are present — great listing!</span>
// //             </div>
// //           ) : (
// //             <div className="flex flex-wrap gap-2">
// //               {data.missing.map((a: string) => (
// //                 <span key={a} className="px-3 py-1.5 rounded-full border text-[11px] font-semibold" style={{ color, background: `${color}0E`, borderColor: `${color}30` }}>
// //                   + {a}
// //                 </span>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* Conversion score */}
// //       {data.score !== undefined && (
// //         <div className="p-5 space-y-4">
// //           <div className="flex items-center gap-4">
// //             <div className="relative flex-shrink-0 w-20 h-20">
// //               <svg viewBox="0 0 80 80" className="w-20 h-20 transform -rotate-90">
// //                 <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6" />
// //                 <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="6"
// //                   strokeDasharray={`${2 * Math.PI * 32}`}
// //                   strokeDashoffset={`${2 * Math.PI * 32 * (1 - data.score / 100)}`}
// //                   strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}
// //                 />
// //               </svg>
// //               <div className="absolute inset-0 flex flex-col items-center justify-center">
// //                 <span className="text-[20px] font-extrabold" style={{ color, fontFamily: 'var(--font-syne)' }}>{data.score}</span>
// //                 <span className="text-[8px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>/100</span>
// //               </div>
// //             </div>
// //             {data.summary && <p className="text-[12px] text-[var(--muted)] leading-relaxed flex-1">{data.summary}</p>}
// //           </div>
// //           {data.improvements?.length > 0 && (
// //             <ul className="space-y-1.5">
// //               {data.improvements.map((imp: string, i: number) => (
// //                 <li key={i} className="flex items-start gap-2 text-[12px] text-[var(--muted)]">
// //                   <span style={{ color }}>→</span>
// //                   {imp}
// //                 </li>
// //               ))}
// //             </ul>
// //           )}
// //         </div>
// //       )}
// //     </motion.div>
// //   );
// // }

// // export default function OptimizerPage() {
// //   const [listings, setListings] = useState<Listing[]>([]);
// //   const [selected, setSelected] = useState('');
// //   const [loadingL, setLoadingL] = useState(true);
// //   const [results,  setResults]  = useState<Record<string, any>>({});
// //   const [running,  setRunning]  = useState<Record<string, boolean>>({});

// //   useEffect(() => {
// //     api.get('/listings').then(r => {
// //       const ls = r.data.data.listings || [];
// //       setListings(ls);
// //       if (ls.length > 0) setSelected(ls[0].id);
// //     }).finally(() => setLoadingL(false));
// //   }, []);

// //   async function run(tool: string) {
// //     if (!selected) return;
// //     setRunning(p => ({ ...p, [tool]: true }));
// //     setResults(p => ({ ...p, [tool]: null }));
// //     try {
// //       const r = await api.post(`/optimizer/${tool}/${selected}`);
// //       setResults(p => ({ ...p, [tool]: r.data.data }));
// //     } catch (e: any) {
// //       setResults(p => ({ ...p, [tool]: { error: e?.response?.data?.message || 'Failed' } }));
// //     } finally {
// //       setRunning(p => ({ ...p, [tool]: false }));
// //     }
// //   }

// //   const selectedListing = listings.find(l => l.id === selected);

// //   return (
// //     <div className="max-w-3xl pb-8 space-y-5">

// //       {/* Header */}
// //       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
// //         <h1 className="text-[1.5rem] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>AI Optimizer</h1>
// //         <p className="text-[13px] text-[var(--muted)] mt-0.5">GPT-4o analyses your listings and tells you exactly what to fix to close deals faster</p>
// //       </motion.div>

// //       {/* Listing select */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}
// //         className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5"
// //       >
// //         <p className="text-[9px] font-black tracking-[0.2em] uppercase text-[var(--teal)] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>Select Listing to Analyse</p>
// //         {loadingL ? (
// //           <div className="h-11 rounded-xl bg-[var(--card)] animate-pulse" />
// //         ) : (
// //           <select
// //             value={selected}
// //             onChange={e => { setSelected(e.target.value); setResults({}); }}
// //             className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 text-[13px] text-[var(--white)] outline-none focus:border-[var(--teal)] transition-colors appearance-none cursor-pointer"
// //           >
// //             {listings.map(l => <option key={l.id} value={l.id}>{l.title} · {l.city} · {fmtPrice(l.price)}</option>)}
// //           </select>
// //         )}
// //       </motion.div>

// //       {/* Tool cards */}
// //       <div className="space-y-4">
// //         {TOOLS.map(({ key, label, color, icon: Icon, desc }, i) => (
// //           <motion.div
// //             key={key}
// //             initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.06, duration: 0.4 }}
// //             className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden"
// //           >
// //             {/* Header */}
// //             <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[var(--border)]">
// //               <div className="flex items-center gap-3">
// //                 <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
// //                   <Icon size={16} style={{ color }} strokeWidth={1.8} />
// //                 </div>
// //                 <div>
// //                   <div className="text-[13px] font-bold text-[var(--white)]">{label}</div>
// //                   <div className="text-[11px] text-[var(--muted)]">{desc}</div>
// //                 </div>
// //               </div>
// //               <motion.button
// //                 onClick={() => run(key)}
// //                 disabled={!selected || running[key]}
// //                 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
// //                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
// //                 style={{ background: `${color}12`, border: `1px solid ${color}30`, color }}
// //               >
// //                 {running[key] ? <><Loader2 size={12} className="animate-spin" /> Running…</> : <><Wand2 size={12} /> Run</>}
// //               </motion.button>
// //             </div>

// //             {/* Result */}
// //             <AnimatePresence>
// //               {results[key] && (
// //                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
// //                   <ResultCard data={results[key]} color={color} />
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>
// //           </motion.div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }


'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Wand2, CheckCircle2, AlertCircle, Loader2, Copy, Check, Sparkles, BarChart2 } from 'lucide-react';
import api from '@/lib/api';

interface Listing { id:string; title:string; price:number; city:string; status:string }

const TOOLS = [
  {
    key: 'price',     label: 'Price Analysis',    color: 'var(--teal)',   icon: BarChart2,    
    desc: 'Compare with similar listings to find your optimal price point',
  },
  {
    key: 'title',     label: 'Title Rewrite',     color: 'var(--purple)', icon: Wand2,
    desc: 'GPT-4o rewrites your title to maximise buyer attention and clicks',
  },
  {
    key: 'amenities', label: 'Missing Amenities', color: 'var(--green)',  icon: CheckCircle2,
    desc: 'Detects amenities buyers expect that your listing is missing',
  },
  {
    key: 'conversion',label: 'Conversion Score',  color: 'var(--gold)',   icon: Sparkles,
    desc: 'Overall 0–100 score with specific improvements to close deals faster',
  },
];

function fmtPrice(p: number) {
  if (!p) return '—';
  if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Cr`;
  if (p >= 100000)   return `₹${(p/100000).toFixed(2)} L`;
  return `₹${p.toLocaleString('en-IN')}`;
}

function CopyBtn({ text }: { text:string }) {
  const [c,setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(()=>setC(false),1600); }}
      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[var(--border)] text-[10px] text-[var(--dim)] hover:text-[var(--teal)] hover:border-[rgba(24,212,200,0.3)] transition-all flex-shrink-0"
      style={{ fontFamily:'var(--font-mono)' }}>
      {c ? <><Check size={10}/>Copied</> : <><Copy size={10}/>Copy</>}
    </button>
  );
}

// ── Result renderer ───────────────────────────────────────────────────────────
function ToolResult({ toolKey, data, color }: { toolKey:string; data:any; color:string }) {
  if (!data) return null;
  if (data.error) return (
    <div className="flex items-start gap-2.5 bg-[rgba(240,64,96,0.06)] border border-[rgba(240,64,96,0.2)] rounded-xl px-4 py-3">
      <AlertCircle size={13} className="text-[var(--red)] flex-shrink-0 mt-0.5"/>
      <span className="text-[12px] text-[var(--red)]">{data.error}</span>
    </div>
  );

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      className="overflow-hidden border rounded-xl" style={{ borderColor:`${color}25`, background:`${color}04` }}>

      {/* Price result */}
      {toolKey==='price' && data.recommended_price && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label:'Current',     val:fmtPrice(data.current_price),     c:'var(--muted)' },
              { label:'Recommended', val:fmtPrice(data.recommended_price), c:color         },
              { label:'Comparables', val:`${data.comparable_count||0} found`, c:'var(--dim)'},
            ].map(item=>(
              <div key={item.label} className="text-center p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[15px] font-extrabold" style={{ color:item.c, fontFamily:'var(--font-syne)' }}>{item.val}</div>
                <div className="text-[9px] uppercase tracking-[0.1em] text-[var(--dim)] mt-0.5" style={{ fontFamily:'var(--font-mono)' }}>{item.label}</div>
              </div>
            ))}
          </div>
          {data.analysis && <p className="text-[12px] text-[var(--muted)] leading-relaxed">{data.analysis}</p>}
        </div>
      )}

      {/* Title suggestions */}
      {toolKey==='title' && data.suggestions?.length > 0 && (
        <div className="p-4 space-y-2">
          {data.suggestions.map((t:string, i:number)=>(
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] group">
              <span className="text-[10px] font-bold text-[var(--dim)] w-5 flex-shrink-0 mt-0.5" style={{ fontFamily:'var(--font-mono)' }}>{i+1}</span>
              <span className="flex-1 text-[12px] text-[var(--white)] leading-relaxed">{t}</span>
              <CopyBtn text={t}/>
            </div>
          ))}
        </div>
      )}

      {/* Missing amenities */}
      {toolKey==='amenities' && (
        <div className="p-4">
          {!data.missing?.length ? (
            <div className="flex items-center gap-2 text-[var(--green)] text-[12px]">
              <CheckCircle2 size={14}/> All expected amenities present — excellent listing!
            </div>
          ) : (
            <div>
              <p className="text-[11px] text-[var(--dim)] mb-3" style={{ fontFamily:'var(--font-mono)' }}>
                {data.missing.length} amenities buyers commonly expect:
              </p>
              <div className="flex flex-wrap gap-2">
                {data.missing.map((a:string)=>(
                  <span key={a} className="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                    style={{ color, background:`${color}0E`, borderColor:`${color}30` }}>
                    + {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conversion score */}
      {toolKey==='conversion' && data.score !== undefined && (
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-5">
            {/* Score ring */}
            <div className="relative flex-shrink-0 w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="6"
                  strokeDasharray={`${2*Math.PI*32*(data.score/100)} ${2*Math.PI*32}`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[18px] font-extrabold" style={{ color, fontFamily:'var(--font-syne)' }}>{data.score}</span>
                <span className="text-[8px] text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>/100</span>
              </div>
            </div>
            {data.summary && <p className="text-[12px] text-[var(--muted)] leading-relaxed flex-1">{data.summary}</p>}
          </div>
          {data.improvements?.length>0 && (
            <ul className="space-y-1.5">
              {data.improvements.map((imp:string,i:number)=>(
                <li key={i} className="flex items-start gap-2 text-[12px] text-[var(--muted)]">
                  <span className="font-bold flex-shrink-0 mt-0.5" style={{ color }}>→</span>{imp}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function OptimizerPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState('');
  const [loadingL, setLoadingL] = useState(true);
  const [results,  setResults]  = useState<Record<string,any>>({});
  const [running,  setRunning]  = useState<Record<string,boolean>>({});

  useEffect(() => {
    api.get('/listings').then(r => {
      const ls = r.data.data.listings || [];
      setListings(ls);
      if (ls.length > 0) setSelected(ls[0].id);
    }).finally(() => setLoadingL(false));
  }, []);

  async function run(toolKey: string) {
    if (!selected) return;
    setRunning(p => ({ ...p, [toolKey]:true }));
    setResults(p => ({ ...p, [toolKey]:null }));
    try {
      const r = await api.post(`/optimizer/${toolKey}/${selected}`);
      setResults(p => ({ ...p, [toolKey]:r.data.data }));
    } catch (e:any) {
      setResults(p => ({ ...p, [toolKey]:{ error:e?.response?.data?.message||'Failed' } }));
    } finally {
      setRunning(p => ({ ...p, [toolKey]:false }));
    }
  }

  const selectedListing = listings.find(l => l.id === selected);

  return (
    <div className="max-w-3xl pb-8 space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <div>
        <h1 className="text-[1.5rem] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily:'var(--font-syne)' }}>AI Optimizer</h1>
        <p className="text-[13px] text-[var(--muted)] mt-0.5">GPT-4o analyses your listings and tells you exactly what to fix to close deals faster</p>
      </div>

      {/* ── Listing selector ── */}
      <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.06 }}
        className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
        <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--teal)] mb-3" style={{ fontFamily:'var(--font-mono)' }}>
          Select Listing to Analyse
        </div>
        {loadingL ? (
          <div className="h-11 rounded-xl bg-[var(--card)] animate-pulse"/>
        ) : listings.length === 0 ? (
          <p className="text-[13px] text-[var(--muted)]">No listings found. <a href="/dashboard/listings/new" className="text-[var(--teal)] hover:underline">Add one first →</a></p>
        ) : (
          <select value={selected} onChange={e=>{ setSelected(e.target.value); setResults({}); }}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] text-[var(--white)] outline-none focus:border-[var(--teal)] transition-colors appearance-none cursor-pointer">
            {listings.map(l=>(
              <option key={l.id} value={l.id}>{l.title} · {l.city} · {fmtPrice(l.price)}</option>
            ))}
          </select>
        )}
        {selectedListing && (
          <div className="flex items-center gap-2 mt-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)]"/>
            <span className="text-[10px] text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>
              {selectedListing.city} · {selectedListing.status} · {fmtPrice(selectedListing.price)}
            </span>
          </div>
        )}
      </motion.div>

      {/* ── Tool cards ── */}
      <div className="space-y-3">
        {TOOLS.map(({ key, label, color, icon:Icon, desc }, i) => (
          <motion.div key={key} initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1+i*0.06 }}
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">

            {/* Header row */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center justify-center flex-shrink-0 w-9 h-9 rounded-xl" style={{ background:`${color}12`, border:`1px solid ${color}25` }}>
                <Icon size={16} style={{ color }} strokeWidth={1.8}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-[var(--white)]">{label}</div>
                <div className="text-[11px] text-[var(--dim)]">{desc}</div>
              </div>
              <motion.button
                onClick={() => run(key)}
                disabled={!selected || running[key]}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background:`${color}10`, border:`1px solid ${color}25`, color, fontFamily:'var(--font-mono)' }}>
                {running[key] ? <><Loader2 size={11} className="animate-spin"/>Running…</> : 'Run →'}
              </motion.button>
            </div>

            {/* Result */}
            <AnimatePresence>
              {(running[key] || results[key]) && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                  className="overflow-hidden">
                  <div className="p-4">
                    {running[key] ? (
                      <div className="flex items-center gap-3 text-[var(--muted)]">
                        <Loader2 size={14} className="flex-shrink-0 animate-spin" style={{ color }}/>
                        <span className="text-[12px]" style={{ fontFamily:'var(--font-mono)' }}>Analysing listing with GPT-4o…</span>
                      </div>
                    ) : (
                      <ToolResult toolKey={key} data={results[key]} color={color}/>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
