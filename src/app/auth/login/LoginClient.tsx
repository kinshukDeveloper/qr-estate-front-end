// 'use client';

// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { useAuthStore } from '@/store/authStore';
// import { Input } from '@/components/ui/Input';
// import { Button } from '@/components/ui/Button';

// const loginSchema = z.object({
//   email: z.string().email('Enter a valid email address'),
//   password: z.string().min(1, 'Password is required'),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirectTo = searchParams.get('from') || '/dashboard';
//   const expired = searchParams.get('expired');

//   const { login, isLoading, error, clearError } = useAuth();
//   const { isAuthenticated, _hasHydrated } = useAuthStore();
//   const [showPassword, setShowPassword] = useState(false);

//   // Client-side redirect: if already authenticated after hydration, go to dashboard.
//   // This replaces the server middleware redirect (which used a potentially stale cookie).
//   useEffect(() => {
//     if (_hasHydrated && isAuthenticated) {
//       router.replace('/dashboard');
//     }
//   }, [_hasHydrated, isAuthenticated, router]);

//   useEffect(() => {
//     return () => clearError();
//   }, []);

//   async function onSubmit(data: LoginForm) {
//     await login(data, redirectTo);
//   }

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//   });

//   // Don't render the form until we know auth state — avoids flash of login
//   // form for users who are already authenticated.
//   if (!_hasHydrated) {
//     return <div className="flex items-center justify-center min-h-[200px]" />;
//   }

//   return (
//     <div className="animate-fade-in">
//       {expired && (
//         <div className="mb-6 px-4 py-3 bg-[rgba(255,184,48,0.08)] border border-[rgba(255,184,48,0.25)] text-[#FFB830] text-sm">
//           Your session expired. Please log in again.
//         </div>
//       )}

//       <div className="mb-8">
//         <h1 className="mb-2 text-3xl font-black text-white">Welcome back</h1>
//         <p className="text-[#7A95AE] text-sm">
//           Sign in to manage your listings and QR codes
//         </p>
//       </div>

//       {error && (
//         <div className="mb-6 px-4 py-3 bg-[rgba(255,77,106,0.08)] border border-[rgba(255,77,106,0.25)] text-[#FF4D6A] text-sm flex items-start gap-2">
//           <span className="flex-shrink-0 mt-0.5">⚠</span>
//           <span>{error}</span>
//         </div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
//             placeholder="Enter your password"
//             autoComplete="current-password"
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
//           <div className="flex justify-end mt-1.5">
//             <Link href="/auth/forgot-password" className="text-xs text-[#4A6580] hover:text-[#00D4C8] transition-colors">
//               Forgot password?
//             </Link>
//           </div>
//         </div>

//         <Button type="submit" fullWidth isLoading={isLoading} size="lg" className="mt-2">
//           Sign In
//         </Button>
//       </form>

//       <div className="flex items-center gap-4 my-6">
//         <div className="flex-1 h-px bg-[#1A2D40]" />
//         <span className="text-xs text-[#4A6580]">OR</span>
//         <div className="flex-1 h-px bg-[#1A2D40]" />
//       </div>

//       <p className="text-center text-sm text-[#7A95AE]">
//         New to QR Estate?{' '}
//         <Link href="/auth/register" className="text-[#00D4C8] font-semibold hover:underline">
//           Create an account
//         </Link>
//       </p>

//       <div className="mt-8 pt-6 border-t border-[#1A2D40] grid grid-cols-3 gap-4">
//         {[
//           { icon: '🔒', label: 'Secure login' },
//           { icon: '📋', label: 'RERA compliant' },
//           { icon: '🇮🇳', label: 'Made for India' },
//         ].map(({ icon, label }) => (
//           <div key={label} className="text-center">
//             <div className="mb-1 text-lg">{icon}</div>
//             <div className="text-[10px] text-[#4A6580] tracking-wide uppercase">{label}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

// ── Animated feature pill ─────────────────────────────────────────────────────
const FEATURES = [
  { icon: '⚡', text: 'QR code in 2 minutes' },
  { icon: '🤖', text: 'AI lead scoring' },
  { icon: '📊', text: 'Real-time analytics' },
  { icon: '🌍', text: '5 regional languages' },
  { icon: '✍️', text: 'EOI e-signature' },
  { icon: '📍', text: 'Neighbourhood scores' },
];

