// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useAuthStore } from '@/store/authStore';
// import { useAuth } from '@/hooks/useAuth';
// import { authAPI } from '@/lib/api';
// import { Input } from '@/components/ui/Input';
// import { Button } from '@/components/ui/Button';
// import { User, Phone, FileText, LogOut } from 'lucide-react';
// import axios from 'axios';

// const profileSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters').max(80),
//   phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number').optional().or(z.literal('')),
//   rera_number: z.string().min(3).max(50).optional().or(z.literal('')),
// });

// type ProfileForm = z.infer<typeof profileSchema>;

// export default function SettingsPage() {
//   const { user, updateUser } = useAuthStore();
//   const { logout } = useAuth();
//   const [saving, setSaving] = useState(false);
//   const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       name: user?.name || '',
//       phone: user?.phone || '',
//       rera_number: user?.rera_number || '',
//     },
//   });

//   async function onSave(data: ProfileForm) {
//     setSaving(true);
//     setSaveMsg(null);
//     try {
//       const res = await authAPI.updateProfile({
//         name: data.name,
//         phone: data.phone || undefined,
//         rera_number: data.rera_number || undefined,
//       });
//       updateUser(res.data.data.user);
//       setSaveMsg({ type: 'success', text: 'Profile updated successfully.' });
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         setSaveMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update.' });
//       }
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="max-w-xl space-y-8 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-black text-white">Settings</h1>
//         <p className="text-[#7A95AE] text-sm mt-1">Manage your profile and account</p>
//       </div>

//       {/* Profile section */}
//       <div className="bg-[#111C28] border border-[#1A2D40] p-6">
//         {/* Avatar */}
//         <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#1A2D40]">
//           <div className="w-14 h-14 bg-[#00D4C8] flex items-center justify-center text-xl font-black text-[#080F17]">
//             {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
//           </div>
//           <div>
//             <div className="font-bold text-white">{user?.name}</div>
//             <div className="text-sm text-[#7A95AE]">{user?.email}</div>
//             <div className="text-xs text-[#4A6580] mt-0.5 capitalize">{user?.role?.replace('_', ' ')}</div>
//           </div>
//         </div>

//         {saveMsg && (
//           <div className={`mb-5 px-4 py-3 text-sm border ${
//             saveMsg.type === 'success'
//               ? 'bg-[rgba(46,204,138,0.06)] border-[rgba(46,204,138,0.2)] text-[#2ECC8A]'
//               : 'bg-[rgba(255,77,106,0.06)] border-[rgba(255,77,106,0.2)] text-[#FF4D6A]'
//           }`}>
//             {saveMsg.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSave)} className="space-y-4">
//           <Input
//             label="Full Name"
//             leftIcon={<User size={16} />}
//             error={errors.name?.message}
//             {...register('name')}
//           />
//           <Input
//             label="Mobile Number"
//             type="tel"
//             leftIcon={<span className="text-xs font-bold text-[#4A6580]">+91</span>}
//             error={errors.phone?.message}
//             {...register('phone')}
//           />
//           <Input
//             label="RERA Number"
//             leftIcon={<FileText size={16} />}
//             hint="Displayed on your public listings"
//             error={errors.rera_number?.message}
//             {...register('rera_number')}
//           />

//           <div className="pt-2">
//             <Button type="submit" isLoading={saving}>
//               Save Changes
//             </Button>
//           </div>
//         </form>
//       </div>

//       {/* Account section */}
//       <div className="bg-[#111C28] border border-[#1A2D40] p-6">
//         <h2 className="mb-1 text-sm font-bold text-white">Account</h2>
//         <p className="text-xs text-[#4A6580] mb-4">Manage your session</p>
//         <Button variant="danger" onClick={logout} className="flex items-center gap-2">
//           <LogOut size={14} />
//           Sign Out
//         </Button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, FileText, LogOut, Check, AlertTriangle, ShieldCheck, Bell, Palette } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/api';
import axios from 'axios';

const profileSchema = z.object({
  name:        z.string().min(2, 'At least 2 characters').max(80),
  phone:       z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian number').optional().or(z.literal('')),
  rera_number: z.string().min(3).max(50).optional().or(z.literal('')),
});
type ProfileForm = z.infer<typeof profileSchema>;

// ── Shared section wrapper ────────────────────────────────────────────────────
function Section({ title, color, icon: Icon, children }: { title: string; color: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
          <Icon size={15} style={{ color }} strokeWidth={1.8} />
        </div>
        <span className="text-[13px] font-bold text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>{title}</span>
      </div>
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-[var(--red)]" style={{ fontFamily: 'var(--font-mono)' }}>{error}</p>}
    </div>
  );
}

