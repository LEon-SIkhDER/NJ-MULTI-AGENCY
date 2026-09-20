import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import axios from 'axios';
import useAuth from '../../../../../../Hook/useAuth';
import toast from 'react-hot-toast';
import { useState } from 'react';

const ClientReview = () => {
    const { id } = useParams()
    console.log(id);
    const { user } = useAuth()
    const [submitting, setSubmitting] = useState(false)
    const { data: reviewRequest, isLoading, refetch } = useQuery({
        queryKey: ["reviewRequest"],
        queryFn: async () => {
            const { data: result } = await axios.get(`${import.meta.env.VITE_API_URL}/review/${id}`)
            return result
        }
    })
    console.log(reviewRequest);

    const handleSubmitReview = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        const formData = Object.fromEntries(new FormData(e.currentTarget))
        formData.image = user?.photoURL || ""
        formData.status = "completed"
        console.log(formData);

        try {
            const { data: result } = await axios.patch(`${import.meta.env.VITE_API_URL}/review/${reviewRequest._id}`, formData)
            if (!result.modifiedCount) {
                throw new Error("Submit")
            }
            await refetch()
            toast.success("Submitted")
        } catch (error) {
            const err = error as { message?: string }
            toast.error(err?.message || "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }
    console.log(reviewRequest, isLoading)
    return (
        <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4 sm:p-6 selection:bg-primary-dim relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-80 rounded-full blur-3xl bg-primary/20 pointer-events-none" />
            <div className="w-full max-w-xl relative z-10">
                {
                    isLoading ?
                        // {/* // loading state */ }
                        < div className="py-2 text-center text-xs text-text-muted animate-pulse">
                            Connecting to review session...
                        </div> :
                        reviewRequest ?
                            (reviewRequest.status === "pending" ?
                                // {/* review form*/}
                                < div className="relative rounded-2xl p-6 sm:p-8 border border-border bg-surface shadow-2xl shadow-black/80 space-y-6">
                                    {/* Top Red Accent Glow Line */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

                                    {/* Header */}
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-xs font-medium text-[#f06a7d]">
                                            <span>★</span>
                                            <span>Client Review</span>
                                        </div>
                                        <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                                            Share Your Experience
                                        </h2>
                                        <p className="text-xs sm:text-sm text-text-muted">
                                            Please take a moment to leave your honest feedback and rating.
                                        </p>
                                    </div>


                                    {/* Simple Review Form */}
                                    <form className="space-y-5" onSubmit={handleSubmitReview}>
                                        {/* 1. Name Input */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-white/90 block">
                                                Your Name <span className="text-[#f06a7d]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="Enter your full name"
                                                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-text-faint focus:border-[#f06a7d] focus:outline-none focus:ring-1 focus:ring-[#f06a7d]/40 transition-all"
                                            />
                                        </div>

                                        {/* 2. Rating As Like a Bar */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs font-semibold">
                                                <span className="text-white/90">
                                                    Rating <span className="text-[#f06a7d]">*</span>
                                                </span>
                                                <span className="text-text-muted text-[11px]">
                                                    Click a bar segment (1 to 5)
                                                </span>
                                            </div>

                                            {/* Segmented Interactive Rating Bar */}
                                            <div className="p-1.5 rounded-xl bg-surface-2 border border-border grid grid-cols-5 gap-1.5">
                                                {/* Segment 1 */}
                                                <label className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-white/5 has-checked:bg-gradient-to-tr has-checked:from-primary has-checked:to-[#f06a7d] has-checked:text-white has-checked:shadow-lg has-checked:shadow-primary/30 select-none">
                                                    <input
                                                        type="radio"
                                                        name="rating"
                                                        value="1"
                                                        className="sr-only"
                                                    />
                                                    <span className="font-display font-bold text-sm leading-none">1</span>
                                                    <span className="text-[10px] mt-1 text-white/70">★</span>
                                                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
                                                        Bad
                                                    </span>
                                                </label>

                                                {/* Segment 2 */}
                                                <label className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-white/5 has-checked:bg-gradient-to-tr has-checked:from-primary has-checked:to-[#f06a7d] has-checked:text-white has-checked:shadow-lg has-checked:shadow-primary/30 select-none">
                                                    <input
                                                        type="radio"
                                                        name="rating"
                                                        value="2"
                                                        className="sr-only"
                                                    />
                                                    <span className="font-display font-bold text-sm leading-none">2</span>
                                                    <span className="text-[10px] mt-1 text-white/70">★★</span>
                                                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
                                                        Poor
                                                    </span>
                                                </label>

                                                {/* Segment 3 */}
                                                <label className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-white/5 has-checked:bg-gradient-to-tr has-checked:from-primary has-checked:to-[#f06a7d] has-checked:text-white has-checked:shadow-lg has-checked:shadow-primary/30 select-none">
                                                    <input
                                                        type="radio"
                                                        name="rating"
                                                        value="3"
                                                        className="sr-only"
                                                    />
                                                    <span className="font-display font-bold text-sm leading-none">3</span>
                                                    <span className="text-[10px] mt-1 text-white/70">★★★</span>
                                                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
                                                        Fair
                                                    </span>
                                                </label>

                                                {/* Segment 4 */}
                                                <label className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-white/5 has-checked:bg-gradient-to-tr has-checked:from-primary has-checked:to-[#f06a7d] has-checked:text-white has-checked:shadow-lg has-checked:shadow-primary/30 select-none">
                                                    <input
                                                        type="radio"
                                                        name="rating"
                                                        value="4"
                                                        className="sr-only"
                                                    />
                                                    <span className="font-display font-bold text-sm leading-none">4</span>
                                                    <span className="text-[10px] mt-1 text-white/70">★★★★</span>
                                                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
                                                        Good
                                                    </span>
                                                </label>

                                                {/* Segment 5 */}
                                                <label className="flex flex-col items-center justify-center py-2.5 px-1 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-white/5 has-checked:bg-gradient-to-tr has-checked:from-primary has-checked:to-[#f06a7d] has-checked:text-white has-checked:shadow-lg has-checked:shadow-primary/30 select-none">
                                                    <input
                                                        type="radio"
                                                        name="rating"
                                                        value="5"
                                                        defaultChecked
                                                        className="sr-only"
                                                    />
                                                    <span className="font-display font-bold text-sm leading-none">5</span>
                                                    <span className="text-[10px] mt-1 text-white/70">★★★★★</span>
                                                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
                                                        Great
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Range Scale Bar Tracker */}
                                            <div className="flex items-center justify-between text-[11px] text-text-muted px-1">
                                                <span>1 - Needs Work</span>
                                                <span>5 - World Class</span>
                                            </div>
                                        </div>

                                        {/* 3. Detailed Feedback */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-white/90 block">
                                                Detailed Feedback <span className="text-[#f06a7d]">*</span>
                                            </label>
                                            <textarea
                                                name="feedback"
                                                required
                                                rows={4}
                                                placeholder="Describe your experience working with NJ Multi Agency. What did we do well and how can we improve?"
                                                className="w-full bg-surface-2 border border-border rounded-xl p-3.5 text-sm text-white placeholder:text-text-faint focus:border-[#f06a7d] focus:outline-none focus:ring-1 focus:ring-[#f06a7d]/40 transition-all resize-y leading-relaxed"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="btn-primary w-full justify-center py-3 rounded-xl font-semibold text-sm cursor-pointer shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all"
                                        >
                                            {submitting ? <span className="loading loading-spinner text-neutral"></span> : "Submit Review"}
                                        </button>
                                    </form>
                                </div> :
                                // {/* // submitted review */}
                                <div className="relative rounded-2xl p-6 sm:p-8 border border-border bg-surface shadow-2xl shadow-black/80 space-y-6">
                                    {/* Top Red Accent Glow Line */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

                                    {/* Header */}
                                    <div className="text-center space-y-2">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
                                            <span className="text-sm">✓</span>
                                            <span>Review Submitted</span>
                                        </div>
                                        <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                                            Your Review Has Been Submitted
                                        </h2>
                                        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
                                            Thank you for sharing your feedback. Here is a summary of the review you submitted.
                                        </p>
                                    </div>

                                    {/* Review Details Card */}
                                    <div className="p-5 sm:p-6 rounded-xl bg-surface-2 border border-border space-y-4">
                                        {/* Client Info & Rating Header */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                                            <div className="flex items-center gap-3">
                                                {reviewRequest?.image ? (
                                                    <img
                                                        src={reviewRequest.image}
                                                        alt={reviewRequest?.name || "Client"}
                                                        className="w-11 h-11 rounded-full object-cover border border-border shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-[#f06a7d] flex items-center justify-center font-bold text-white text-sm shadow-md">
                                                        {reviewRequest?.name ? reviewRequest.name.slice(0, 2).toUpperCase() : "CL"}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-sm sm:text-base text-white leading-snug">
                                                        {reviewRequest?.name || "Valued Client"}
                                                    </h3>
                                                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                        Verified Testimonial
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Star Rating Badge */}
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border">
                                                <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={star <= Number(reviewRequest?.rating || 5) ? "text-amber-400" : "text-white/20"}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                                <span className="font-bold text-xs text-white">
                                                    {reviewRequest?.rating || "5"}.0
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rating Tier Bar summary */}
                                        <div className="flex items-center justify-between text-xs px-1">
                                            <span className="text-text-muted">Experience Rating</span>
                                            <span className="font-semibold text-primary">
                                                {Number(reviewRequest?.rating) === 5 && "Great (5★)"}
                                                {Number(reviewRequest?.rating) === 4 && "Good (4★)"}
                                                {Number(reviewRequest?.rating) === 3 && "Fair (3★)"}
                                                {Number(reviewRequest?.rating) === 2 && "Poor (2★)"}
                                                {Number(reviewRequest?.rating) === 1 && "Bad (1★)"}
                                                {!reviewRequest?.rating && "5★ — Great"}
                                            </span>
                                        </div>

                                        {/* Detailed Feedback Text */}
                                        <div className="space-y-1.5">
                                            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                                                Your Feedback
                                            </span>
                                            <div className="p-4 rounded-xl bg-surface border border-border text-sm text-white/90 leading-relaxed italic">
                                                "{reviewRequest?.feedback || "Thank you for the opportunity to collaborate!"}"
                                            </div>
                                        </div>

                                        {/* Submission timestamp if present */}
                                        {(reviewRequest?.updatedAt || reviewRequest?.createdAt) && (
                                            <div className="text-[11px] text-text-muted text-right pt-1">
                                                Submitted on {new Date(reviewRequest.updatedAt || reviewRequest.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Back to Home Action */}
                                    <div className="pt-2 text-center">
                                        <a
                                            href="/"
                                            className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all"
                                        >
                                            <span>Back to NJ Multi Agency</span>
                                        </a>
                                    </div>
                                </div>
                            ) :
                            // {/* link not found */}
                            < div className="relative rounded-2xl p-8 sm:p-10 border border-border bg-surface shadow-2xl shadow-black/80 text-center space-y-6">
                                {/* Top Red Glow Line */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

                                {/* Warning Icon Badge */}
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-2xl text-[#f06a7d] shadow-[0_0_20px_rgba(196,52,72,0.2)]">
                                    ⚠️
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-[#f06a7d]">
                                        <span>Link Not Found</span>
                                    </div>
                                    <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                                        Invalid or Expired Review Link
                                    </h2>
                                    <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                                        We couldn't find an active review session for this link. It may have expired, or part of the link was missed when copied.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <a
                                        href="/"
                                        className="btn-primary w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm"
                                    >
                                        Return to Homepage
                                    </a>
                                    <a
                                        href="mailto:contact@njmultiagency.com"
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-border bg-surface-2 text-xs sm:text-sm font-semibold text-text-muted hover:text-white hover:border-white/20 transition-all"
                                    >
                                        Contact Support
                                    </a>
                                </div>
                            </div>
                }
            </div>
        </div >
    );
};

export default ClientReview;