import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import {
    Sparkles,
    DollarSign,
    Trophy,
    Users,
    BadgeCheck,
    Mic,
    CheckCircle2,
    Clock,
    XCircle,
    CalendarClock,
    ClipboardList,
    Search,
    ArrowUpRight,
    Loader2,
    Handshake,
    Building2,
    CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import useRole from "../../../Hooks/useRole";
import useAuth from "../../../Hook/useAuth";

const DashboardHome: React.FC = () => {
    const { role } = useRole();
    const { user } = useAuth();

    if (role === "admin") {
        return <AdminDashboardOverview user={user} />;
    }

    if (role === "moderator") {
        return <ModeratorDashboardOverview user={user} />;
    }

    if (role === "pitcher") {
        return <PitcherDashboardOverview user={user} />;
    }

    return (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
            <Loader2 size={32} className="animate-spin text-[#f06a7d]" />
            <p className="text-sm font-medium text-text-muted">Loading agency dashboard…</p>
        </div>
    );
};

// =========================================================================
// 1. ADMIN DASHBOARD OVERVIEW
// =========================================================================
const AdminDashboardOverview = ({ user }: { user: any }) => {
    const { data, isLoading } = useQuery({
        queryKey: ["admin-overview-stats"],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:5000/admin/overview-stats`);
            return data;
        },
    });

    const financials = data?.financials || {
        totalRevenue: 0,
        totalPitcherPayouts: 0,
        totalModeratorPayouts: 0,
        totalAgencyProfit: 0,
        unpaidPitcherPayouts: 0,
        unpaidModeratorPayouts: 0,
        totalUnpaidPayouts: 0,
    };

    const counts = data?.counts || {
        totalTasks: 0,
        completedTasks: 0,
        paidTasks: 0,
        pendingTasks: 0,
        rejectedTasks: 0,
        postponedTasks: 0,
        totalPitchers: 0,
        totalModerators: 0,
    };

    const pitcherRankings: any[] = data?.pitcherRankings || [];
    const moderatorRankings: any[] = data?.moderatorRankings || [];

    const avatarFallback = (name: string) =>
        name
            ? name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
            : "U";

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse p-2 sm:p-4">
                <div className="h-44 rounded-2xl bg-surface border border-border" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 rounded-2xl bg-surface border border-border" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-96 rounded-2xl bg-surface border border-border" />
                    <div className="h-96 rounded-2xl bg-surface border border-border" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* Top Welcome Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[hsl(222_14%_9%)] via-[hsl(222_12%_11%)] to-[hsl(352_58%_49%_/_0.15)] p-6 sm:p-8 shadow-xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-primary-dim rounded-full blur-3xl opacity-30 pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dim border border-primary-border text-xs font-semibold text-[#f06a7d]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Executive Admin Command Center</span>
                        </div>
                        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                            Welcome back, {user?.displayName || "Admin Leader"} 👋
                        </h1>
                        <p className="text-xs sm:text-sm text-text-muted max-w-xl">
                            Track total revenue, examine pitcher &amp; moderator leaderboards, and oversee all agency operations in real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <Link
                            to="/admin/payments"
                            className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer shadow-md"
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>Manage Payouts</span>
                        </Link>
                        <Link
                            to="/admin/clients"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-surface-2 border border-border hover:border-primary-border text-text hover:text-white transition-all cursor-pointer shadow-sm"
                        >
                            <Handshake className="w-4 h-4 text-[#f06a7d]" />
                            <span>View Clients</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Income & Financial Overview Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1 relative overflow-hidden">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold text-xs">৳</span> Total Invoiced Revenue
                    </div>
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                        ৳{financials.totalRevenue.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-medium block">
                        Across {counts.paidTasks} paid client deals
                    </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <Building2 size={13} className="text-emerald-400" /> Agency Net Profit (80%)
                    </div>
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400">
                        ৳{financials.totalAgencyProfit.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-text-muted block">Retained agency capital</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <Mic size={13} className="text-[#f06a7d]" /> Pitcher Share (15%)
                    </div>
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#f06a7d]">
                        ৳{financials.totalPitcherPayouts.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-amber-300 font-medium block">
                        Unpaid: ৳{financials.unpaidPitcherPayouts.toLocaleString()}
                    </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <BadgeCheck size={13} className="text-amber-400" /> Moderator Share (5%)
                    </div>
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400">
                        ৳{financials.totalModeratorPayouts.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-amber-300 font-medium block">
                        Unpaid: ৳{financials.unpaidModeratorPayouts.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* ── Task Distribution Summary Bar ── */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                        <ClipboardList size={16} className="text-[#f06a7d]" /> Agency Task Pipeline &amp; Delivery Breakdown
                    </h3>
                    <span className="text-xs text-text-muted font-semibold">Total: {counts.totalTasks} Tasks</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-surface-2 border border-border text-center space-y-0.5">
                        <span className="text-[10px] text-emerald-400 uppercase tracking-wide font-semibold flex items-center justify-center gap-1">
                            <CheckCircle2 size={11} /> Completed
                        </span>
                        <p className="font-display text-lg font-bold text-white">{counts.completedTasks}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-2 border border-border text-center space-y-0.5">
                        <span className="text-[10px] text-sky-400 uppercase tracking-wide font-semibold flex items-center justify-center gap-1">
                            <DollarSign size={11} /> Paid Closed
                        </span>
                        <p className="font-display text-lg font-bold text-white">{counts.paidTasks}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-2 border border-border text-center space-y-0.5">
                        <span className="text-[10px] text-amber-400 uppercase tracking-wide font-semibold flex items-center justify-center gap-1">
                            <CalendarClock size={11} /> Postponed
                        </span>
                        <p className="font-display text-lg font-bold text-white">{counts.postponedTasks}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-2 border border-border text-center space-y-0.5">
                        <span className="text-[10px] text-red-400 uppercase tracking-wide font-semibold flex items-center justify-center gap-1">
                            <XCircle size={11} /> Rejected
                        </span>
                        <p className="font-display text-lg font-bold text-white">{counts.rejectedTasks}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-2 border border-border text-center space-y-0.5 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-text-muted uppercase tracking-wide font-semibold flex items-center justify-center gap-1">
                            <Clock size={11} /> Pending
                        </span>
                        <p className="font-display text-lg font-bold text-white">{counts.pendingTasks}</p>
                    </div>
                </div>
            </div>

            {/* ── Rankings Grid (Pitchers Leaderboard & Moderators Leaderboard) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ── Top Pitchers Ranking ── */}
                <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                        <div>
                            <div className="flex items-center gap-2">
                                <Trophy size={16} className="text-[#f06a7d]" />
                                <h2 className="font-display text-base font-bold text-white">
                                    Pitchers Leaderboard
                                </h2>
                            </div>
                            <p className="text-xs text-text-muted mt-0.5">
                                Ranked by monthly completed clients &amp; generated revenue
                            </p>
                        </div>
                        <Link
                            to="/admin/pitchers"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#f06a7d] hover:underline"
                        >
                            <span>All Pitchers</span>
                            <ArrowUpRight size={13} />
                        </Link>
                    </div>

                    {pitcherRankings.length === 0 ? (
                        <div className="py-12 text-center text-text-muted text-xs">No pitcher data recorded yet.</div>
                    ) : (
                        <div className="space-y-2.5">
                            {pitcherRankings.slice(0, 6).map((p, idx) => {
                                const rankColor =
                                    idx === 0
                                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                                        : idx === 1
                                        ? "text-slate-300 bg-slate-400/10 border-slate-400/30"
                                        : idx === 2
                                        ? "text-amber-600 bg-amber-700/10 border-amber-700/30"
                                        : "text-text-muted bg-surface-2 border-border";

                                return (
                                    <div
                                        key={p.uid}
                                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-2/70 border border-border hover:border-primary-border/60 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold border ${rankColor} shrink-0`}
                                            >
                                                #{idx + 1}
                                            </div>

                                            {p.image?.photoUrl ? (
                                                <img
                                                    src={p.image.photoUrl}
                                                    alt={p.name}
                                                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-border shrink-0"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center font-bold text-xs text-[#f06a7d] shrink-0">
                                                    {avatarFallback(p.name)}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <Link
                                                    to={`/admin/pitcher/${p._id}`}
                                                    className="font-bold text-xs sm:text-sm text-white hover:text-[#f06a7d] transition-colors truncate block"
                                                >
                                                    {p.name}
                                                </Link>
                                                <div className="flex items-center gap-2 text-[11px] text-text-muted truncate">
                                                    <span className="text-emerald-400 font-semibold">
                                                        {p.completedThisMonth} closed this month
                                                    </span>
                                                    <span>•</span>
                                                    <span>{p.successRate}% rate</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="font-display font-bold text-white text-xs sm:text-sm">
                                                ৳{p.revenueGenerated.toLocaleString()}
                                            </p>
                                            <span className="text-[10px] text-[#f06a7d] font-semibold">
                                                15%: ৳{p.earnings.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Top Moderators Ranking ── */}
                <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                        <div>
                            <div className="flex items-center gap-2">
                                <Trophy size={16} className="text-amber-400" />
                                <h2 className="font-display text-base font-bold text-white">
                                    Moderators Leaderboard
                                </h2>
                            </div>
                            <p className="text-xs text-text-muted mt-0.5">
                                Ranked by successful pitcher conversions &amp; active assigned tasks
                            </p>
                        </div>
                        <Link
                            to="/admin/moderators"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#f06a7d] hover:underline"
                        >
                            <span>All Moderators</span>
                            <ArrowUpRight size={13} />
                        </Link>
                    </div>

                    {moderatorRankings.length === 0 ? (
                        <div className="py-12 text-center text-text-muted text-xs">No moderator data recorded yet.</div>
                    ) : (
                        <div className="space-y-2.5">
                            {moderatorRankings.slice(0, 6).map((m, idx) => {
                                const rankColor =
                                    idx === 0
                                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                                        : idx === 1
                                        ? "text-slate-300 bg-slate-400/10 border-slate-400/30"
                                        : idx === 2
                                        ? "text-amber-600 bg-amber-700/10 border-amber-700/30"
                                        : "text-text-muted bg-surface-2 border-border";

                                return (
                                    <div
                                        key={m.uid}
                                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-2/70 border border-border hover:border-primary-border/60 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold border ${rankColor} shrink-0`}
                                            >
                                                #{idx + 1}
                                            </div>

                                            {m.image?.photoUrl ? (
                                                <img
                                                    src={m.image.photoUrl}
                                                    alt={m.name}
                                                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-border shrink-0"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center font-bold text-xs text-[#f06a7d] shrink-0">
                                                    {avatarFallback(m.name)}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <Link
                                                    to={`/admin/moderator/${m._id}`}
                                                    className="font-bold text-xs sm:text-sm text-white hover:text-[#f06a7d] transition-colors truncate block"
                                                >
                                                    {m.name}
                                                </Link>
                                                <div className="flex items-center gap-2 text-[11px] text-text-muted truncate">
                                                    <span className="text-emerald-400 font-semibold">
                                                        {m.completedTasks} closed deals
                                                    </span>
                                                    <span>•</span>
                                                    <span>{m.totalAssigned} assigned</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="font-display font-bold text-white text-xs sm:text-sm">
                                                ৳{m.revenueGenerated.toLocaleString()}
                                            </p>
                                            <span className="text-[10px] text-amber-400 font-semibold">
                                                5%: ৳{m.earnings.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// 2. MODERATOR DASHBOARD OVERVIEW
// =========================================================================
const ModeratorDashboardOverview = ({ user }: { user: any }) => {
    const [historySearch, setHistorySearch] = useState("");
    const [historyStatus, setHistoryStatus] = useState("");
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchHistory = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setHistorySearch(val);
        }, 450);
    };

    // 1. Moderator Overview Stats (Rankings & personal earnings)
    const { data: modStats } = useQuery({
        queryKey: ["moderator-overview-stats", user?.uid],
        queryFn: async () => {
            const { data } = await axios.get(
                `http://localhost:5000/moderator/overview-stats?moderatorUid=${user?.uid}`
            );
            return data;
        },
        enabled: !!user?.uid,
    });

    // 2. Assigned Tasks History
    const { data: historyTasks = [], isLoading: historyLoading } = useQuery({
        queryKey: ["moderator-assigned-tasks-history", user?.uid, historySearch, historyStatus],
        queryFn: async () => {
            const { data } = await axios.get(
                `http://localhost:5000/moderator/assigned-tasks-history?moderatorUid=${user?.uid}&search=${historySearch}&status=${historyStatus}`
            );
            return Array.isArray(data) ? data : [];
        },
        enabled: !!user?.uid,
    });

    const stats = modStats?.stats || {
        totalAssigned: 0,
        completedTasks: 0,
        assignedPitchersCount: 0,
        totalRevenue: 0,
        totalModeratorEarnings: 0,
        paidEarnings: 0,
        unpaidEarnings: 0,
    };

    const pitcherRankings: any[] = modStats?.pitcherRankings || [];

    const avatarFallback = (name: string) =>
        name
            ? name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
            : "P";

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* Top Welcome Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[hsl(222_14%_9%)] via-[hsl(222_12%_11%)] to-[hsl(352_58%_49%_/_0.15)] p-6 sm:p-8 shadow-xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-primary-dim rounded-full blur-3xl opacity-30 pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dim border border-primary-border text-xs font-semibold text-[#f06a7d]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Moderator Operations Center</span>
                        </div>
                        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                            Welcome back, {user?.displayName || "Moderator Guardian"} 👋
                        </h1>
                        <p className="text-xs sm:text-sm text-text-muted max-w-xl">
                            Supervise your assigned pitcher team, track your 5% commission earnings, and audit complete task assignment history.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/moderator/pitchers"
                            className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer shadow-md"
                        >
                            <Users className="w-4 h-4" />
                            <span>My Assigned Pitchers</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Key Metrics Grid (Commission + Tasks) ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold text-xs">৳</span> My 5% Earnings
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-amber-400">
                        ৳{stats.totalModeratorEarnings.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-medium block">
                        Paid: ৳{stats.paidEarnings.toLocaleString()} · Unpaid: ৳{stats.unpaidEarnings.toLocaleString()}
                    </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400" /> Closed Clients
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-white">
                        {stats.completedTasks}
                    </p>
                    <span className="text-[10px] text-text-muted block">Successful conversions</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <ClipboardList size={13} className="text-[#f06a7d]" /> Tasks Assigned
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-white">
                        {stats.totalAssigned}
                    </p>
                    <span className="text-[10px] text-text-muted block">Assigned by you</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <Users size={13} className="text-[#f06a7d]" /> Pitchers Supervised
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-white">
                        {stats.assignedPitchersCount}
                    </p>
                    <span className="text-[10px] text-text-muted block">Pitching team members</span>
                </div>
            </div>

            {/* ── Assigned Pitchers Ranking Card ── */}
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                    <div>
                        <div className="flex items-center gap-2">
                            <Trophy size={16} className="text-[#f06a7d]" />
                            <h2 className="font-display text-base font-bold text-white">
                                Assigned Pitcher Team Performance &amp; Rankings
                            </h2>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                            Ranked by successfully handled clients in the current month, revenue, and success rate
                        </p>
                    </div>
                </div>

                {pitcherRankings.length === 0 ? (
                    <div className="py-10 text-center text-text-muted text-xs">
                        No pitchers currently assigned under your moderation.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {pitcherRankings.map((p, idx) => (
                            <div
                                key={p.uid}
                                className="p-4 rounded-xl bg-surface-2 border border-border hover:border-primary-border/60 transition-all space-y-3"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-surface border border-border text-[#f06a7d]">
                                            #{idx + 1}
                                        </span>
                                        {p.image?.photoUrl ? (
                                            <img
                                                src={p.image.photoUrl}
                                                alt={p.name}
                                                className="w-9 h-9 rounded-xl object-cover ring-1 ring-border shrink-0"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center font-bold text-xs text-[#f06a7d] shrink-0">
                                                {avatarFallback(p.name)}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <Link
                                                to={`/moderator/pitcher/${p._id}`}
                                                className="font-bold text-xs sm:text-sm text-white hover:text-[#f06a7d] transition-colors truncate block"
                                            >
                                                {p.name}
                                            </Link>
                                            <p className="text-[11px] text-text-muted truncate">{p.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
                                    <div>
                                        <span className="text-[10px] text-text-muted uppercase block">This Month</span>
                                        <span className="font-bold text-emerald-400 text-xs sm:text-sm">
                                            {p.completedThisMonth}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-text-muted uppercase block">Success</span>
                                        <span className="font-bold text-white text-xs sm:text-sm">{p.successRate}%</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-text-muted uppercase block">Revenue</span>
                                        <span className="font-bold text-[#f06a7d] text-xs sm:text-sm">
                                            ৳{p.revenueGenerated.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Assigned Tasks History Section ── */}
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <ClipboardList size={16} className="text-[#f06a7d]" />
                            <h2 className="font-display text-base font-bold text-white">
                                All Assigned Tasks History
                            </h2>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                            Complete chronological history of tasks assigned by you to pitchers
                        </p>
                    </div>

                    {/* Filter & Search */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search tasks…"
                                onChange={handleSearchHistory}
                                className="pl-8 pr-3 py-1.5 bg-surface-2 border border-border rounded-xl text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-all w-40 sm:w-52"
                            />
                        </div>

                        <select
                            value={historyStatus}
                            onChange={(e) => setHistoryStatus(e.target.value)}
                            className="select select-sm bg-surface-2 border border-border text-white text-xs rounded-xl focus:outline-none focus:border-primary cursor-pointer"
                        >
                            <option value="" className="bg-surface-2 text-white">All Statuses</option>
                            <option value="completed" className="bg-surface-2 text-white">Completed</option>
                            <option value="postponed" className="bg-surface-2 text-white">Postponed</option>
                            <option value="rejected" className="bg-surface-2 text-white">Rejected</option>
                            <option value="pending" className="bg-surface-2 text-white">Pending</option>
                        </select>
                    </div>
                </div>

                {historyLoading ? (
                    <div className="py-12 text-center space-y-2">
                        <Loader2 size={24} className="animate-spin text-[#f06a7d] mx-auto" />
                        <p className="text-xs text-text-muted">Loading assignment history…</p>
                    </div>
                ) : historyTasks.length === 0 ? (
                    <div className="py-12 text-center text-text-muted text-xs">
                        No assigned tasks recorded for the current query.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/80 bg-surface-2/60 text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                                    <th className="py-3 px-4">Client / Task</th>
                                    <th className="py-3 px-4">Pitcher Assigned</th>
                                    <th className="py-3 px-4">Contact</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Assigned Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60 text-xs">
                                {historyTasks.map((t: any) => {
                                    const rawStatus = (t.status || "pending").toLowerCase();
                                    const isComp = rawStatus === "completed" || rawStatus === "complete";
                                    const isRej = rawStatus === "rejected" || rawStatus === "reject";
                                    const isPost = rawStatus === "postponed" || rawStatus === "postpone";

                                    const badgeStyle = isComp
                                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                        : isRej
                                        ? "text-red-400 bg-red-500/10 border-red-500/20"
                                        : isPost
                                        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                        : "text-sky-400 bg-sky-500/10 border-sky-500/20";

                                    const label = isComp ? "Completed" : isRej ? "Rejected" : isPost ? "Postponed" : "Pending";
                                    const dateStr = t.createdAt ? format(new Date(t.createdAt), "MMM dd, yyyy · hh:mm a") : "—";

                                    return (
                                        <tr key={t._id} className="hover:bg-surface-2/40 transition-colors">
                                            <td className="py-3 px-4">
                                                <p className="font-semibold text-white truncate max-w-[200px]">{t.name}</p>
                                                {t.notice && (
                                                    <p className="text-[11px] text-text-muted truncate max-w-[200px]">
                                                        {t.notice}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="py-3 px-4">
                                                {t.pitcher ? (
                                                    <Link
                                                        to={`/moderator/pitcher/${t.pitcher._id}`}
                                                        className="font-medium text-white hover:text-[#f06a7d] transition-colors"
                                                    >
                                                        {t.pitcher.name}
                                                    </Link>
                                                ) : (
                                                    <span className="text-text-muted">—</span>
                                                )}
                                            </td>

                                            <td className="py-3 px-4 text-text-muted">
                                                {t.numbers || t.phone || "—"}
                                            </td>

                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeStyle}`}
                                                >
                                                    {label}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4 text-text-muted text-[11px]">{dateStr}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// =========================================================================
// 3. PITCHER DASHBOARD OVERVIEW
// =========================================================================
const PitcherDashboardOverview = ({ user }: { user: any }) => {
    const { data: tasks = [] } = useQuery({
        queryKey: ["tasks", user?.uid],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:5000/tasks?uid=${user?.uid}`);
            return Array.isArray(data) ? data : [];
        },
        enabled: !!user?.uid,
    });

    const completed = tasks.filter((t: any) => (t.status || "").toLowerCase() === "completed").length;
    const paidTasks = tasks.filter((t: any) => t.paymentStatus === "paid" || t.balance);
    const earnings = paidTasks.reduce((sum: number, t: any) => sum + (Number(t.pitcherEarning) || 0), 0);
    const successRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[hsl(222_14%_9%)] via-[hsl(222_12%_11%)] to-[hsl(352_58%_49%_/_0.15)] p-6 sm:p-8 shadow-xl">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dim border border-primary-border text-xs font-semibold text-[#f06a7d]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pitcher Command Center</span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Welcome back, {user?.displayName || "Pitching Specialist"} 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-text-muted max-w-xl">
                        Deliver high-impact pitch decks, close high-value client contracts, and track your 15% earnings.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <span className="text-[10px] text-text-muted uppercase font-semibold">Total Handled</span>
                    <p className="font-display text-2xl font-bold text-white">{tasks.length}</p>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold">Completed</span>
                    <p className="font-display text-2xl font-bold text-emerald-400">{completed}</p>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <span className="text-[10px] text-[#f06a7d] uppercase font-semibold">15% Earnings</span>
                    <p className="font-display text-2xl font-bold text-[#f06a7d]">৳{earnings.toLocaleString()}</p>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <span className="text-[10px] text-amber-400 uppercase font-semibold">Success Rate</span>
                    <p className="font-display text-2xl font-bold text-white">{successRate}%</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    to="/pitcher/todays-tasks"
                    className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                >
                    <Clock size={16} />
                    <span>Open Today's Tasks</span>
                </Link>
                <Link
                    to="/pitcher/all-tasks"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-surface-2 border border-border hover:text-white"
                >
                    View All Tasks History
                </Link>
            </div>
        </div>
    );
};

export default DashboardHome;