import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Form Container */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}