import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "../../../../Hooks/useAxiosSecure";
import { useParams, useNavigate } from "react-router";
import {
    ClipboardList,
    Search,
    ArrowLeft,
    Phone,
    ExternalLink,
    AlignLeft,
    CalendarClock,
    Sparkles,
    Calendar,
    Loader2,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    Pencil,
    RotateCcw,
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import useAuth from "../../../../Hook/useAuth";
import useRole from "../../../../Hooks/useRole";
import toast from "react-hot-toast";
import Swal, { showCustomSwal } from "../../../../utils/swal";
import EditTask from "./EditTask";

type Pitcher = {
    _id: string;
    name: string;
    email: string;
    uid: string;
    phone?: string;
    status?: string;
    image?: {
        photoUrl: string;
        publicId: string;
    };
};

type Task = {
    _id: string;
    name: string;
    numbers: string;
    photoUrl?: string;
    image?: { photoUrl: string; publicId?: string } | string;
    url?: string;
    uri?: string;
    notice?: string;
    status?: string;
    postponeAt?: string;
    postponeNote?: string;
    postpone?: { postponeAt: string; postponeNote?: string }[];
    assignedBy?: string;
    assignedTo?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
};

const formatPostponeDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
        const parsed = parseISO(dateStr);
        if (isValid(parsed)) {
            return format(parsed, "dd-MMM-yyyy");
        }
        const fallback = new Date(dateStr);
        return isValid(fallback) ? format(fallback, "dd-MMM-yyyy") : dateStr;
    } catch {
        return dateStr;
    }
};

