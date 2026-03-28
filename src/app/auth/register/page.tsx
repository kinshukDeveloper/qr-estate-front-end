// 'use client';

// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Eye, EyeOff, Mail, Lock, User, Phone, FileText, CheckCircle } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { useAuthStore } from '@/store/authStore';
// import { Input } from '@/components/ui/Input';
// import { Button } from '@/components/ui/Button';

// const registerSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters').max(80),
//   email: z.string().email('Enter a valid email address'),
//   password: z
//     .string()
//     .min(8, 'Minimum 8 characters')
//     .regex(/[A-Z]/, 'Must contain an uppercase letter')
//     .regex(/[a-z]/, 'Must contain a lowercase letter')
//     .regex(/[0-9]/, 'Must contain a number'),
//   phone: z
//     .string()
//     .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
//     .optional()
//     .or(z.literal('')),
//   rera_number: z.string().min(3, 'Minimum 3 characters').max(50).optional().or(z.literal('')),
// });

// type RegisterForm = z.infer<typeof registerSchema>;

// const PASSWORD_RULES = [
//   { label: '8+ characters',    test: (v: string) => v.length >= 8 },
//   { label: 'Uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
//   { label: 'Lowercase letter', test: (v: string) => /[a-z]/.test(v) },
//   { label: 'Number',           test: (v: string) => /[0-9]/.test(v) },
// ];

// export default function RegisterPage() {
//   const router = useRouter();
//   const { register: registerUser, isLoading, error, clearError } = useAuth();
//   const { isAuthenticated, _hasHydrated } = useAuthStore();
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordValue, setPasswordValue] = useState('');

//   // Client-side redirect if already authenticated
//   useEffect(() => {
//     if (_hasHydrated && isAuthenticated) {
//       router.replace('/dashboard');
//     }
//   }, [_hasHydrated, isAuthenticated, router]);

//   useEffect(() => () => clearError(), []);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

//   const watchedPassword = watch('password', '');
//   useEffect(() => setPasswordValue(watchedPassword || ''), [watchedPassword]);

//   async function onSubmit(data: RegisterForm) {
//     await registerUser({
//       name: data.name,
//       email: data.email,
//       password: data.password,
//       phone: data.phone || undefined,
//       rera_number: data.rera_number || undefined,
//     });
//   }

//   if (!_hasHydrated) {
//     return <div className="flex items-center justify-center min-h-[200px]" />;
//   }

//   return (
//     <div className="animate-fade-in">
//       <div className="mb-8">
//         <h1 className="mb-2 text-3xl font-black text-white">Create your account</h1>
//         <p className="text-[#7A95AE] text-sm">
//           Start listing properties with QR codes in minutes
//         </p>
//       </div>

//       {error && (
//         <div className="mb-6 px-4 py-3 bg-[rgba(255,77,106,0.08)] border border-[rgba(255,77,106,0.25)] text-[#FF4D6A] text-sm flex items-start gap-2">
//           <span className="flex-shrink-0 mt-0.5">⚠</span>
//           <span>{error}</span>
//         </div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <Input
//           label="Full Name"
//           placeholder="Rajesh Kumar"
//           autoComplete="name"
//           leftIcon={<User size={16} />}
//           error={errors.name?.message}
//           {...register('name')}
//         />

//         <Input
//           label="Email Address"
//           type="email"
//           placeholder="you@example.com"
//           autoComplete="email"
//           leftIcon={<Mail size={16} />}
//           error={errors.email?.message}
//           {...register('email')}
//         />

//         <div>
//           <Input
//             label="Password"
//             type={showPassword ? 'text' : 'password'}
//             placeholder="Create a strong password"
//             autoComplete="new-password"
//             leftIcon={<Lock size={16} />}
//             rightIcon={
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="text-[#4A6580] hover:text-white transition-colors p-0.5"
//                 tabIndex={-1}
//               >
//                 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//               </button>
//             }
//             error={errors.password?.message}
//             {...register('password')}
//           />
//           {passwordValue && (
//             <div className="mt-2 grid grid-cols-2 gap-1.5">
//               {PASSWORD_RULES.map(({ label, test }) => {
//                 const passes = test(passwordValue);
//                 return (
//                   <div key={label} className={`flex items-center gap-1.5 text-xs transition-colors ${passes ? 'text-[#2ECC8A]' : 'text-[#4A6580]'}`}>
//                     <CheckCircle size={11} className={passes ? 'opacity-100' : 'opacity-30'} />
//                     {label}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         <Input
//           label="Mobile Number (optional)"
//           type="tel"
//           placeholder="9876543210"
//           autoComplete="tel"
//           leftIcon={<span className="text-xs font-bold text-[#4A6580]">+91</span>}
//           hint="For WhatsApp lead notifications"
//           error={errors.phone?.message}
//           {...register('phone')}
//         />

