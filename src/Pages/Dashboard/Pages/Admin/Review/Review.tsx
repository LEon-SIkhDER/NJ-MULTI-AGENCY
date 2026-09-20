import { useState } from 'react';
import { Copy, Eye, EyeOff, Sparkles, Trash2, Search, Filter } from 'lucide-react';
import GenerateReviewURL from './GenerateReviewURL';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../../../Hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { showCustomSwal } from '../../../../../utils/swal';

export type ReviewType = {
    _id: string;
    status: "pending" | "completed" | "visible" | "hidden" | string;
    name?: string;
    rating?: number | string;
    feedback?: string;
    image?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    company?: string;
    role?: string;
    headline?: string;
    canFeature?: boolean;
    highlights?: string[];
    aspects?: {
        quality?: number;
        speed?: number;
        communication?: number;
    };
};

const Review = () => {
    const axiosSecure = useAxiosSecure();
    const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")

    const { data: reviews, refetch } = useQuery({
        queryKey: ["reviews", search, status],
        queryFn: async () => {
            const { data: result } = await axiosSecure(`/reviews?search=${search}&status=${status}`);
            return result;
        }
    });

    const handleToggleVisibility = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === "visible" ? "completed" : "visible";
        // Change button immediately
        setStatusOverrides((prev) => ({ ...prev, [id]: nextStatus }));

        try {
            const { data: result } = await axiosSecure.patch(`/review/${id}`, { status: nextStatus });
            if (!result.modifiedCount && !result.matchedCount) {
                throw new Error("Failed to update status");
            }
            await refetch();
        } catch (error) {
            // Revert on error
            setStatusOverrides((prev) => ({ ...prev, [id]: currentStatus }));
            const err = error as { message?: string };
            toast.error(err?.message || "Something went wrong");
        }
    };

    const handleDelete = async (id: string) => {
        const confirm = await showCustomSwal({
            des: "You won't be able to revert this!",
            confirmButtonText: "Delete",
            icon: Trash2,
            isDanger: true,
        });
        if (!confirm) return;

        try {
            const { data: result } = await axiosSecure.delete(`/review/${id}`);
            if (!result.deletedCount) {
                throw new Error("Delete Failed");
            }
            await refetch();
        } catch (error) {
            const err = error as { message?: string };
            toast.error(err?.message || "Something went wrong");
        }
    };

    const handleCopyLink = async (id: string) => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/client-review/${id}`);
            toast.success("Link copied!");
        } catch {
            toast.error("Failed to copy link");
        }
    };

    

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dim border border-primary-border text-xs font-semibold text-[#f06a7d] mb-2">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>Client Reputation & Ratings</span>
                    </div>
                    <h1 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-white">
                        Client Reviews & Testimonials
                    </h1>
                    <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl">
                        Monitor verified customer satisfaction, 5-star ratings, project testimonials, and featured showcase reviews.
                    </p>
                </div>
                <GenerateReviewURL refetch={refetch} />
            </div>

            {/* Search & Status Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search by Client Name */}
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by client name..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-[#f06a7d] transition-colors shadow-sm"
                    />
                </div>

                {/* Filter by Status */}
                <div className="relative flex items-center w-full sm:w-48 sm:min-w-[180px]">
                    <Filter className="w-3.5 h-3.5 text-[#f06a7d] absolute left-3 pointer-events-none z-10" />
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.currentTarget.value)}
                        className="select select-sm pl-8 pr-8 bg-surface border border-border text-white text-xs sm:text-sm rounded-xl focus:outline-none focus:border-[#f06a7d] font-medium cursor-pointer w-full"
                    >
                        <option value="" className="bg-surface text-white">All Statuses</option>
                        <option value="pending" className="bg-surface text-white">Pending</option>
                        <option value="visible" className="bg-surface text-white">Visible</option>
                        <option value="completed" className="bg-surface text-white">Hidden</option>
                    </select>
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {reviews?.map((review: ReviewType) => {
                    const currentStatus = statusOverrides[review._id] ?? review.status;
                    const isCompleted = currentStatus !== "pending";

                    if (!isCompleted) {
                        /* 1. Pending Status Card */
                        return (
                            <div
                                key={review._id}
                                className="rounded-2xl p-4 sm:p-5 bg-surface/50 border border-dashed border-border/80 flex flex-col justify-between space-y-4 hover:border-border transition-all"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold shrink-0">
                                            ⏳ Pending
                                        </span>
                                        <span className="text-[11px] text-text-muted font-mono shrink-0">
                                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                        </span>
                                    </div>
                                    <h3 className="font-display font-bold text-sm text-white">
                                        Review Request
                                    </h3>
                                    <p className="text-xs text-text-muted leading-relaxed">
                                        Review link generated. Awaiting client rating and testimonial.
                                    </p>
                                </div>

                                {/* Copy Link Button */}
                                <button
                                    type="button"
                                    onClick={() => handleCopyLink(review._id)}
                                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-surface-2 hover:bg-border text-white border border-border transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                                >
                                    <Copy className="w-3.5 h-3.5 text-[#f06a7d] shrink-0" />
                                    <span>Copy Review Link</span>
                                </button>
                            </div>
                        );
                    }

                    /* 2. Completed Review Card */
                    return (
                        <div
                            key={review._id}
                            className="rounded-2xl p-4 sm:p-5 bg-surface border border-border flex flex-col justify-between space-y-4 hover:border-border-soft transition-all shadow-md"
                        >
                            <div className="space-y-3">
                                {/* Top: Avatar, Name, Rating & Status Badge */}
                                <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                                        {review.image ? (
                                            <img
                                                src={review.image}
                                                alt={review.name || "Client"}
                                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-border shrink-0"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary to-[#f06a7d] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                                                {review.name ? review.name.slice(0, 2).toUpperCase() : "CL"}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-sm text-white truncate">
                                                {review.name || "Client"}
                                            </h4>
                                            {currentStatus === "visible" ? (
                                                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 truncate">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                                    <span className="truncate">Visible on Site</span>
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-text-muted font-medium flex truncate">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stars */}
                                    <div className="flex items-center gap-1 text-amber-400 text-xs px-2 py-0.5 rounded-lg bg-surface-2 border border-border shrink-0">
                                        <span>★</span>
                                        <span className="font-bold text-white">
                                            {review.rating || 5}.0
                                        </span>
                                    </div>
                                </div>

                                {/* Feedback Quote */}
                                <p className="text-xs sm:text-sm text-text-muted italic leading-relaxed line-clamp-3 break-words">
                                    "{review.feedback || "No feedback text."}"
                                </p>
                            </div>

                            {/* Footer: Date & Action Buttons (Visible/Show + Delete) */}
                            <div className="pt-3 border-t border-border flex items-center justify-between gap-2 flex-wrap min-[340px]:flex-nowrap">
                                <span className="text-[11px] text-text-muted font-mono shrink-0">
                                    {review.updatedAt ? new Date(review.updatedAt).toLocaleDateString() : "Verified"}
                                </span>

                                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                    {/* Toggle Visible / Show */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleVisibility(review._id, currentStatus)}
                                        className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                            currentStatus === "visible"
                                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                                                : "bg-surface-2 border-border text-text-muted hover:text-white hover:border-white/20"
                                        }`}
                                    >
                                        {currentStatus === "visible" ? (
                                            <>
                                                <Eye className="w-3.5 h-3.5 shrink-0" />
                                                <span>Visible</span>
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="w-3.5 h-3.5 shrink-0" />
                                                <span>Show</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(review._id)}
                                        className="p-1 sm:p-1.5 rounded-lg border border-border bg-surface-2 text-text-muted hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
                                        title="Delete Review"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Review;