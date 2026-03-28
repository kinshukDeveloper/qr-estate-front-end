'use client';

import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import api from '@/lib/api';
function fmt(p: number, currency = 'INR') {
    if (currency === 'INR') {
        if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)}Cr`;
        if (p >= 100000) return `₹${(p / 100000).toFixed(1)}L`;
        return `₹${Math.round(p).toLocaleString('en-IN')}`;
    }
    const symbols: Record<string, string> = { USD: '$', GBP: '£', EUR: '€', AED: 'AED', SGD: 'S$', AUD: 'A$', CAD: 'C$' };
    return `${symbols[currency] || currency} ${Math.round(p).toLocaleString()}`;
}
export default function EMICalculator({ defaultPrice }: { defaultPrice?: number }) {
    const [price, setPrice] = useState(defaultPrice?.toString() || '');
    const [dp, setDp] = useState('20');
    const [rate, setRate] = useState('8.7');
    const [tenure, setTenure] = useState('20');
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const p = parseFloat(price);
        if (!p) return;
        const t = setTimeout(() => {
            api.get('/v3/emi/calculate', { params: { propertyPrice: p, downPaymentPct: dp, annualRate: rate, tenureYears: tenure } })
                .then((r) => setResult(r.data.data)).catch(() => { });
        }, 500);
        return () => clearTimeout(t);
    }, [price, dp, rate, tenure]);

    return (
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
                <Calculator size={15} className="text-cyan-400" />
                <div className="text-sm font-bold text-white">Home Loan EMI Calculator</div>
            </div>
            <div className="p-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        { label: 'Property Price (₹)', val: price, set: setPrice, ph: '18000000', type: 'number' },
                        { label: 'Down Payment %', val: dp, set: setDp, ph: '20', type: 'number', min: 10, max: 90 },
                        { label: 'Interest Rate % p.a.', val: rate, set: setRate, ph: '8.7', type: 'number', step: '0.05' },
                        { label: 'Tenure (Years)', val: tenure, set: setTenure, ph: '20', type: 'number', min: 1, max: 30 },
                    ].map(({ label, val, set, ph, type, ...rest }) => (
                        <div key={label}>
                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">{label}</label>
                            <input type={type} value={val} onChange={(e) => set(e.target.value)} placeholder={ph} {...rest}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/40 transition-all placeholder:text-white/20" />
                        </div>
                    ))}
                </div>

                {result && (
                    <>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Monthly EMI', val: fmt(result.monthly_emi), color: 'text-cyan-400' },
                                { label: 'Loan Amount', val: fmt(result.loan_amount), color: 'text-white' },
                                { label: 'Total Interest', val: fmt(result.total_interest), color: 'text-amber-400' },
                            ].map(({ label, val, color }) => (
                                <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
                                    <div className={`text-base font-black ${color} font-['Syne',sans-serif]`}>{val}</div>
                                    <div className="text-[9px] text-white/25 mt-1">{label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-[11px] text-white/40 text-center">
                            Min. monthly income needed: <span className="font-bold text-white/70">{fmt(result.min_monthly_income_required)}</span>
                        </div>
                        {/* Bank comparison */}
                        <div>
                            <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-2">Best Rates Comparison</div>
                            <div className="space-y-1.5">
                                {result.bank_comparison?.slice(0, 5).map((b: any, i: number) => (
                                    <div key={b.bank} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${i === 0 ? 'bg-green-500/[0.05] border-green-500/20' : 'bg-white/[0.02] border-white/[0.05]'}`}>
                                        <span className="flex-shrink-0 text-sm">{b.logo}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-white">
                                                {b.bank}
                                                {i === 0 && <span className="text-[8px] font-black bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded-full">Lowest</span>}
                                            </div>
                                            <div className="text-[9px] text-white/30">{b.min_rate}%–{b.max_rate}% · {b.processing_fee}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-black text-cyan-400">{fmt(b.emi_min)}/mo</div>
                                            <div className="text-[9px] text-white/25">from</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