//         <Input
//           label="RERA Number (optional)"
//           placeholder="RERA-PB-01-2023-001234"
//           leftIcon={<FileText size={16} />}
//           hint="Builds trust with buyers — displayed on your listings"
//           error={errors.rera_number?.message}
//           {...register('rera_number')}
//         />

//         <p className="text-xs text-[#4A6580] leading-relaxed pt-1">
//           By creating an account you agree to our{' '}
//           <Link href="/terms" className="text-[#00D4C8] hover:underline">Terms of Service</Link>
//           {' '}and{' '}
//           <Link href="/privacy" className="text-[#00D4C8] hover:underline">Privacy Policy</Link>.
//         </p>

//         <Button type="submit" fullWidth isLoading={isLoading} size="lg">
//           Create Account
//         </Button>
//       </form>

//       <div className="flex items-center gap-4 my-6">
//         <div className="flex-1 h-px bg-[#1A2D40]" />
//         <span className="text-xs text-[#4A6580]">ALREADY HAVE AN ACCOUNT?</span>
//         <div className="flex-1 h-px bg-[#1A2D40]" />
//       </div>

//       <Link href="/auth/login">
//         <Button variant="outline" fullWidth>
//           Sign In Instead
//         </Button>
//       </Link>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, FileText,
  Check, ArrowRight, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

const registerSchema = z.object({
  name:        z.string().min(2, 'At least 2 characters').max(80),
  email:       z.string().email('Enter a valid email'),
  password:    z
    .string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Needs an uppercase letter')
    .regex(/[a-z]/, 'Needs a lowercase letter')
    .regex(/[0-9]/, 'Needs a number'),
  phone:       z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian number').optional().or(z.literal('')),
  rera_number: z.string().min(3).max(50).optional().or(z.literal('')),
});
type RegisterForm = z.infer<typeof registerSchema>;

