import { Outlet, Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";

export default function MainLayout() {
    const { user } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear auth state and redirect
        dispatch(setUser(null));
        // Also remove cookie if possible or redirect to login
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </div>
                            <span className="font-bold text-lg text-white tracking-tight">LeadsTracker</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                to="/"
                                className="px-3 py-1.5 text-sm font-medium rounded-lg text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
                            >
                                Leads Pipeline
                            </Link>
                        </nav>
                    </div>

                    {/* Right User Area */}
                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col text-right">
                                    <span className="text-xs font-semibold text-slate-200">{user.name || "User"}</span>
                                    <span className="text-[11px] text-slate-400">{user.email || ""}</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase ring-2 ring-indigo-500/30">
                                    {user.name ? user.name[0] : "U"}
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-xs text-slate-400 hover:text-rose-400 py-1.5 px-3 rounded-lg hover:bg-rose-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="Sign out"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}