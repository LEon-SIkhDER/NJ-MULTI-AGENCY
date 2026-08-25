import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import {
    ArrowLeft,
    MoreVertical,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    GraduationCap,
    TrendingUp,
    UserCheck,
    BarChart2,
    Target,
    Clock,
    Sparkles,
    Layers,
    Pencil,
    Trash2,
    PauseCircle,
    UserX,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import DeletePitcher from "./DeletePitcher";
import PitcherUpdateStatus from "./PitcherUpdateStatus";
import TodaysWorks from "./TodaysWorks";

const PitchersDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: pitcher, isLoading, refetch } = useQuery({
        queryKey: ["pitcher", id],
        queryFn: async () => {
            const { data: result } = await axios.get(`http://localhost:5000/pitcher/${id}`);
            return result;
        },
    });
    if (!id) return

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse p-4 sm:p-6">
                <div className="h-64 rounded-2xl bg-surface border border-border" />
                <div className="h-72 rounded-2xl bg-surface border border-border" />
                <div className="h-44 rounded-2xl bg-surface border border-border" />
            </div>
        );
    }

    if (!pitcher) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-text-muted">
                <p className="text-lg font-semibold text-white">Pitcher not found</p>
                <button onClick={() => navigate(-1)} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#f06a7d] hover:underline cursor-pointer">
                    <ArrowLeft size={14} /> Back to Pitchers
                </button>
            </div>
        );
    }

    const joinedDate = pitcher.joinedAt ? new Date(pitcher.joinedAt) : null;
    const joinedLabel = joinedDate && !isNaN(joinedDate.getTime()) ? format(joinedDate, "MMM dd, yyyy") : "—";
    const tenureLabel = joinedDate && !isNaN(joinedDate.getTime()) ? formatDistanceToNow(joinedDate, { addSuffix: false }) : "—";

    const avatarFallback = pitcher.name
        ? pitcher.name
            .split(" ")
            .slice(0, 2)
            .map((w: string) => w[0])
            .join("")
            .toUpperCase()
        : "P";

    const rawStatus = (pitcher.status || "active").toLowerCase();
    const isSuspended = rawStatus === "suspend" || rawStatus === "suspended" || rawStatus === "suspaned";
    const isFired = rawStatus === "fired";
    const statusLabel = isFired ? "Fired" : isSuspended ? "Suspended" : "Active";
    const statusDotColor = isFired ? "bg-red-500" : isSuspended ? "bg-amber-500" : "bg-emerald-500";
    const statusBadgeStyle = isFired
        ? "text-red-400 bg-red-500/10 border-red-500/20"
        : isSuspended
            ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
            : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    const closeDropdown = () => {
        const elem = document.activeElement as HTMLElement;
        elem?.blur();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* ── Top Bar with Back Link & 3-Dot DaisyUI Dropdown ── */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-muted hover:text-white transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Pitchers</span>
                </button>

                {/* DaisyUI 3-dot dropdown (closes automatically on outside click via focus/tabIndex) */}
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-sm btn-circle text-white bg-surface-2/90 hover:bg-primary-dim hover:border-primary-border border border-border cursor-pointer flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_-3px_var(--primary-glow)]"
                    >
                        <MoreVertical size={17} className="text-white shrink-0" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-surface-2/95 backdrop-blur-xl border border-border/80 rounded-2xl z-50 w-48 p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.85),0_0_20px_-5px_hsl(352_58%_49%_/_0.18)] mt-2 space-y-1 overflow-hidden"
                    >
                        {/* Top red accent glow line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

                        <li>
                            <a className="hover:bg-white/5 text-white/90 hover:text-white font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all">
                                <Pencil size={14} className="text-[#f06a7d]" />
                                <span>Edit Pitcher</span>
                            </a>
                        </li>
                        <li onClick={closeDropdown}>
                            <DeletePitcher className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all" uid={pitcher.uid} >
                                <Trash2 size={14} className="text-red-400" />
                                <span>Delete Pitcher</span>
                            </DeletePitcher>
                        </li>
                        {
                            pitcher.status !== 'active' &&
                            <li onClick={closeDropdown}>
                                <PitcherUpdateStatus name={pitcher.name} status='active' id={id} refetch={refetch} className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all">
                                    <UserCheck size={14} className="text-emerald-400" />
                                    <span>Set Active</span>
                                </PitcherUpdateStatus>
                            </li>
                        }
                        {
                            pitcher.status !== 'suspend' &&
                            <li onClick={closeDropdown}>
                                <PitcherUpdateStatus name={pitcher.name} status='suspend' id={id} refetch={refetch} className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all">
                                    <PauseCircle size={14} className="text-amber-400" />
                                    <span>Suspend</span>
                                </PitcherUpdateStatus>
                            </li>
                        }
                        {
                            pitcher.status !== 'fired' &&
                            <li onClick={closeDropdown}>
                                <PitcherUpdateStatus name={pitcher.name} status="fired" id={id} refetch={refetch} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all">
                                    <UserX size={14} className="text-red-400" />
                                    <span>Fire Pitcher</span>
                                </PitcherUpdateStatus>
                            </li>
                        }
                    </ul>
                </div>
            </div>

            {/* ── Main Profile Header Card ── */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <div className="absolute top-0 right-0 h-56 w-56 bg-primary-dim rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

                <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Left: Avatar + Details */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                        <div className="relative shrink-0">
                            {pitcher.image?.photoUrl ? (
                                <img
                                    src={pitcher.image.photoUrl}
                                    alt={pitcher.name}
                                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-border shadow-xl"
                                />
                            ) : (
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-primary-dim border border-primary-border flex items-center justify-center text-3xl font-extrabold text-[#f06a7d] shadow-xl">
                                    {avatarFallback}
                                </div>
                            )}
                            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-4 ring-surface ${statusDotColor}`} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-2 border border-border text-text-muted">
                                    {pitcher.role || "Pitcher"}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold border px-2.5 py-0.5 rounded-full ${statusBadgeStyle}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor}`} />
                                    {statusLabel}
                                </span>
                            </div>

                            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                                {pitcher.name}
                            </h1>

                            <p className="text-sm font-semibold text-[#f06a7d]">
                                {pitcher.specialization || "Pitch Specialist"}
                            </p>

                            {pitcher.bio && (
                                <p className="text-xs sm:text-sm text-text-muted max-w-xl leading-relaxed">
                                    "{pitcher.bio}"
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right: Contact & Quick Links */}
                    <div className="flex flex-wrap md:flex-col items-center md:items-end justify-center gap-2.5 shrink-0 pt-2">
                        {pitcher.email && (
                            <a
                                href={`mailto:${pitcher.email}`}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 border border-border hover:border-primary-border text-xs font-medium text-text-muted hover:text-white transition-colors"
                            >
                                <Mail size={14} className="text-[#f06a7d]" />
                                <span>{pitcher.email}</span>
                            </a>
                        )}
                        {pitcher.phone && (
                            <a
                                href={`tel:${pitcher.phone}`}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 border border-border hover:border-primary-border text-xs font-medium text-text-muted hover:text-white transition-colors"
                            >
                                <Phone size={14} className="text-[#f06a7d]" />
                                <span>{pitcher.phone}</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* ── Key Performance Metrics Grid ── */}
                <div className="mt-8 pt-6 border-t border-border/70 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="rounded-xl bg-surface-2 border border-border p-3.5 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-1">
                            <UserCheck size={12} className="text-[#f06a7d]" /> Handled Clients
                        </div>
                        <div className="font-display text-xl font-extrabold text-white">
                            {pitcher.successfullyHandledClient ?? 0}
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-2 border border-border p-3.5 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-1">
                            <TrendingUp size={12} className="text-emerald-400" /> Success Rate
                        </div>
                        <div className="font-display text-xl font-extrabold text-emerald-400">
                            {pitcher.successRate ?? 0}%
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-2 border border-border p-3.5 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-1">
                            <Layers size={12} className="text-[#f06a7d]" /> Total Clients
                        </div>
                        <div className="font-display text-xl font-extrabold text-white">
                            {pitcher.totalClientsHandled ?? 0}
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-2 border border-border p-3.5 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-1">
                            <BarChart2 size={12} className="text-[#f06a7d]" /> Avg / Month
                        </div>
                        <div className="font-display text-xl font-extrabold text-white">
                            {pitcher.avgClientPerMonth ?? 0}
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-2 border border-border p-3.5 text-center col-span-2 sm:col-span-1">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-1">
                            <Target size={12} className="text-[#f06a7d]" /> Active Pitches
                        </div>
                        <div className="font-display text-xl font-extrabold text-white">
                            {pitcher.activePitches ?? 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Personal & Background Details ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                    <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                        <Sparkles size={16} className="text-[#f06a7d]" /> Professional Overview
                    </h2>
                    <div className="space-y-3 text-xs sm:text-sm">
                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <span className="text-text-muted flex items-center gap-2">
                                <Briefcase size={14} className="text-[#f06a7d]" /> Experience
                            </span>
                            <span className="font-semibold text-white">
                                {pitcher.experienceYears} Year{Number(pitcher.experienceYears) !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <span className="text-text-muted flex items-center gap-2">
                                <GraduationCap size={14} className="text-[#f06a7d]" /> Max Qualification
                            </span>
                            <span className="font-semibold text-white">
                                {pitcher.maxQualification || "—"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <span className="text-text-muted flex items-center gap-2">
                                <Calendar size={14} className="text-[#f06a7d]" /> Joined Date
                            </span>
                            <span className="font-semibold text-white">
                                {joinedLabel} ({tenureLabel})
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-text-muted flex items-center gap-2">
                                <Clock size={14} className="text-[#f06a7d]" /> Gender
                            </span>
                            <span className="font-semibold text-white capitalize">
                                {pitcher.gender || "—"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                    <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                        <MapPin size={16} className="text-[#f06a7d]" /> Location & Addresses
                    </h2>
                    <div className="space-y-3 text-xs sm:text-sm">
                        <div className="py-2 border-b border-border/50">
                            <span className="text-[11px] uppercase tracking-wider text-text-muted block mb-1">
                                Present Address
                            </span>
                            <span className="font-medium text-white">
                                {pitcher.presentAddress || "—"}
                            </span>
                        </div>
                        <div className="py-2">
                            <span className="text-[11px] uppercase tracking-wider text-text-muted block mb-1">
                                Permanent Address
                            </span>
                            <span className="font-medium text-white">
                                {pitcher.permanentAddress || "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <TodaysWorks pitcher={pitcher}></TodaysWorks>

            {/* ── MIDDLE SECTION: Disabled Graph (will be updated soon) ── */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                        <TrendingUp size={16} className="text-[#f06a7d]" /> Performance & Activity Graph
                    </h2>
                    <span className="text-[11px] uppercase tracking-wider text-text-muted">
                        30-Day Conversion Flow
                    </span>
                </div>

                {/* Graph Container with Overlay */}
                <div className="relative min-h-[220px] sm:min-h-[260px] rounded-xl border border-border/60 bg-surface-2 overflow-hidden flex items-center justify-center p-6">
                    {/* Simulated Disabled Chart Visuals */}
                    <div className="w-full h-full flex items-end justify-between gap-2 sm:gap-4 opacity-20 pointer-events-none select-none filter blur-[1px]">
                        {[45, 65, 30, 80, 55, 90, 70, 85, 40, 95, 75, 60, 88, 70, 92].map((height, i) => (
                            <div key={i} className="w-full flex flex-col items-center gap-1">
                                <div
                                    className="w-full rounded-t-md bg-gradient-to-t from-[#c43448]/40 to-[#f06a7d]"
                                    style={{ height: `${height}%` }}
                                />
                                <span className="text-[9px] text-text-muted hidden sm:inline">D{i + 1}</span>
                            </div>
                        ))}
                    </div>

                    {/* Centered Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/50 backdrop-blur-[2px]">
                        <div className="px-5 py-2.5 rounded-xl bg-surface border border-border shadow-2xl text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                            <Clock size={16} className="text-[#f06a7d]" />
                            <span>Unlock after minimum 7 tasks</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PitchersDetails;