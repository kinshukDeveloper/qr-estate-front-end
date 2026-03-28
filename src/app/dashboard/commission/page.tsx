'use client';
import { CommissionCalculator } from '@/components/commission/CommissionCalculator';

export default function CommissionPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-16">
      <div className="mb-6">
        <div className="text-[9px] font-black tracking-widest text-amber-400/70 uppercase mb-1">F07 · Tool</div>
        <h1 className="text-2xl font-black text-white font-['Syne',sans-serif]">Commission Calculator</h1>
        <p className="text-sm text-white/40 mt-1">Stamp duty, registration, GST, TDS — all 28 Indian states.</p>
      </div>
      <CommissionCalculator />
    </div>
  );
}
