'use client';
import { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Lock, Globe, Trash2, CheckCircle2, XCircle, Clock, Download, Loader2, ChevronDown, Shield } from 'lucide-react';
import api from '@/lib/api';

const DOC_TYPES = [
    { value: 'floor_plan', label: 'Floor Plan' },
    { value: 'title_deed', label: 'Title Deed' },
    { value: 'rera_certificate', label: 'RERA Certificate' },
    { value: 'oc_cc', label: 'Occupancy Certificate' },
    { value: 'possession_letter', label: 'Possession Letter' },
    { value: 'noc', label: 'NOC' },
    { value: 'tax_receipt', label: 'Property Tax Receipt' },
    { value: 'sale_agreement', label: 'Sale Agreement Draft' },
    { value: 'other', label: 'Other' },
];

const STATUS_META = {
    pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pending' },
    approved: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Approved' },
    rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Rejected' },
    expired: { icon: Clock, color: 'text-white/30', bg: 'bg-white/5', border: 'border-white/10', label: 'Expired' },
};

function fmtSize(bytes?: number) {
    if (!bytes) return '';
    if (bytes > 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
}

interface Doc { id: string; doc_type: string; label: string; size_bytes?: number; is_public: boolean; created_at: string; }
interface Request { id: string; doc_label: string; doc_type: string; buyer_name: string; buyer_email: string; message?: string; status: string; created_at: string; }

export default function DocumentsPage({
    listingId,
}: {
    listingId?: string;
}) {
    const [docs, setDocs] = useState<Doc[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadPct, setUploadPct] = useState(0);
    const [form, setForm] = useState({ docType: 'floor_plan', label: '', isPublic: false });
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'docs' | 'requests'>('docs');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // const lid = listingId || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('listing') || '' : '');
    const lid = listingId || '';

    useEffect(() => {
        if (!lid) return;
        api.get(`/v3/listings/${lid}/documents`).then((r) => setDocs(r.data.data.documents)).catch(() => { });
        api.get(`/v3/listings/${lid}/documents/requests`).then((r) => setRequests(r.data.data.requests)).catch(() => { });
    }, [lid]);

    const handleUpload = async (file: File) => {
        if (!lid) { setError('No listing selected'); return; }
        if (!form.label) { setError('Enter a document label'); return; }
        setError(''); setUploading(true); setUploadPct(0);
        const fd = new FormData();
        fd.append('document', file);
        fd.append('docType', form.docType);
        fd.append('label', form.label);
        fd.append('isPublic', String(form.isPublic));
        try {
            const res = await api.post(`/v3/listings/${lid}/documents`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => { if (e.total) setUploadPct(Math.round((e.loaded * 100) / e.total)); },
            });
            setDocs((p) => [...p, res.data.data]);
            setForm((p) => ({ ...p, label: '' }));
        } catch (e: any) { setError(e?.response?.data?.message || 'Upload failed'); }
        finally { setUploading(false); setUploadPct(0); }
    };

    const handleDelete = async (docId: string) => {
        setActionLoading(docId);
        try { await api.delete(`/v3/documents/${docId}`); setDocs((p) => p.filter((d) => d.id !== docId)); }
        catch { setError('Delete failed'); }
        finally { setActionLoading(null); }
    };

    const handleApprove = async (reqId: string) => {
        setActionLoading(reqId);
        try {
            await api.post(`/v3/documents/requests/${reqId}/approve`);
            setRequests((p) => p.map((r) => r.id === reqId ? { ...r, status: 'approved' } : r));
        } catch { setError('Approval failed'); }
        finally { setActionLoading(null); }
    };

    const handleReject = async (reqId: string) => {
        setActionLoading(reqId);
        try {
            await api.post(`/v3/documents/requests/${reqId}/reject`);
            setRequests((p) => p.map((r) => r.id === reqId ? { ...r, status: 'rejected' } : r));
        } catch { setError('Rejection failed'); }
        finally { setActionLoading(null); }
    };

    const pendingCount = requests.filter((r) => r.status === 'pending').length;

    return (
        <div className="max-w-3xl pb-16 mx-auto space-y-5">
            {/* Header */}
            <div>
                <div className="text-[9px] font-black tracking-widest text-cyan-400/70 uppercase mb-1">F09 · Vault</div>
                <h1 className="text-2xl font-black text-white font-['Syne',sans-serif]">Document Vault</h1>
                <p className="mt-1 text-sm text-white/40">Upload property documents. Control who can access private files.</p>
            </div>

            {/* Upload form */}
            <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5 space-y-3">
                <div className="mb-3 text-xs font-bold tracking-widest uppercase text-white/40">Upload Document</div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Type</label>
                        <select value={form.docType} onChange={(e) => setForm((p) => ({ ...p, docType: e.target.value }))}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/40 transition-all">
                            {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Label</label>
                        <input value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                            placeholder="e.g. Floor Plan — Unit 4B"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/40 transition-all placeholder:text-white/20" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setForm((p) => ({ ...p, isPublic: !p.isPublic }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all
              ${form.isPublic ? 'bg-green-500/10 border-green-500/25 text-green-400' : 'bg-white/[0.03] border-white/10 text-white/40'}`}>
                        {form.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                        {form.isPublic ? 'Public (visible to all)' : 'Private (request required)'}
                    </button>
                </div>
                {error && <div className="text-xs text-red-400">{error}</div>}
                <div
                    onClick={() => !uploading && fileRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
                    onDragOver={(e) => e.preventDefault()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
            ${uploading ? 'border-cyan-500/40 bg-cyan-500/[0.03]' : 'border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/[0.02]'}`}>
                    <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                    {uploading ? (
                        <div>
                            <Loader2 size={24} className="mx-auto mb-2 text-cyan-400 animate-spin" />
                            <div className="mb-2 text-sm text-white">Uploading... {uploadPct}%</div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full transition-all rounded-full bg-cyan-400" style={{ width: `${uploadPct}%` }} /></div>
                        </div>
                    ) : (
                        <>
                            <Upload size={22} className="mx-auto mb-2 text-white/20" />
                            <div className="text-sm font-semibold text-white/60">Drop file or click to upload</div>
                            <div className="mt-1 text-xs text-white/25">PDF, JPG, PNG · Max 20MB</div>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {['docs', 'requests'].map((t) => (
                    <button key={t} onClick={() => setActiveTab(t as any)}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border capitalize
              ${activeTab === t ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400' : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/60'}`}>
                        {t === 'docs' ? <FileText size={12} /> : <Shield size={12} />}
                        {t === 'docs' ? 'Documents' : 'Access Requests'}
                        {t === 'requests' && pendingCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center">{pendingCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Documents list */}
            {activeTab === 'docs' && (
                <div className="space-y-2">
                    {docs.length === 0 && <div className="py-12 text-sm text-center text-white/30">No documents uploaded yet.</div>}
                    {docs.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 bg-[#0C0F14] border border-white/[0.06] rounded-xl px-4 py-3 hover:border-white/10 transition-all">
                            <div className="flex items-center justify-center flex-shrink-0 border rounded-lg w-9 h-9 bg-cyan-500/10 border-cyan-500/20">
                                <FileText size={15} className="text-cyan-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{doc.label}</div>
                                <div className="text-[10px] text-white/30 mt-0.5">
                                    {DOC_TYPES.find((d) => d.value === doc.doc_type)?.label} · {fmtSize(doc.size_bytes)}
                                </div>
                            </div>
                            <div className={`flex items-center gap-1.5 text-[9px] font-bold px-2 py-1 rounded-full border
                ${doc.is_public ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                {doc.is_public ? <Globe size={9} /> : <Lock size={9} />}
                                {doc.is_public ? 'Public' : 'Private'}
                            </div>
                            <button onClick={() => handleDelete(doc.id)} disabled={actionLoading === doc.id}
                                className="flex items-center justify-center transition-all rounded-lg w-7 h-7 text-white/25 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40">
                                {actionLoading === doc.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Access requests */}
            {activeTab === 'requests' && (
                <div className="space-y-2">
                    {requests.length === 0 && <div className="py-12 text-sm text-center text-white/30">No access requests yet.</div>}
                    {requests.map((req) => {
                        const sm = STATUS_META[req.status as keyof typeof STATUS_META] || STATUS_META.pending;
                        const SI = sm.icon;
                        return (
                            <div key={req.id} className={`bg-[#0C0F14] border rounded-xl p-4 transition-all
                ${req.status === 'pending' ? 'border-amber-500/20' : 'border-white/[0.06]'}`}>
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div>
                                        <div className="text-sm font-bold text-white">{req.buyer_name}</div>
                                        <div className="text-[10px] text-white/40">{req.buyer_email}</div>
                                    </div>
                                    <div className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full border ${sm.bg} ${sm.border} ${sm.color}`}>
                                        <SI size={9} />{sm.label}
                                    </div>
                                </div>
                                <div className="text-[11px] text-white/50 mb-2">
                                    Requesting: <span className="font-medium text-white/70">{req.doc_label}</span>
                                </div>
                                {req.message && <div className="text-[11px] text-white/35 italic mb-3">"{req.message}"</div>}
                                {req.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApprove(req.id)} disabled={!!actionLoading}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-all disabled:opacity-40">
                                            {actionLoading === req.id ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                                            Approve + Send Link
                                        </button>
                                        <button onClick={() => handleReject(req.id)} disabled={!!actionLoading}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/40 text-xs font-bold hover:text-red-400 hover:border-red-500/25 transition-all disabled:opacity-40">
                                            <XCircle size={11} /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
