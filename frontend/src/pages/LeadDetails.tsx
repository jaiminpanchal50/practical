import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import useLead from "../features/leads/useLead";
import type { LeadStatus } from "../types/lead.types";

const STATUS_CONFIG: Record<LeadStatus, { label: string; badgeClass: string; dotClass: string }> = {
    new: {
        label: "New",
        badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        dotClass: "bg-sky-400",
    },
    contacted: {
        label: "Contacted",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        dotClass: "bg-amber-400",
    },
    qualified: {
        label: "Qualified",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        dotClass: "bg-emerald-400",
    },
    lost: {
        label: "Lost",
        badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        dotClass: "bg-rose-400",
    },
};

export default function LeadDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        fetchLeadById,
        fetchLeadNotes,
        updateLeadStatus,
        deleteLead,
        createLeadNote,
    } = useLead();

    const [lead, setLead] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Add Note Form State
    const [noteContent, setNoteContent] = useState("");
    const [submittingNote, setSubmittingNote] = useState(false);
    const [noteError, setNoteError] = useState<string | null>(null);

    // Status Update State
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const loadLeadData = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const [leadData, notesData] = await Promise.all([
                fetchLeadById(id),
                fetchLeadNotes(id),
            ]);
            setLead(leadData);
            setNotes(notesData);
        } catch (err: any) {
            console.error("Error loading lead details:", err);
            setError(err?.response?.data?.message || "Failed to load lead details");
        } finally {
            setLoading(false);
        }
    }, [id, fetchLeadById, fetchLeadNotes]);

    useEffect(() => {
        loadLeadData();
    }, [loadLeadData]);

    const handleStatusChange = async (newStatus: LeadStatus) => {
        if (!id || !lead || lead.status === newStatus) return;
        try {
            setUpdatingStatus(true);
            const updated = await updateLeadStatus(id, newStatus);
            setLead(updated);
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDeleteLead = async () => {
        if (!id || !lead) return;
        if (!confirm(`Are you sure you want to delete lead "${lead.name}"? This will also remove all attached notes.`)) {
            return;
        }
        try {
            await deleteLead(id);
            navigate("/");
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to delete lead");
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !noteContent.trim()) return;

        try {
            setSubmittingNote(true);
            setNoteError(null);
            const created = await createLeadNote(id, noteContent.trim());
            // Add new note to the top of the list
            setNotes((prev) => [created, ...prev]);
            setNoteContent("");
        } catch (err: any) {
            console.error("Error creating note:", err);
            setNoteError(err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message || "Failed to add note");
        } finally {
            setSubmittingNote(false);
        }
    };

    if (loading) {
        return (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading lead details...</span>
            </div>
        );
    }

    if (error || !lead) {
        return (
            <div className="max-w-xl mx-auto p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <h2 className="text-lg font-bold text-white">{error || "Lead Not Found"}</h2>
                <p className="text-xs text-slate-400 mt-1">The lead you are looking for does not exist or was removed.</p>
                <Link
                    to="/"
                    className="inline-block mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
                >
                    &larr; Back to Leads List
                </Link>
            </div>
        );
    }

    const currentStatusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Top Navigation Breadcrumb */}
            <div className="flex items-center justify-between">
                <Link
                    to="/"
                    className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <span>Back to all leads</span>
                </Link>

                <button
                    onClick={handleDeleteLead}
                    className="px-3 py-1.5 text-xs text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span>Delete Lead</span>
                </button>
            </div>

            {/* Lead Header Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/25">
                            {lead.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl sm:text-2xl font-bold text-white">{lead.name}</h1>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentStatusCfg.badgeClass}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${currentStatusCfg.dotClass}`} />
                                    {currentStatusCfg.label}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    {lead.email}
                                </span>
                                {lead.phone && (
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                        {lead.phone}
                                    </span>
                                )}
                                <span>
                                    Created: {new Date(lead.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
                        <span className="text-xs text-slate-400 font-medium">Update Status:</span>
                        <select
                            value={lead.status}
                            disabled={updatingStatus}
                            onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="lost">Lost</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span>Lead Notes & Interactions</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            {notes.length}
                        </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Keep a chronological timeline of interactions and follow-ups</p>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-3">
                    {noteError && (
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                            {noteError}
                        </div>
                    )}
                    <div>
                        <textarea
                            required
                            rows={3}
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Type a new note (e.g., 'Called customer, scheduled follow-up for next week')..."
                            className="w-full p-3.5 bg-slate-950/80 border border-slate-700 rounded-xl text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submittingNote || !noteContent.trim()}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>{submittingNote ? "Adding..." : "Add Note"}</span>
                        </button>
                    </div>
                </form>

                {/* Notes Timeline List */}
                <div className="space-y-3 pt-2">
                    {notes.length === 0 ? (
                        <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/80">
                            <p className="text-xs text-slate-400">No notes recorded yet for this lead.</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Use the form above to add your first note!</p>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 hover:border-slate-700/80 transition-colors"
                            >
                                <div className="flex items-center justify-between text-[11px] text-slate-400">
                                    <span className="font-semibold text-slate-300">Note #{note.id}</span>
                                    <span>
                                        {new Date(note.createdAt).toLocaleString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                                    {note.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
