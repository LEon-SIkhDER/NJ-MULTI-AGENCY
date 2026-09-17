import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router";
import {
    ArrowLeft,
    MoreVertical,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    GraduationCap,
    ShieldCheck,
    UserCheck,
    Clock,
    Sparkles,
    ClipboardList,
    Pencil,
    Trash2,
    PauseCircle,
    UserX,
    CalendarDays,
    CheckCircle2,
    Users,
    Plus,
    ExternalLink,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import DeleteModerator from "./DeleteModerator";
import ModeratorUpdateStatus from "./ModeratorUpdateStatus";
import AssignPitchers from "./AssignPitchers";
import EditModerator from "./EditModerator";

type Moderator = {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    gender?: string;
    maxQualification?: string;
    joinedAt?: string;
    experienceYears?: string;
    specialization?: string;
    bio?: string;
    presentAddress?: string;
    permanentAddress?: string;
    image?: { photoUrl: string; publicId: string };
    createdAt?: string;
    updatedAt?: string;
    role?: string;
    status: string;
    uid: string;
    totalAssignedTasks?: number;
    lastAssignedAt?: string;
};

const ModeratorDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: moderator, isLoading, refetch } = useQuery<Moderator>({
        queryKey: ["moderator", id],
        queryFn: async () => {
            const { data: result } = await axios.get(`http://localhost:5000/moderators/${id}`);
            return result;
        },
    });

    const { data: assignedPitchers = [], refetch: refetchPitchers } = useQuery({
        queryKey: ["assigned-pitchers", moderator?.uid],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:5000/pitchers/by-moderator?moderatorUid=${moderator?.uid}`);
            return data;
        },
        enabled: !!moderator?.uid,
    });

    if (!id) return null;

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse p-4 sm:p-6">
                <div className="h-64 rounded-2xl bg-surface border border-border" />
                <div className="h-72 rounded-2xl bg-surface border border-border" />
                <div className="h-44 rounded-2xl bg-surface border border-border" />
            </div>
        );
    }

    if (!moderator) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-text-muted">
                <p className="text-lg font-semibold text-white">Moderator not found</p>
                <button onClick={() => navigate(-1)} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#f06a7d] hover:underline cursor-pointer">
                    <ArrowLeft size={14} /> Back to Moderators
                </button>
            </div>
        );
    }

    const joinedDate = moderator.joinedAt ? new Date(moderator.joinedAt) : null;
    const joinedLabel = joinedDate && !isNaN(joinedDate.getTime()) ? format(joinedDate, "MMM dd, yyyy") : "—";
    const tenureLabel = joinedDate && !isNaN(joinedDate.getTime()) ? formatDistanceToNow(joinedDate, { addSuffix: false }) : "—";

    const lastAssignedDate = moderator.lastAssignedAt ? new Date(moderator.lastAssignedAt) : null;
    const lastAssignedLabel = lastAssignedDate && !isNaN(lastAssignedDate.getTime())
        ? format(lastAssignedDate, "MMM dd, yyyy")
        : "No tasks yet";
    const lastAssignedDistance = lastAssignedDate && !isNaN(lastAssignedDate.getTime())
        ? formatDistanceToNow(lastAssignedDate, { addSuffix: true })
        : "";

    const avatarFallback = moderator.name
        ? moderator.name
            .split(" ")
            .slice(0, 2)
            .map((w: string) => w[0])
            .join("")
            .toUpperCase()
        : "M";

    const rawStatus = (moderator.status || "active").toLowerCase();
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
                    <span>Back to Moderators</span>
                </button>

                {/* DaisyUI 3-dot dropdown */}
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

                        <li onClick={closeDropdown}>
                            <AssignPitchers
                                moderatorUid={moderator.uid}
                                moderatorName={moderator.name}
                                refetch={refetch}
                                className="hover:bg-white/5 text-white/90 hover:text-white font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                            >
                                <Users size={14} className="text-[#f06a7d]" />
                                <span>Assign Pitcher</span>
                            </AssignPitchers>
                        </li>
                        <li onClick={closeDropdown}>
                            <EditModerator
                                moderator={moderator}
                                refetch={refetch}
                                className="hover:bg-white/5 text-white/90 hover:text-white font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                            >
                                <Pencil size={14} className="text-white" />
                                <span>Edit Moderator</span>
                            </EditModerator>
                        </li>
                        <li onClick={closeDropdown}>
                            <DeleteModerator className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all" uid={moderator.uid}>
                                <Trash2 size={14} className="text-red-400" />
                                <span>Delete Moderator</span>
                            </DeleteModerator>
                        </li>
                        {
                            moderator.status !== 'active' &&
                            <li onClick={closeDropdown}>
                                <ModeratorUpdateStatus name={moderator.name} status='active' id={id} refetch={refetch} className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all">
                                    <UserCheck size={14} className="text-emerald-400" />
                                    <span>Set Active</span>
                                </ModeratorUpdateStatus>
                            </li>
                        }
                        {
                            moderator.status !== 'suspend' &&
                            <li onClick={closeDropdown}>
                                <ModeratorUpdateStatus name={moderator.name} status='suspend' id={id} refetch={refetch} className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all">
                                    <PauseCircle size={14} className="text-amber-400" />
                                    <span>Suspend</span>
                                </ModeratorUpdateStatus>
                            </li>
                        }
                        {
                            moderator.status !== 'fired' &&
                            <li onClick={closeDropdown}>
                                <ModeratorUpdateStatus name={moderator.name} status="fired" id={id} refetch={refetch} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all">
                                    <UserX size={14} className="text-red-400" />
                                    <span>Fire Moderator</span>
                                </ModeratorUpdateStatus>
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
                            {moderator.image?.photoUrl ? (
                                <img
                                    src={moderator.image.photoUrl}
                                    alt={moderator.name}
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
                                    {moderator.role || "Moderator"}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold border px-2.5 py-0.5 rounded-full ${statusBadgeStyle}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor}`} />
                                    {statusLabel}
                                </span>
                            </div>

                            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                                {moderator.name}
                            </h1>

                            <p className="text-sm font-semibold text-[#f06a7d]">
                                {moderator.specialization || "Platform Guardian & Operations"}
                            </p>

                            {moderator.bio && (
                                <p className="text-xs sm:text-sm text-text-muted max-w-xl leading-relaxed">
                                    "{moderator.bio}"
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right: Contact & Quick Links */}
                    <div className="flex flex-wrap md:flex-col items-center md:items-end justify-center gap-2.5 shrink-0 pt-2">
                        {moderator.email && (
                            <a
                                href={`mailto:${moderator.email}`}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 border border-border hover:border-primary-border text-xs font-medium text-text-muted hover:text-white transition-colors"
                            >
                                <Mail size={14} className="text-[#f06a7d]" />
                                <span>{moderator.email}</span>
                            </a>
                        )}
                        {moderator.phone && (
                            <a
                                href={`tel:${moderator.phone}`}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 border border-border hover:border-primary-border text-xs font-medium text-text-muted hover:text-white transition-colors"
                            >
                                <Phone size={14} className="text-[#f06a7d]" />
                                <span>{moderator.phone}</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* ── Key Performance / Supervision Metrics Grid ── */}
                <div className="mt-8 pt-6 border-t border-border/70 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl bg-surface-2 border border-border p-3.5 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-1">
                            <ClipboardList size={12} className="text-[#f06a7d]" /> Tasks Assigned
                        </div>
                        <div className="font-display text-xl font-extrabold text-white">
                            {moderator.totalAssignedTasks ?? 0}
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-2 border border-border p-3.5 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-1">
                            <Clock size={12} className="text-emerald-400" /> Last Task Assigned
                        </div>
                        <div className="font-display text-xs sm:text-sm font-bold text-emerald-400 truncate mt-1">
                            {lastAssignedLabel}
                        </div>
                        {lastAssignedDistance && (
                            <span className="text-[10px] text-text-muted block mt-0.5">{lastAssignedDistance}</span>
                        )}
                    </div>

                    <div className="rounded-xl bg-surface-2 border border-border p-3.5 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-1">
                            <Briefcase size={12} className="text-[#f06a7d]" /> Experience
                        </div>
                        <div className="font-display text-xl font-extrabold text-white">
                            {moderator.experienceYears || 0} yr{Number(moderator.experienceYears) !== 1 ? "s" : ""}
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-2 border border-border p-3.5 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-1">
                            <ShieldCheck size={12} className="text-[#f06a7d]" /> Authority
                        </div>
                        <div className="font-display text-sm font-extrabold text-white mt-1 capitalize">
                            {moderator.role || "Moderator"}
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
                                {moderator.experienceYears} Year{Number(moderator.experienceYears) !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <span className="text-text-muted flex items-center gap-2">
                                <GraduationCap size={14} className="text-[#f06a7d]" /> Max Qualification
                            </span>
                            <span className="font-semibold text-white">
                                {moderator.maxQualification || "—"}
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
                                <UserCheck size={14} className="text-[#f06a7d]" /> Gender
                            </span>
                            <span className="font-semibold text-white capitalize">
                                {moderator.gender || "—"}
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
                                {moderator.presentAddress || "—"}
                            </span>
                        </div>
                        <div className="py-2">
                            <span className="text-[11px] uppercase tracking-wider text-text-muted block mb-1">
                                Permanent Address
                            </span>
                            <span className="font-medium text-white">
                                {moderator.permanentAddress || "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Assigned Pitchers Section ── */}
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-primary-dim border border-primary-border">
                            <Users size={18} className="text-[#f06a7d]" />
                        </div>
                        <div>
                            <h2 className="font-display text-base sm:text-lg font-bold text-white">
                                Assigned Pitchers
                            </h2>
                            <p className="text-xs text-text-muted">
                                Pitching specialists managed by {moderator.name} ({assignedPitchers.length})
                            </p>
                        </div>
                    </div>

                    <AssignPitchers
                        moderatorUid={moderator.uid}
                        moderatorName={moderator.name}
                        refetch={() => {
                            refetch();
                            refetchPitchers();
                        }}
                        className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm py-2 px-3.5 rounded-xl cursor-pointer"
                    >
                        <Plus size={16} /> Assign Pitcher
                    </AssignPitchers>
                </div>

                {assignedPitchers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl bg-surface-2/40 border border-dashed border-border/70 p-6 space-y-2">
                        <Users size={28} className="text-text-muted opacity-40" />
                        <p className="text-sm font-medium text-text-muted">
                            No pitchers assigned to this moderator yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {assignedPitchers.map((p: any) => (
                            <div
                                key={p.uid}
                                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-2 border border-border hover:border-primary-border/60 transition-colors"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {p.image?.photoUrl ? (
                                        <img
                                            src={p.image.photoUrl}
                                            alt={p.name}
                                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-border shrink-0"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (fallback) fallback.style.display = "flex";
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="w-10 h-10 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center text-sm font-bold text-[#f06a7d] shrink-0"
                                        style={{ display: p.image?.photoUrl ? "none" : "flex" }}
                                    >
                                        {p.name
                                            ? p.name
                                                  .split(" ")
                                                  .slice(0, 2)
                                                  .map((w: string) => w[0])
                                                  .join("")
                                                  .toUpperCase()
                                            : "P"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{p.name}</p>
                                        <p className="text-xs text-text-muted truncate flex items-center gap-1">
                                            <Mail size={12} className="text-[#f06a7d] shrink-0" />
                                            {p.email}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    to={`/admin/pitcher/${p._id}`}
                                    className="shrink-0 p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-[#f06a7d] hover:border-primary-border transition-colors"
                                    title="View Profile"
                                >
                                    <ExternalLink size={13} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Operational & Activity Overview ── */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#f06a7d]" /> Operational Responsibilities
                    </h2>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 size={13} /> Active Guardian
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-1.5">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                            <ClipboardList size={14} className="text-[#f06a7d]" /> Task Assignment & Management
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">
                            Authorized to assign pitching leads to pitchers, inspect status updates, and ensure daily task quotas are fulfilled.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-1.5">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                            <CalendarDays size={14} className="text-[#f06a7d]" /> Activity Tracking
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">
                            Supervised a total of <span className="text-white font-semibold">{moderator.totalAssignedTasks ?? 0}</span> tasks. Latest assigned activity recorded on <span className="text-white font-semibold">{lastAssignedLabel}</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModeratorDetails;
