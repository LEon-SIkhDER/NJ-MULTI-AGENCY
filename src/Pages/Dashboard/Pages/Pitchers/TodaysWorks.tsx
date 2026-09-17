import {
    ClipboardList,
    Plus,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    Phone,
    ExternalLink,
    AlignLeft,
    CalendarClock,
    Loader2,
    ArrowRight,
    Pencil
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';
import AssignTasks from './AssignTasks';
import EditTask from './EditTask';
import { format, parseISO, isValid } from 'date-fns';
import useRole from '../../../../Hooks/useRole';
import useAuth from '../../../../Hook/useAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal, { showCustomSwal } from '../../../../utils/swal';

type Pitcher = {
    NID: {
        [key: string]: any;
    }[];
    activePitches: number;
    avgClientPerMonth: number;
    bio: string;
    createdAt: string;
    email: string;
    experienceYears: string;
    gender: string;
    image: {
        photoUrl: string;
        publicId: string;
    };
    joinedAt: string;
    maxQualification: string;
    name: string;
    permanentAddress: string;
    phone: string;
    presentAddress: string;
    role: string;
    specialization: string;
    status: string;
    successRate: number;
    successfullyHandledClient: number;
    totalClientsHandled: number;
    uid: string;
    updatedAt: string;
    _id: string;
    moderatorUid?: string;
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

const TodaysWorks = ({ pitcher }: { pitcher: Pitcher }) => {
    const { role } = useRole();
    const { user } = useAuth();
    const canAssign = role === "admin" || (role === "moderator" && pitcher?.moderatorUid === user?.uid);

    const { data: tasks, refetch, isLoading } = useQuery<Task[]>({
        queryKey: ["tasks", pitcher?.uid],
        queryFn: async () => {
            const { data: result } = await axios.get(`http://localhost:5000/todays_tasks?uid=${pitcher.uid}`);
            return result;
        },
        enabled: !!pitcher?.uid,
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
            const { data: result } = await axios.patch(`http://localhost:5000/task/${task._id}`, {
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
            const { data: result } = await axios.patch(`http://localhost:5000/task/${task._id}`, {
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
            const { data: result } = await axios.patch(`http://localhost:5000/task/${task._id}`, {
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

    return (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-5">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary-dim border border-primary-border">
                        <ClipboardList size={18} className="text-[#f06a7d]" />
                    </div>
                    <div>
                        <h2 className="font-display text-base sm:text-lg font-bold text-white">
                            Today's Tasks
                        </h2>
                        <p className="text-xs text-text-muted">
                            {format(new Date(), "EEEE, MMMM dd, yyyy")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    {canAssign && (
                        <AssignTasks
                            pitcher={pitcher}
                            refetch={refetch}
                            className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm py-2 px-3.5 rounded-xl cursor-pointer"
                        >
                            <Plus size={16} /> Assign Tasks
                        </AssignTasks>
                    )}
                </div>
            </div>

            {/* ── Task List (Single Column) ── */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl bg-surface-2/40 border border-dashed border-border/70 p-6 space-y-2">
                    <Loader2 size={24} className="animate-spin text-[#f06a7d]" />
                    <p className="text-sm font-medium text-text-muted">Loading today's tasks…</p>
                </div>
            ) : tasks && tasks.length > 0 ? (
                <div className="flex flex-col gap-3.5">
                    {tasks.map((task) => {
                        const rawStatus = (task.status || "pending").toLowerCase();
                        const isCompleted = rawStatus === "completed" || rawStatus === "complete";
                        const isRejected = rawStatus === "rejected" || rawStatus === "reject";
                        const isPostponed = rawStatus === "postponed" || rawStatus === "postpone";

                        // Only show 3 dots if task is not completed
                        const showThreeDots = !isCompleted;

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

                        return (
                            <div
                                key={task._id}
                                className="group relative flex flex-col rounded-xl border border-border bg-surface-2/60 p-4 sm:p-5 transition-all duration-200 hover:border-border/80 hover:bg-surface-2/80 space-y-3"
                            >
                                {/* ── Task Card Header ── */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                        {/* Picture / Avatar */}
                                        <div className="relative shrink-0 mt-0.5">
                                            {taskPhoto ? (
                                                <img
                                                    src={taskPhoto}
                                                    alt={task.name}
                                                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-border group-hover:ring-[#c43448]/40 transition-all"
                                                />
                                            ) : (
                                                <div className="w-11 h-11 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center text-xs font-bold text-[#f06a7d]">
                                                    {avatarFallback}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-sm sm:text-base text-white truncate">
                                                    {task.name}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeStyle}`}>
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

                                    {/* ── 3-Dots Dropdown Actions ── */}
                                    {showThreeDots && (
                                        <div className="dropdown dropdown-end shrink-0">
                                            <div
                                                tabIndex={0}
                                                role="button"
                                                className="btn btn-ghost btn-xs sm:btn-sm btn-circle text-white bg-surface border border-border hover:bg-primary-dim hover:border-primary-border cursor-pointer flex items-center justify-center transition-all shadow-sm"
                                            >
                                                <MoreVertical size={16} className="text-white shrink-0" />
                                            </div>
                                            <ul
                                                tabIndex={0}
                                                className="dropdown-content menu bg-surface-2/95 backdrop-blur-xl border border-border/80 rounded-2xl z-50 w-44 p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.85),0_0_20px_-5px_hsl(352_58%_49%_/_0.18)] mt-1 space-y-1 overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

                                                {/* Edit Task (Only for Admin / Moderator, Pitchers cannot edit) */}
                                                {role !== "pitcher" && (
                                                    <li onClick={closeDropdown}>
                                                        <EditTask
                                                            task={task}
                                                            refetch={refetch}
                                                            className="hover:bg-white/5 text-white/90 hover:text-white font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                        >
                                                            <Pencil size={14} className="text-[#f06a7d]" />
                                                            <span>Edit Task</span>
                                                        </EditTask>
                                                    </li>
                                                )}

                                                {/* Postpone */}
                                                <li>
                                                    <button
                                                        onClick={() => handlePostpone(task)}
                                                        className="hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all"
                                                    >
                                                        <Clock size={14} className="text-amber-400" />
                                                        <span>Postpone</span>
                                                    </button>
                                                </li>

                                                {/* Complete */}
                                                <li>
                                                    <button
                                                        onClick={() => handleComplete(task)}
                                                        className="hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all"
                                                    >
                                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                                        <span>Complete</span>
                                                    </button>
                                                </li>

                                                {/* Reject */}
                                                {!isRejected && (
                                                    <li>
                                                        <button
                                                            onClick={() => handleReject(task)}
                                                            className="hover:bg-red-500/10 text-red-400 hover:text-red-300 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all"
                                                        >
                                                            <XCircle size={14} className="text-red-400" />
                                                            <span>Reject</span>
                                                        </button>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* ── Notice / Instructions ── */}
                                {task.notice && (
                                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface border border-border/60 text-xs text-text-muted">
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
                                            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
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
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl bg-surface-2/40 border border-dashed border-border/70 p-6">
                    <div className="h-12 w-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-text-muted mb-3">
                        <ClipboardList size={22} className="opacity-40" />
                    </div>
                    <p className="text-sm font-medium text-text-muted">
                        No work has been assigned today.
                    </p>
                </div>
            )}
            {/* ── View All Tasks Link Button ── */}
            <div className='flex justify-end'>

                <Link
                    to="all-tasks"
                    className=" inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-2 border border-border hover:border-[#c43448]/50 hover:bg-primary-dim hover:text-[#f06a7d] text-xs font-semibold text-text-muted transition-all shadow-sm group"
                >
                    <span>View All</span>
                    <ArrowRight size={14} className="text-[#f06a7d] group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

export default TodaysWorks;