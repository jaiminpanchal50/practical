import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import type { LeadStatus } from "../types/lead.types";
import useLead from "../features/leads/useLead";

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

export default function Home() {
    const { fetchLeads, createLead, deleteLead } = useLead();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters and pagination
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(false);

    // Create Lead Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [newLead, setNewLead] = useState({
        name: "",
        email: "",
        phone: "",
        status: "new",
    });

    const loadLeads = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchLeads({
                search: search.trim(),
                status: statusFilter || undefined,
                offset,
            });
            setLeads(data.allLeads);
            setTotal(data.pagination.total);
            setHasMore(data.pagination.hasMore);
        } catch (err: any) {
            console.error("Error loading leads:", err);
            setError(err?.response?.data?.message || "Failed to load leads");
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, offset]);

    useEffect(() => {
        // Reset offset to 0 when search or statusFilter changes
        setOffset(0);
    }, [search, statusFilter]);

    useEffect(() => {
        loadLeads();
    }, [loadLeads]);

    const handleCreateLead = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setCreateLoading(true);
            setCreateError(null);
            await createLead({
                name: newLead.name.trim(),
                email: newLead.email.trim(),
                phone: newLead.phone.trim() || undefined,
                status: newLead.status,
            });
            setIsModalOpen(false);
            setNewLead({ name: "", email: "", phone: "", status: "new" });
            loadLeads();
        } catch (err: any) {
            console.error("Error creating lead:", err);
            setCreateError(err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message || "Failed to create lead");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete lead "${name}"?`)) return;
        try {
            await deleteLead(id);
            loadLeads();
        } catch (err) {
            alert("Failed to delete lead");
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Bar: Title & Create Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Leads Overview</h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Track, filter, and manage your incoming leads ({total} total)
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.99] transition-all cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Add New Lead</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search leads by name or email..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-700/70 rounded-xl text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                </div>

                {/* Status Filter Dropdown */}
                <div className="flex items-center gap-2">
                    <label htmlFor="status-filter" className="text-xs text-slate-400 whitespace-nowrap">Status:</label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "")}
                        className="bg-slate-950/70 border border-slate-700/70 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={loadLeads} className="underline text-xs hover:text-rose-300">Retry</button>
                </div>
            )}

            {/* Leads Table / List */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading leads...</span>
                    </div>
                ) : leads.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-slate-200">No leads found</h3>
                        <p className="text-xs text-slate-400 mt-1">
                            {search || statusFilter ? "Try clearing search or filters" : "Create your first lead or run the seed script"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950/50 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-3.5">Lead</th>
                                    <th className="px-6 py-3.5">Contact</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5">Created At</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {leads.map((lead) => {
                                    const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                                    return (
                                        <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                                            {/* Name & Avatar */}
                                            <td className="px-6 py-4">
                                                <Link to={`/leads/${lead.id}`} className="flex items-center gap-3 group">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center font-semibold text-indigo-400 text-xs group-hover:border-indigo-500/50 transition-colors">
                                                        {lead.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-100 group-hover:text-indigo-400 transition-colors">
                                                            {lead.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400 sm:hidden">
                                                            {lead.email}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* Contact Details */}
                                            <td className="px-6 py-4">
                                                <div className="text-slate-200">{lead.email}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{lead.phone || "No phone"}</div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.badgeClass}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
                                                    {statusCfg.label}
                                                </span>
                                            </td>

                                            {/* Created At */}
                                            <td className="px-6 py-4 text-xs text-slate-400">
                                                {new Date(lead.createdAt).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <Link
                                                        to={`/leads/${lead.id}`}
                                                        className="px-2.5 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors font-medium"
                                                    >
                                                        View / Notes &rarr;
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(lead.id, lead.name)}
                                                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                                        title="Delete Lead"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="bg-slate-950/60 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div>
                        Showing <span className="font-semibold text-slate-200">{leads.length > 0 ? offset + 1 : 0}</span> to{" "}
                        <span className="font-semibold text-slate-200">{offset + leads.length}</span> of{" "}
                        <span className="font-semibold text-slate-200">{total}</span> leads
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={offset === 0}
                            onClick={() => setOffset(Math.max(0, offset - limit))}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            &larr; Previous
                        </button>
                        <button
                            type="button"
                            disabled={!hasMore}
                            onClick={() => setOffset(offset + limit)}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next &rarr;
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Lead Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-white">Create New Lead</h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {createError && (
                            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                                {createError}
                            </div>
                        )}

                        <form onSubmit={handleCreateLead} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="lead-name">
                                    Full Name *
                                </label>
                                <input
                                    id="lead-name"
                                    type="text"
                                    required
                                    value={newLead.name}
                                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                                    placeholder="Jane Smith"
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="lead-email">
                                    Email Address *
                                </label>
                                <input
                                    id="lead-email"
                                    type="email"
                                    required
                                    value={newLead.email}
                                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                                    placeholder="jane@company.com"
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="lead-phone">
                                    Phone Number (optional)
                                </label>
                                <input
                                    id="lead-phone"
                                    type="text"
                                    value={newLead.phone}
                                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                                    placeholder="+1 555-0199"
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="lead-status">
                                    Status
                                </label>
                                <select
                                    id="lead-status"
                                    value={newLead.status}
                                    onChange={(e) => setNewLead({ ...newLead, status: e.target.value as LeadStatus })}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="lost">Lost</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl shadow-md cursor-pointer"
                                >
                                    {createLoading ? "Creating..." : "Save Lead"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