function Input({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dim)] pointer-events-none" />}
      <input
        {...props}
        className={`w-full bg-[var(--card)] border border-[var(--border)] rounded-xl text-[var(--white)] text-[13px] py-3 pr-4 outline-none focus:border-[var(--teal)] focus:shadow-[0_0_0_3px_rgba(24,212,200,0.08)] transition-all placeholder:text-[var(--dim)] ${Icon ? 'pl-10' : 'pl-4'}`}
      />
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { logout } = useAuth();
  const [saving,  setSaving]  = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '', rera_number: user?.rera_number || '' },
  });

  async function onSave(data: ProfileForm) {
    setSaving(true); setSaveMsg(null);
    try {
      const res = await authAPI.updateProfile({ name: data.name, phone: data.phone || undefined, rera_number: data.rera_number || undefined });
      updateUser(res.data.data.user);
      setSaveMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      if (axios.isAxiosError(err)) setSaveMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally { setSaving(false); }
  }

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AG';

  return (
    <div className="max-w-2xl pb-8 space-y-5">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[1.5rem] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>Settings</h1>
        <p className="text-[13px] text-[var(--muted)] mt-0.5">Manage your profile, preferences, and account</p>
      </motion.div>

      {/* Profile section */}
      <Section title="Profile" color="var(--teal)" icon={User}>
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-[20px] font-black text-[var(--bg)]"
            style={{ background: 'linear-gradient(135deg,var(--teal),var(--purple))' }}>
            {initials}
          </div>
          <div>
            <div className="text-[15px] font-bold text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>{user?.name || 'Agent'}</div>
            <div className="text-[12px] text-[var(--muted)]">{user?.email}</div>
            <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--dim)] mt-0.5 capitalize" style={{ fontFamily: 'var(--font-mono)' }}>
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {saveMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-3 mb-4 text-[12px] border ${saveMsg.type === 'success' ? 'bg-[rgba(40,216,144,0.06)] border-[rgba(40,216,144,0.2)] text-[var(--green)]' : 'bg-[rgba(240,64,96,0.06)] border-[rgba(240,64,96,0.2)] text-[var(--red)]'}`}>
              {saveMsg.type === 'success' ? <Check size={13} /> : <AlertTriangle size={13} />}
              {saveMsg.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Field label="Full Name" error={errors.name?.message}>
            <Input {...register('name')} icon={User} placeholder="Rajesh Kumar" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mobile (optional)" error={errors.phone?.message}>
              <div className="flex rounded-xl border border-[var(--border)] focus-within:border-[var(--teal)] focus-within:shadow-[0_0_0_3px_rgba(24,212,200,0.08)] transition-all overflow-hidden">
                <div className="flex items-center px-3 bg-[var(--card)] border-r border-[var(--border)]">
                  <span className="text-[11px] font-bold text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>+91</span>
                </div>
                <input {...register('phone')} type="tel" placeholder="9876543210"
                  className="flex-1 bg-transparent text-[var(--white)] text-[13px] px-3 py-3 outline-none placeholder:text-[var(--dim)]" />
              </div>
            </Field>
            <Field label="RERA Number (optional)" error={errors.rera_number?.message}>
              <Input {...register('rera_number')} icon={FileText} placeholder="RERA-PB-01-2023-001" />
            </Field>
          </div>

          <div className="flex justify-end pt-1">
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-[var(--bg)] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)', fontFamily: 'var(--font-syne)' }}>
              {saving ? 'Saving…' : <><Check size={14} /> Save changes</>}
            </motion.button>
          </div>
        </form>
      </Section>

      {/* Security */}
      <Section title="Security" color="var(--purple)" icon={ShieldCheck}>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
            <div>
              <div className="text-[13px] font-semibold text-[var(--white)]">Password</div>
              <div className="text-[11px] text-[var(--dim)] mt-0.5">Last changed: never</div>
            </div>
            <button className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[11px] text-[var(--muted)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all" style={{ fontFamily: 'var(--font-mono)' }}>
              Change →
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-[13px] font-semibold text-[var(--white)]">Two-factor authentication</div>
              <div className="text-[11px] text-[var(--dim)] mt-0.5">Adds an extra layer of security to your account</div>
            </div>
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>
              Coming soon
            </span>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" color="var(--gold)" icon={Bell}>
        <div className="space-y-3">
          {[
            { label: 'New lead notifications',        sub: 'WhatsApp + email when a buyer enquires', on: true },
            { label: 'QR scan alerts',                sub: 'Notify when a listing gets 10+ scans today', on: true },
            { label: 'Price alert triggers',          sub: 'When your listings\'s price alert emails are sent', on: false },
            { label: 'Follow-up sequence summaries',  sub: 'Daily digest of sent follow-ups', on: true },
            { label: 'Product updates',               sub: 'New features and platform changes', on: false },
          ].map(({ label, sub, on }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
              <div>
                <div className="text-[13px] font-semibold text-[var(--white)]">{label}</div>
                <div className="text-[11px] text-[var(--dim)] mt-0.5">{sub}</div>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${on ? 'bg-[var(--teal)]' : 'bg-[var(--border)]'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[rgba(240,64,96,0.2)] bg-[rgba(240,64,96,0.04)] p-5">
        <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--red)] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>Danger zone</div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-[13px] font-semibold text-[var(--white)]">Sign out of all devices</div>
            <div className="text-[11px] text-[var(--dim)] mt-0.5">Revoke all active sessions and refresh tokens</div>
          </div>
          <button onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(240,64,96,0.3)] text-[var(--red)] text-[12px] font-bold hover:bg-[rgba(240,64,96,0.08)] transition-all flex-shrink-0">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
