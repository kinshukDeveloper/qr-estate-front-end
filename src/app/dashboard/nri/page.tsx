'use client';
import { useState, useEffect } from 'react';
import { Globe, Phone, Calculator, ChevronDown, CheckCircle2, TrendingDown } from 'lucide-react';
import api from '@/lib/api';
import NRICallbackForm from './NRICallbackForm';
import EMICalculator from './EMICalculator';






// ── Combined NRI + EMI page ───────────────────────────────────────────────────
export default function NRIPage() {
  return (
    <div className="max-w-3xl pb-16 mx-auto space-y-6">
      <div>
        <div className="text-[9px] font-black tracking-widest text-violet-400/70 uppercase mb-1">F16 + F17</div>
        <h1 className="text-2xl font-black text-white font-['Syne',sans-serif]">NRI Portal & Home Loan EMI</h1>
        <p className="mt-1 text-sm text-white/40">Currency converter, callback scheduler, and home loan calculator.</p>
      </div>
      <NRICallbackForm />
      <EMICalculator />
    </div>
  );
}