const PW_RULES = [
  { label: '8+ chars',   test: (v: string) => v.length >= 8 },
  { label: 'Uppercase',  test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Lowercase',  test: (v: string) => /[a-z]/.test(v) },
  { label: 'Number',     test: (v: string) => /[0-9]/.test(v) },
];

// ── Reusable V3 field ──────────────────────────────────────────────────────────
function Field({
  label, error, icon: Icon, hint, children, mono,
}: {
  label: string; error?: string; icon?: React.ElementType;
  hint?: string; children: React.ReactNode; mono?: boolean;
}) {
  return (
    <div>
      <label
        className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {label}
      </label>
      <div className={`relative rounded-xl border transition-all duration-200 ${
        error ? 'border-[var(--red)]' : 'border-[var(--border)] focus-within:border-[var(--teal)] focus-within:shadow-[0_0_0_3px_rgba(24,212,200,0.08)] hover:border-[var(--border2)]'
      }`}>
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dim)] pointer-events-none" />}
        {children}
      </div>
      {hint && !error && <p className="mt-1 text-[11px] text-[var(--dim)]">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-[11px] text-[var(--red)]" style={{ fontFamily: 'var(--font-mono)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

function InputInner({ hasIcon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { hasIcon?: boolean }) {
  return (
    <input
      {...props}
      className={`w-full bg-transparent text-[var(--white)] placeholder:text-[var(--dim)] text-[14px] py-3 rounded-xl outline-none ${hasIcon ? 'pl-10 pr-4' : 'px-4'}`}
    />
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [showPw, setShowPw]   = useState(false);
  const [pwValue, setPwValue] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    if (_hasHydrated && isAuthenticated) router.replace('/dashboard');
  }, [_hasHydrated, isAuthenticated, router]);
  useEffect(() => () => clearError(), []);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    const sub = watch((v) => setPwValue(v.password || ''));
    return () => sub.unsubscribe();
  }, [watch]);

  if (!_hasHydrated) return <div className="w-full max-w-[480px] h-[600px]" />;

  return (
    <div className="w-full max-w-[480px]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden"
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), var(--teal), transparent)' }}
        />

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
              Free · No card required
            </div>
            <h1 className="text-[1.75rem] tracking-tight text-[var(--white)] leading-tight" style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}>
              Start listing with<br />
              <span className="text-gradient-teal">QR codes today</span>
            </h1>
            <p className="mt-2 text-[13px] text-[var(--muted)]">5 free listings. No credit card. RERA-ready.</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-2.5 bg-[rgba(240,64,96,0.06)] border border-[rgba(240,64,96,0.2)] rounded-xl px-4 py-3 mb-6"
              >
                <AlertTriangle size={14} className="text-[var(--red)] flex-shrink-0 mt-0.5" />
                <span className="text-[13px] text-[var(--red)]">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={handleSubmit(d => registerUser({
              name: d.name, email: d.email, password: d.password,
              phone: d.phone || undefined, rera_number: d.rera_number || undefined,
            }))}
            className="space-y-4"
          >
            {/* Name */}
            <Field label="Full Name" error={errors.name?.message} icon={User}>
              <InputInner {...register('name')} placeholder="Rajesh Kumar" autoComplete="name" hasIcon />
            </Field>

            {/* Email */}
            <Field label="Email Address" error={errors.email?.message} icon={Mail}>
              <InputInner {...register('email')} type="email" placeholder="you@example.com" autoComplete="email" hasIcon />
            </Field>

            {/* Password */}
            <div>
              <Field label="Password" error={errors.password?.message} icon={Lock}>
                <InputInner
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  hasIcon
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--dim)] hover:text-[var(--muted)] transition-colors p-0.5"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </Field>

              {/* Password strength */}
              <AnimatePresence>
                {pwValue && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-1.5 mt-2.5"
                  >
                    {PW_RULES.map(({ label, test }) => {
                      const ok = test(pwValue);
                      return (
                        <div key={label} className={`flex items-center gap-1.5 text-[11px] transition-colors ${ok ? 'text-[var(--green)]' : 'text-[var(--dim)]'}`}>
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${ok ? 'bg-[rgba(40,216,144,0.15)]' : 'border border-[var(--border)]'}`}>
                            {ok && <Check size={8} />}
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{label}</span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phone + RERA side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  Mobile <span className="text-[var(--dim)]">(optional)</span>
                </label>
                <div className="flex rounded-xl border border-[var(--border)] focus-within:border-[var(--teal)] focus-within:shadow-[0_0_0_3px_rgba(24,212,200,0.08)] hover:border-[var(--border2)] transition-all overflow-hidden">
                  <div className="flex items-center justify-center px-2.5 border-r border-[var(--border)] bg-[var(--card)]">
                    <span className="text-[11px] font-bold text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>+91</span>
                  </div>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="9876543210"
                    className="flex-1 bg-transparent text-[var(--white)] placeholder:text-[var(--dim)] text-[13px] px-2.5 py-3 outline-none min-w-0"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-[10px] text-[var(--red)]" style={{ fontFamily: 'var(--font-mono)' }}>{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  RERA No. <span className="text-[var(--dim)]">(optional)</span>
                </label>
                <div className="relative rounded-xl border border-[var(--border)] focus-within:border-[var(--teal)] focus-within:shadow-[0_0_0_3px_rgba(24,212,200,0.08)] hover:border-[var(--border2)] transition-all">
                  <FileText size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dim)] pointer-events-none" />
                  <input
                    {...register('rera_number')}
                    placeholder="RERA-XX-001"
                    className="w-full bg-transparent text-[var(--white)] placeholder:text-[var(--dim)] text-[12px] pl-8 pr-3 py-3 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="text-[11px] text-[var(--dim)] leading-relaxed">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="text-[var(--teal)] hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[var(--teal)] hover:underline">Privacy Policy</Link>.
            </p>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[14px] overflow-hidden mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #F5D280 0%, #E8B84B 50%, #B89030 100%)', color: 'var(--bg)' }}
            >
              <span className="relative z-10" style={{ fontFamily: 'var(--font-syne)', fontWeight: 700 }}>
                {isLoading ? 'Creating account…' : 'Create Free Account'}
              </span>
              {!isLoading && <ArrowRight size={15} className="relative z-10" />}
            </motion.button>
          </form>

          {/* Sign in link */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>
              Already have an account?
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <Link href="/auth/login">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all text-[13px] font-semibold"
            >
              Sign in instead →
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