const AllTasks = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { role } = useRole();
    const [searchTerm, setSearchTerm] = useState("");
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Search handler with debounce
    const handleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const search = e.currentTarget.value;
        if (timeoutId?.current) {
            clearTimeout(timeoutId?.current);
        }
        timeoutId.current = setTimeout(() => {
            setSearchTerm(search);
        }, 500);
    };

    const { user } = useAuth();

    // 1. Fetch pitcher to get their uid
    const { data: pitcher } = useQuery<Pitcher>({
        queryKey: ["pitcher", id],
        queryFn: async () => {
            const { data: result } = await axiosSecure.get(`/pitcher/${id}`);
            return result;
        },
        enabled: !!id,
    });

    const pitcherUid = pitcher?.uid || user?.uid || '';
    const [filter, setFilter] = useState("");

    // 2. Fetch all tasks according to uid, search, and status filter
    const { data: tasks = [], isLoading, refetch } = useQuery<Task[]>({
        queryKey: ["tasks", pitcherUid, searchTerm, filter],
        queryFn: async () => {
            const { data: result } = await axiosSecure.get(
                `/tasks?uid=${pitcherUid}&search=${searchTerm}&status=${filter}`
            );
            return Array.isArray(result) ? result : [];
        },
        enabled: !!pitcherUid || !!id,
    });

    const closeDropdown = () => {
        const elem = document.activeElement as HTMLElement;
        elem?.blur();
    };

    // ── Complete Task ──
    const handleComplete = async (task: Task) => {
        closeDropdown();
        const confirm = await showCustomSwal({
            title: "Complete Task?",
            des: `Are you sure you want to mark "${task.name}" as completed?`,
            confirmButtonText: "Complete",
            icon: "success",
        });
        if (!confirm) return;

        const toastId = toast.loading("Updating status...");
        try {
            const { data: result } = await axiosSecure.patch(`/task/${task._id}`, {
                status: "completed",
            });
            if (!result.matchedCount && !result.modifiedCount) {
                throw new Error("Update Failed");
            }
            await refetch();
            toast.dismiss(toastId);
            toast.success("Task completed successfully");
        } catch (error) {
            const err = error as { message?: string };
            toast.dismiss(toastId);
            toast.error(err.message || "Something went wrong");
        }
    };

    // ── Reject Task ──
    const handleReject = async (task: Task) => {
        closeDropdown();
        const confirm = await showCustomSwal({
            title: "Reject Task?",
            des: `Are you sure you want to reject "${task.name}"?`,
            confirmButtonText: "Reject",
            icon: "delete",
            isDanger: true,
        });
        if (!confirm) return;

        const toastId = toast.loading("Rejecting task...");
        try {
            const { data: result } = await axiosSecure.patch(`/task/${task._id}`, {
                status: "rejected",
            });
            if (!result.matchedCount && !result.modifiedCount) {
                throw new Error("Update Failed");
            }
            await refetch();
            toast.dismiss(toastId);
            toast.success("Task rejected");
        } catch (error) {
            const err = error as { message?: string };
            toast.dismiss(toastId);
            toast.error(err.message || "Something went wrong");
        }
    };

    // ── Postpone Task ──
    const handlePostpone = async (task: Task) => {
        closeDropdown();

        // Calculate tomorrow's date string (today cannot be selected)
        const today = new Date();
        const todayStr = format(today, "yyyy-MM-dd");
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDateStr = format(tomorrow, "yyyy-MM-dd");

        const { value: formValues } = await Swal.fire({
            title: "Postpone Task",
            html: `
                <div style="display: flex; flex-direction: column; gap: 14px; text-align: left; margin-top: 10px;">
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: hsl(220 10% 60%);">
                            Next Postpone Date <span style="color: #f06a7d;">*</span>
                        </label>
                        <input 
                            id="swal-postpone-date" 
                            type="date" 
                            min="${minDateStr}" 
                            style="width: 100%; padding: 0.65rem 0.85rem; background: hsl(222 12% 11%); border: 1px solid hsl(222 10% 20%); border-radius: 10px; color: hsl(220 20% 90%); font-size: 0.875rem; outline: none;"
                        />
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: hsl(220 10% 60%);">
                            Postpone Note / Reason
                        </label>
                        <textarea 
                            id="swal-postpone-note" 
                            rows="3" 
                            placeholder="Write reason or special notes for postponement..." 
                            style="width: 100%; padding: 0.65rem 0.85rem; background: hsl(222 12% 11%); border: 1px solid hsl(222 10% 20%); border-radius: 10px; color: hsl(220 20% 90%); font-size: 0.875rem; outline: none; resize: vertical;"
                        ></textarea>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Postpone",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                popup: "nj-swal-popup",
                container: "nj-swal-container",
                title: "nj-swal-title",
                htmlContainer: "nj-swal-html",
                actions: "nj-swal-actions",
                confirmButton: "nj-swal-btn-confirm !bg-amber-600 hover:!bg-amber-700 !border-amber-500/50",
                cancelButton: "nj-swal-btn-cancel",
            },
            didOpen: (modal) => {
                const existingIcon = modal.querySelector(".nj-swal-icon-wrapper");
                if (!existingIcon) {
                    const iconContainer = document.createElement("div");
                    iconContainer.className = "nj-swal-icon-wrapper";
                    iconContainer.innerHTML = `
                        <div class="nj-swal-icon-inner" style="background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.3); box-shadow: 0 0 20px -3px rgba(245, 158, 11, 0.35);">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; color: #f59e0b;">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                    `;
                    modal.insertBefore(iconContainer, modal.firstChild);
                }
            },
            preConfirm: () => {
                const dateInput = document.getElementById("swal-postpone-date") as HTMLInputElement;
                const noteInput = document.getElementById("swal-postpone-note") as HTMLTextAreaElement;
                const postponeAt = dateInput?.value;
                const postponeNote = noteInput?.value || "";

                if (!postponeAt) {
                    Swal.showValidationMessage("Please select a date for next postpone");
                    return false;
                }

                if (postponeAt <= todayStr) {
                    Swal.showValidationMessage("Cannot select today or past dates. Please choose a future date.");
                    return false;
                }

                return { postponeAt, postponeNote };
            },
        });

        if (!formValues) return;

        const toastId = toast.loading("Postponing task...");
        try {
            const { data: result } = await axiosSecure.patch(`/task/${task._id}`, {
                status: "postponed",
                postpone: { postponeAt: formValues.postponeAt, postponeNote: formValues.postponeNote },
            });
            if (!result.matchedCount && !result.modifiedCount) {
                throw new Error("Postpone Failed");
            }
            await refetch();
            toast.dismiss(toastId);
            toast.success("Task postponed successfully");
        } catch (error) {
            const err = error as { message?: string };
            toast.dismiss(toastId);
            toast.error(err.message || "Something went wrong");
        }
    };

    // ── Reset to Pending ──
    const handleResetPending = async (task: Task) => {
        closeDropdown();
        const toastId = toast.loading("Updating status...");
        try {
            const { data: result } = await axiosSecure.patch(`/task/${task._id}`, {
                status: "pending",
            });
            if (!result.matchedCount && !result.modifiedCount) {
                throw new Error("Update Failed");
            }
            await refetch();
            toast.dismiss(toastId);
            toast.success("Task marked as pending");
        } catch (error) {
            const err = error as { message?: string };
            toast.dismiss(toastId);
            toast.error(err.message || "Something went wrong");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* ── Top Bar with Back Link ── */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-muted hover:text-white transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Pitcher Profile</span>
                </button>
            </div>

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dim border border-primary-border text-xs font-semibold text-[#f06a7d] mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Task Archive & History</span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        All Tasks {pitcher?.name ? `— ${pitcher.name}` : ""}
                    </h1>
                    <p className="text-xs sm:text-sm text-text-muted mt-1">
                        View and search all tasks assigned to this pitcher across all statuses.
                    </p>
                </div>

                {/* Summary Pill */}
                <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text-muted shadow-sm">
                        <ClipboardList className="w-4 h-4 text-[#f06a7d]" />
                        <span>Total:</span>
                        <span className="font-bold text-white text-sm">{tasks.length}</span>
                        <span>Tasks</span>
                    </div>
                </div>
            </div>

            {/* ── Search Bar & Status Filter Buttons ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search tasks by name or email…"
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-[#c43448]/60 transition-colors"
                    />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                        { label: "All", value: "" },
                        { label: "Completed", value: "completed", activeStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm" },
                        { label: "Rejected", value: "rejected", activeStyle: "bg-red-500/15 text-red-300 border-red-500/40 shadow-sm" },
                        { label: "Postponed", value: "postponed", activeStyle: "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm" },
                    ].map((btn) => {
                        const isActive = filter === btn.value;
                        return (
                            <button
                                key={btn.label}
                                onClick={() => setFilter(btn.value)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                    isActive
                                        ? btn.activeStyle || "bg-primary-dim text-[#f06a7d] border-primary-border shadow-sm"
                                        : "bg-surface border-border text-text-muted hover:text-white hover:border-border/80 hover:bg-surface-2/60"
                                }`}
                            >
                                {btn.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Tasks List (Single Column) ── */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-surface border border-dashed border-border/70 p-8 space-y-3">
                    <Loader2 size={28} className="animate-spin text-[#f06a7d]" />
                    <p className="text-sm font-medium text-text-muted">Loading all tasks…</p>
                </div>
            ) : tasks.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {tasks.map((task) => {
                        const rawStatus = (task.status || "pending").toLowerCase();
                        const isCompleted = rawStatus === "completed" || rawStatus === "complete";
                        const isRejected = rawStatus === "rejected" || rawStatus === "reject";
                        const isPostponed = rawStatus === "postponed" || rawStatus === "postpone";

                        const statusBadgeStyle = isCompleted
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : isRejected
                                ? "text-red-400 bg-red-500/10 border-red-500/20"
                                : isPostponed
                                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                    : "text-sky-400 bg-sky-500/10 border-sky-500/20";

                        const statusLabel = isCompleted
                            ? "Completed"
                            : isRejected
                                ? "Rejected"
                                : isPostponed
                                    ? "Postponed"
                                    : "Pending";

                        const phoneNumbers = task.numbers
                            ? task.numbers.split(",").map((n) => n.trim()).filter(Boolean)
                            : [];

                        const targetUrl = task.url || task.uri;
                        const taskPhoto = task.photoUrl || (typeof task.image === "string" ? task.image : task.image?.photoUrl);
                        const avatarFallback = task.name
                            ? task.name
                                .split(" ")
                                .slice(0, 2)
                                .map((w: string) => w[0])
                                .join("")
                                .toUpperCase()
                            : "T";

                        const createdDate = task.createdAt ? new Date(task.createdAt) : null;
                        const formattedDate = createdDate && !isNaN(createdDate.getTime())
                            ? format(createdDate, "MMM dd, yyyy · hh:mm a")
                            : null;

                        return (
                            <div
                                key={task._id}
                                className="group relative flex flex-col rounded-2xl border border-border bg-surface p-5 sm:p-6 transition-all duration-200 hover:border-border/80 space-y-4 shadow-sm"
                            >
                                {/* Top Accent Line on Hover */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#c43448]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* ── Card Header ── */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                        {/* Picture / Avatar */}
                                        <div className="relative shrink-0 mt-0.5">
                                            {taskPhoto ? (
                                                <img
                                                    src={taskPhoto}
                                                    alt={task.name}
                                                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-border group-hover:ring-[#c43448]/40 transition-all"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center text-sm font-bold text-[#f06a7d]">
                                                    {avatarFallback}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <h3 className="font-bold text-base text-white truncate">
                                                    {task.name}
                                                </h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeStyle}`}>
                                                    {statusLabel}
                                                </span>
                                            </div>

                                            {/* Contact Info & Link */}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                                                {phoneNumbers.length > 0 && (
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <Phone size={13} className="text-[#f06a7d] shrink-0" />
                                                        {phoneNumbers.map((num, idx) => (
                                                            <React.Fragment key={idx}>
                                                                <a
                                                                    href={`tel:${num}`}
                                                                    className="text-text-muted hover:text-white transition-colors underline-offset-2 hover:underline"
                                                                >
                                                                    {num}
                                                                </a>
                                                                {idx < phoneNumbers.length - 1 && (
                                                                    <span className="text-text-muted/40">•</span>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                )}

                                                {targetUrl && (
                                                    <a
                                                        href={targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-[#f06a7d] hover:text-[#f06a7d]/80 transition-colors font-medium"
                                                    >
                                                        <ExternalLink size={13} />
                                                        <span>Visit Page</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Created Date & 3-Dots Dropdown */}
                                    <div className="flex items-center gap-2.5 shrink-0">
                                        {formattedDate && (
                                            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-text-muted">
                                                <Calendar size={13} className="text-text-muted" />
                                                <span>{formattedDate}</span>
                                            </div>
                                        )}

                                        {/* ── 3-Dots Dropdown Actions ── */}
                                        <div className="dropdown dropdown-end">
                                            <div
                                                tabIndex={0}
                                                role="button"
                                                className="btn btn-ghost btn-sm btn-circle text-white bg-surface-2 hover:bg-primary-dim hover:border-primary-border border border-border cursor-pointer flex items-center justify-center transition-all shadow-sm"
                                            >
                                                <MoreVertical size={16} className="text-white shrink-0" />
                                            </div>
                                            <ul
                                                tabIndex={0}
                                                className="dropdown-content menu bg-surface-2/95 backdrop-blur-xl border border-border/80 rounded-2xl z-50 w-52 p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.85),0_0_20px_-5px_hsl(352_58%_49%_/_0.18)] mt-2 space-y-1 overflow-hidden"
                                            >
                                                {/* Top accent glow line */}
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

                                                {/* Edit Task (Only for Admin / Moderator, Pitchers cannot edit) */}
                                                {role !== "pitcher" && (
                                                    <li onClick={closeDropdown}>
                                                        <EditTask
                                                            task={task}
                                                            refetch={refetch}
                                                            className="hover:bg-white/5 text-white/90 hover:text-white font-semibold text-xs py-2 px-2.5 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                        >
                                                            <Pencil size={14} className="text-white" />
                                                            <span>Edit Task</span>
                                                        </EditTask>
                                                    </li>
                                                )}

                                                {/* Complete Task */}
                                                {!isCompleted && (
                                                    <li onClick={() => handleComplete(task)}>
                                                        <button
                                                            type="button"
                                                            className="hover:bg-emerald-500/10 text-emerald-400 font-semibold text-xs py-2 px-2.5 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                        >
                                                            <CheckCircle2 size={14} className="text-emerald-400" />
                                                            <span>Mark Complete</span>
                                                        </button>
                                                    </li>
                                                )}

                                                {/* Postpone Task */}
                                                <li onClick={() => handlePostpone(task)}>
                                                    <button
                                                        type="button"
                                                        className="hover:bg-amber-500/10 text-amber-400 font-semibold text-xs py-2 px-2.5 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                    >
                                                        <Clock size={14} className="text-amber-400" />
                                                        <span>Postpone Task</span>
                                                    </button>
                                                </li>

                                                {/* Reject Task */}
                                                {!isRejected && (
                                                    <li onClick={() => handleReject(task)}>
                                                        <button
                                                            type="button"
                                                            className="hover:bg-red-500/10 text-red-400 font-semibold text-xs py-2 px-2.5 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                        >
                                                            <XCircle size={14} className="text-red-400" />
                                                            <span>Reject Task</span>
                                                        </button>
                                                    </li>
                                                )}

                                                {/* Reset to Pending */}
                                                {(isCompleted || isRejected || isPostponed) && (
                                                    <li onClick={() => handleResetPending(task)}>
                                                        <button
                                                            type="button"
                                                            className="hover:bg-sky-500/10 text-sky-400 font-semibold text-xs py-2 px-2.5 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                        >
                                                            <RotateCcw size={14} className="text-sky-400" />
                                                            <span>Reset to Pending</span>
                                                        </button>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Notice / Instructions ── */}
                                {task.notice && (
                                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-2/60 border border-border/60 text-xs text-text-muted">
                                        <AlignLeft size={14} className="text-text-muted shrink-0 mt-0.5" />
                                        <p className="leading-relaxed text-text-muted/90 whitespace-pre-line">
                                            {task.notice}
                                        </p>
                                    </div>
                                )}

                                {/* ── Postpone History (sorted nearest first) ── */}
                                {task.postpone && task.postpone.length > 0 && (() => {
                                    const sorted = [...task.postpone].sort((a, b) =>
                                        new Date(a.postponeAt).getTime() - new Date(b.postponeAt).getTime()
                                    );
                                    const nearest = sorted[0];
                                    const rest = sorted.slice(1);
                                    return (
                                        <div className="space-y-2">
                                            {/* Nearest (most urgent) postpone — highlighted */}
                                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                                                <CalendarClock size={15} className="text-amber-400 shrink-0 mt-0.5" />
                                                <div className="space-y-0.5 flex-1 min-w-0">
                                                    <div className="font-semibold flex items-center gap-1.5 flex-wrap">
                                                        <span>Next postpone:</span>
                                                        <span className="text-white font-bold">{formatPostponeDate(nearest.postponeAt)}</span>
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold uppercase tracking-wide">Nearest</span>
                                                    </div>
                                                    {nearest.postponeNote && (
                                                        <p className="text-amber-200/80 text-[11px] leading-relaxed">
                                                            Note: {nearest.postponeNote}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Additional postpones */}
                                            {rest.map((p, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-2/60 border border-border/60 text-xs text-text-muted">
                                                    <CalendarClock size={14} className="text-text-muted/60 shrink-0 mt-0.5" />
                                                    <div className="space-y-0.5 flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className="text-text-muted/70">Postponed:</span>
                                                            <span className="text-white/80 font-semibold">{formatPostponeDate(p.postponeAt)}</span>
                                                        </div>
                                                        {p.postponeNote && (
                                                            <p className="text-text-muted/70 text-[11px] leading-relaxed">
                                                                Note: {p.postponeNote}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* ── Empty State ── */
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-surface border border-dashed border-border/70 p-8 space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-text-muted">
                        <ClipboardList size={22} className="opacity-40" />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-white">No tasks found</p>
                        <p className="text-xs text-text-muted mt-0.5">
                            {searchTerm
                                ? "No tasks matching your search query."
                                : "There are no tasks recorded for this pitcher yet."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllTasks;