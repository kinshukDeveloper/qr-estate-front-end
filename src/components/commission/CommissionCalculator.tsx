'use client';
import { useState, useEffect, useCallback } from 'react';
import { Calculator, Download, Info } from 'lucide-react';
import { commissionAPI, type CommissionResult } from '@/lib/features';

interface CommissionCalcProps {
  defaultPrice?: number;
  defaultState?: string;
  defaultType?: 'sale' | 'rent';
  compact?: boolean;
}

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'joint', label: 'Joint' }];

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export function CommissionCalculator({ defaultPrice, defaultState = 'maharashtra', defaultType = 'sale', compact = false }: CommissionCalcProps) {
  const [price, setPrice]   = useState(defaultPrice?.toString() || '');
  const [state, setState]   = useState(defaultState);
  const [gender, setGender] = useState('male');
  const [type, setType]     = useState(defaultType);
  const [customRate, setCR] = useState('');
  const [result, setResult] = useState<CommissionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [states, setStates]   = useState<{ value: string; label: string }[]>([]);

  useEffect(() => { commissionAPI.getStates().then((r) => setStates(r.data.data.states)); }, []);

  const calculate = useCallback(async () => {
    const p = parseFloat(price);
    if (!p || p <= 0) return;
    setLoading(true);
    try {
      const res = await commissionAPI.calculate({
        price: p, state, buyerGender: gender,
        customCommissionRate: customRate ? parseFloat(customRate) : undefined,
        isRent: type === 'rent',
      });
      setResult(res.data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [price, state, gender, customRate, type]);

  // Auto-recalculate on input change with debounce
  useEffect(() => {
    const t = setTimeout(calculate, 500);
    return () => clearTimeout(t);
  }, [calculate]);

  return (
    <div className={`bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden ${compact ? '' : 'max-w-2xl'}`}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06] bg-[#0A0D12]">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Calculator size={14} className="text-amber-400" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">Commission Calculator</div>
          <div className="text-[10px] text-white/30">Stamp duty · Registration · GST · TDS</div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Type toggle */}
        <div className="flex gap-2">
          {(['sale', 'rent'] as const).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border capitalize
                ${type === t ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/60'}`}>
              For {t}
            </button>
          ))}
        </div>

        {/* Price input */}
        <div>
          <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">
            {type === 'rent' ? 'Monthly Rent (₹)' : 'Sale Price (₹)'}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 18000000"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white outline-none focus:border-amber-500/40 transition-all" />
          </div>
          {price && parseFloat(price) > 0 && (
            <div className="text-[10px] text-amber-400/70 mt-1">{fmt(parseFloat(price))}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* State */}
          {type === 'sale' && (
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">State</label>
              <select value={state} onChange={(e) => setState(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-500/40 transition-all">
                {states.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          )}

          {/* Buyer gender (affects stamp duty) */}
          {type === 'sale' && (
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Buyer</label>
              <div className="flex gap-1">
                {GENDERS.map((g) => (
                  <button key={g.value} onClick={() => setGender(g.value)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all border
                      ${gender === g.value ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/[0.02] border-white/10 text-white/30 hover:text-white/50'}`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Custom commission rate */}
        <div>
          <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">
            Custom Commission % <span className="normal-case text-white/20">(leave blank for auto)</span>
          </label>
          <input type="number" step="0.25" min="0" max="10" value={customRate} onChange={(e) => setCR(e.target.value)} placeholder="Auto"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/40 transition-all" />
        </div>

        {/* Results */}
        {loading && <div className="h-32 flex items-center justify-center"><div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" /></div>}

        {result && !loading && (
          <div className="space-y-1.5 mt-2">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Breakdown</div>
            {result.breakdown.map((row, i) => (
              <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-lg
                ${row.highlight ? 'bg-amber-500/[0.06] border border-amber-500/20' : 'bg-white/[0.02]'}`}>
                <span className={`text-xs ${row.highlight ? 'font-bold text-amber-400' : 'text-white/50'}`}>{row.label}</span>
                <span className={`text-sm font-bold ${row.highlight ? 'text-amber-400' : row.amount < 0 ? 'text-red-400' : 'text-white'}`}>
                  {row.amount < 0 ? '-' : ''}{fmt(Math.abs(row.amount))}
                </span>
              </div>
            ))}

            {result.tds?.applicable && (
              <div className="flex items-start gap-2 mt-2 p-3 bg-blue-500/[0.04] border border-blue-500/20 rounded-xl">
                <Info size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-blue-400/80 leading-relaxed">
                  TDS of 1% is deducted by the buyer and deposited to IT Dept since sale value exceeds ₹50L (Section 194IA).
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
