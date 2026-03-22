'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { agencyAPI } from '@/lib/agency';
import { useAuthStore } from '@/store/authStore';
import { Building2, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

function JoinPageInner() {
  const params  = useSearchParams();
  const router  = useRouter();
  const token   = params.get('token') ?? '';
  const user    = useAuthStore(s => s.user);

  const [invite, setInvite]     = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [joining, setJoining]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');

  // Validate token (public — no auth needed)
  useEffect(() => {
    if (!token) { setError('No invite token in URL.'); setLoading(false); return; }
    agencyAPI.validateToken(token)
      .then(res => setInvite(res.data.data.invite))
      .catch(e => setError(e?.response?.data?.message ?? 'Invalid or expired invite link.'))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleAccept() {
    if (!user) {
      // Redirect to login, come back here after
      router.push(`/auth/login?next=/join?token=${token}`);
      return;
    }
    setJoining(true);
    try {
      await agencyAPI.acceptInvite(token);
      setDone(true);
      setTimeout(() => router.push('/dashboard/team'), 2500);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to join. Please try again.');
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Loader2 size={24} className="text-[#00D4C8] animate-spin" />
        <p className="text-[#4A6580] text-sm">Validating invite…</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <CheckCircle2 size={40} className="text-[#00D4C8]" />
        <h2 className="text-xl font-bold text-white">You've joined {invite?.agency_name}!</h2>
        <p className="text-[#4A6580] text-sm">Redirecting to your team dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle size={32} className="text-[#FF4D6A]" />
        <h2 className="text-lg font-bold text-white">Invite Error</h2>
        <p className="text-[#4A6580] text-sm max-w-sm">{error}</p>
        <Link href="/dashboard" className="mt-4 text-[#00D4C8] text-sm hover:underline">
          Go to Dashboard →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-md bg-[#0D1821] border border-[#1A2D40] p-8">
        <Building2 size={32} className="text-[#00D4C8] mb-5" />

        <div className="text-[10px] font-bold tracking-[3px] text-[#4A6580] uppercase mb-2">
          Team Invitation
        </div>
        <h1 className="text-2xl font-black text-white mb-1">{invite?.agency_name}</h1>
        <p className="text-[#4A6580] text-sm mb-6">
          {invite?.invited_by_name
            ? `${invite.invited_by_name} invited you to join as `
            : 'You have been invited to join as '}
          <span className="text-[#00D4C8] font-bold">{invite?.role}</span>.
        </p>

        <div className="bg-[#080F17] border border-[#1A2D40] p-3 mb-6 text-sm text-[#7A95AE]">
          <div><span className="text-[#4A6580] text-xs">Invited email:</span> {invite?.email}</div>
          <div className="mt-1"><span className="text-[#4A6580] text-xs">Expires:</span> {new Date(invite?.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>

        {!user ? (
          <>
            <p className="text-[#4A6580] text-xs mb-4">
              You need to be logged in to accept this invite. If you don't have an account yet, register first — use the <strong className="text-white">same email</strong> as the invite.
            </p>
            <div className="flex gap-3">
              <Link
                href={`/auth/login?next=/join?token=${token}`}
                className="flex-1 text-center bg-[#00D4C8] text-[#080F17] font-bold text-sm py-2.5 hover:bg-[#00B8AD] transition-colors"
              >
                Log In
              </Link>
              <Link
                href={`/auth/register?next=/join?token=${token}`}
                className="flex-1 text-center border border-[#1A2D40] text-[#7A95AE] font-bold text-sm py-2.5 hover:border-[#00D4C8] hover:text-[#00D4C8] transition-colors"
              >
                Register
              </Link>
            </div>
          </>
        ) : (
          <>
            {user.email !== invite?.email && (
              <div className="flex items-center gap-2 bg-[#FF4D6A]/08 border border-[#FF4D6A]/30 text-[#FF4D6A] text-xs px-3 py-2 mb-4">
                <AlertTriangle size={12} />
                You are logged in as <strong className="ml-1">{user.email}</strong> but the invite was sent to <strong className="ml-1">{invite?.email}</strong>. Please log in with the correct account.
              </div>
            )}
            <button
              onClick={handleAccept}
              disabled={joining || user.email !== invite?.email}
              className="w-full bg-[#00D4C8] text-[#080F17] font-bold text-sm py-3 hover:bg-[#00B8AD] disabled:opacity-50 transition-colors"
            >
              {joining ? 'Joining…' : `Accept & Join ${invite?.agency_name}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#080F17]">
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 size={24} className="text-[#00D4C8] animate-spin" /></div>}>
        <JoinPageInner />
      </Suspense>
    </div>
  );
}
