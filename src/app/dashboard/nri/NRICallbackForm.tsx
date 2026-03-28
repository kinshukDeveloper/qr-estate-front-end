'use client';

import { useState, useEffect } from 'react';
import { Globe, Phone, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

export default function NRICallbackForm({ listingId }: { listingId?: string }) {
    const [countries, setCountries] = useState<any[]>([]);
    const [form, setForm] = useState({ name: '', email: '', phone: '', country: 'UAE', timezone: 'Asia/Dubai', preferredTime: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [converted, setConverted] = useState<any>(null);
    const [price, setPrice] = useState('');

    function fmt(p: number, currency = 'INR') {
        if (currency === 'INR') {
            if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)}Cr`;
            if (p >= 100000) return `₹${(p / 100000).toFixed(1)}L`;
            return `₹${Math.round(p).toLocaleString('en-IN')}`;
        }
        const symbols: Record<string, string> = { USD: '$', GBP: '£', EUR: '€', AED: 'AED', SGD: 'S$', AUD: 'A$', CAD: 'C$' };
        return `${symbols[currency] || currency} ${Math.round(p).toLocaleString()}`;
    }

    useEffect(() => {
        api.get('/v3/nri/countries').then((r) => setCountries(r.data.data.countries)).catch(() => { });
    }, []);

    useEffect(() => {
        const p = parseFloat(price);
        if (!p) return;
        const t = setTimeout(() => {
            api.get('/v3/nri/convert', { params: { amount: p } }).then((r) => setConverted(r.data.data)).catch(() => { });
        }, 600);
        return () => clearTimeout(t);
    }, [price]);

    const onCountryChange = (country: string) => {
        const found = countries.find((c) => c.country === country);
        setForm((p) => ({ ...p, country, timezone: found?.timezone || p.timezone }));
    };

    const submit = async () => {
        if (!form.name || !form.email) return;
        setStatus('loading');
        try {
            await api.post('/v3/nri/callback', { ...form, listingId });
            setStatus('success');
        } catch { setStatus('idle'); }
    };

    return (
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
                <Globe size={15} className="text-violet-400" />
                <div className="text-sm font-bold text-white">NRI Enquiry & Callback</div>
            </div>
            {status === 'success' ? (
                <div className="p-8 text-center">
                    <CheckCircle2 size={40} className="mx-auto mb-3 text-green-400" />
                    <div className="mb-2 text-base font-bold text-white">Callback Requested!</div>
                    <div className="text-sm text-white/40">The agent will contact you at your preferred time in your timezone.</div>
                </div>
            ) : (
                <div className="p-5 space-y-3">
                    {/* Currency converter */}
                    <div className="bg-violet-500/[0.05] border border-violet-500/15 rounded-xl p-3">
                        <div className="text-[9px] font-bold text-violet-400/70 uppercase tracking-widest mb-2">Price Converter</div>
                        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price in ₹"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-violet-500/40 transition-all placeholder:text-white/20 mb-2" />
                        {converted && (
                            <div className="flex flex-wrap gap-2">
                                {[['USD', converted.USD], ['GBP', converted.GBP], ['AED', converted.AED], ['SGD', converted.SGD], ['AUD', converted.AUD]].map(([cur, val]) => (
                                    <span key={String(cur)} className="text-[10px] bg-white/[0.04] border border-white/[0.08] text-white/60 px-2.5 py-1 rounded-full">
                                        {fmt(Number(val), String(cur))}
                                    </span>
                                ))}
                                {converted.source === 'fallback' && <span className="text-[9px] text-white/20">approx.</span>}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            { k: 'name', label: 'Full Name *', ph: 'Rajesh Kumar', type: 'text' },
                            { k: 'email', label: 'Email *', ph: 'raj@example.com', type: 'email' },
                            { k: 'phone', label: 'WhatsApp/Phone', ph: '+1 234 567 8900', type: 'tel' },
                        ].map(({ k, label, ph, type }) => (
                            <div key={k} className={k === 'email' ? 'sm:col-span-2' : ''}>
                                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">{label}</label>
                                <input type={type} value={(form as any)[k]} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/40 transition-all placeholder:text-white/20" />
                            </div>
                        ))}
                        <div>
                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Country *</label>
                            <select value={form.country} onChange={(e) => onCountryChange(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/40">
                                {(countries.length ? countries : [{ country: 'UAE', flag: '🇦🇪' }, { country: 'US', flag: '🇺🇸' }, { country: 'UK', flag: '🇬🇧' }]).map((c) => (
                                    <option key={c.country} value={c.country}>{c.flag} {c.country}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Best Time to Call</label>
                            <select value={form.preferredTime} onChange={(e) => setForm((p) => ({ ...p, preferredTime: e.target.value }))}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/40">
                                <option value="">Any time IST</option>
                                <option>Weekdays 8–10pm IST</option>
                                <option>Weekend mornings IST</option>
                                <option>Monday–Friday 6–8pm IST</option>
                                <option>Saturday 10am–1pm IST</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Message</label>
                        <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} rows={2} placeholder="Any specific requirements or questions..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/40 transition-all placeholder:text-white/20 resize-none" />
                    </div>
                    <button onClick={submit} disabled={status === 'loading' || !form.name || !form.email}
                        className="flex items-center justify-center w-full gap-2 py-3 text-sm font-bold text-white transition-all rounded-xl bg-violet-500 hover:bg-violet-400 active:scale-95 disabled:opacity-50">
                        {status === 'loading' ? <><span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" /> Submitting...</> : <><Phone size={14} /> Request Callback</>}
                    </button>
                </div>
            )}
        </div>
    );
}