function FeaturePill({ icon, text, delay }: { icon: string; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5"
    >
      <span className="text-xs">{icon}</span>
      <span className="text-[11px] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>{text}</span>
    </motion.div>
  );
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/dashboard';
  const expired = searchParams.get('expired');

  const { login, isLoading, error, clearError } = useAuth();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    if (_hasHydrated && isAuthenticated) router.replace('/dashboard');
  }, [_hasHydrated, isAuthenticated, router]);

  useEffect(() => { return () => clearError(); }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  if (!_hasHydrated) return <div className="w-full max-w-[440px] h-[520px]" />;

  return (
    <div className="w-full max-w-[440px]">

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden"
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--teal), var(--gold), transparent)' }}
        />

        <div className="p-8">
          {/* Expired notice */}
          <AnimatePresence>
            {expired && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2.5 bg-[rgba(232,184,75,0.06)] border border-[rgba(232,184,75,0.2)] rounded-xl px-4 py-3 mb-6"
              >
                <Clock size={14} className="flex-shrink-0 text-gold" />
                <span className="text-[13px] text-[var(--gold)]">Session expired — please sign in again</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="mb-8">
            <div
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--teal)] mb-3"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Welcome back
            </div>
            <h1
              className="text-[1.75rem] tracking-tight text-[var(--white)] leading-tight"
              style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
            >
              Sign in to your<br />
              <span className="text-gradient-gold">QR Estate</span> account
            </h1>
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

          {/* Form */}
          <form onSubmit={handleSubmit(d => login(d, redirectTo))} className="space-y-4">

            {/* Email */}
            <div>
              <label
                className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Email address
              </label>
              <div className={`relative rounded-xl border transition-all duration-200 ${
                focused === 'email'
                  ? 'border-[var(--teal)] shadow-[0_0_0_3px_rgba(24,212,200,0.08)]'
                  : errors.email
                  ? 'border-[var(--red)]'
                  : 'border-[var(--border)] hover:border-[var(--border2)]'
              }`}>
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dim)] pointer-events-none"
                />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent text-[var(--white)] placeholder:text-[var(--dim)] text-[14px] pl-10 pr-4 py-3 rounded-xl outline-none"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-[11px] text-[var(--red)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--muted)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-[var(--dim)] hover:text-[var(--teal)] transition-colors"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Forgot?
                </Link>
              </div>
              <div className={`relative rounded-xl border transition-all duration-200 ${
                focused === 'password'
                  ? 'border-[var(--teal)] shadow-[0_0_0_3px_rgba(24,212,200,0.08)]'
                  : errors.password
                  ? 'border-[var(--red)]'
                  : 'border-[var(--border)] hover:border-[var(--border2)]'
              }`}>
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dim)] pointer-events-none"
                />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  autoComplete="current-password"
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent text-[var(--white)] placeholder:text-[var(--dim)] text-[14px] pl-10 pr-11 py-3 rounded-xl outline-none"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--dim)] hover:text-[var(--muted)] transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[11px] text-[var(--red)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[14px] overflow-hidden mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #F5D280 0%, #E8B84B 50%, #B89030 100%)', color: 'var(--bg)' }}
            >
              {/* Shimmer */}
              {!isLoading && (
                <span
                  className="absolute inset-0 bg-shimmer bg-[length:200%] animate-shimmer opacity-0 hover:opacity-100 transition-opacity"
                />
              )}
              <span className="relative z-10" style={{ fontFamily: 'var(--font-syne)', fontWeight: 700 }}>
                {isLoading ? 'Signing in…' : 'Sign In'}
              </span>
              {!isLoading && <ArrowRight size={15} className="relative z-10" />}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>
              New to QR Estate?
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Register link */}
          <Link href="/auth/register">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all text-[13px] font-semibold"
            >
              <Sparkles size={14} />
              Create a free account
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* ── Trust pills ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mt-5"
      >
        {FEATURES.map((f, i) => (
          <FeaturePill key={f.text} icon={f.icon} text={f.text} delay={0.45 + i * 0.06} />
        ))}
      </motion.div>
    </div>
  );
}
