import { Copy, Link2, Loader2, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import useAxiosSecure from '../../../../../Hooks/useAxiosSecure';
import { Lottie } from "lottie-react";
import type { UseQueryResult } from '@tanstack/react-query';
type params = {
    refetch: UseQueryResult["refetch"]
}
const GenerateReviewURL = ({ refetch }: params) => {
    const axiosSecure = useAxiosSecure()
    const modalRef = useRef<HTMLDialogElement | null>(null)
    const [urlLoading, setUrlLoading] = useState(false)
    const [reviewUrl, setReviewUrl] = useState<string | null>(null)
    // const location = useLocation()
    // console.log(window.location.origin);
    const generateReviewUrl = async () => {
        setUrlLoading(true)
        modalRef.current?.showModal()
        console.log("ready")
        try {
            const { data: result } = await axiosSecure.post("/review-request")
            console.log(result.insertedId);
            setReviewUrl(`${window.location.origin}/client-review/${result.insertedId}`)
            refetch()

        } catch (error) {
            console.log(error);
        } finally {
            setUrlLoading(false)
        }
    }
    const [copied, setCopied] = useState(false)
    const copy = async () => {
        if (reviewUrl) {
            await navigator.clipboard.writeText(reviewUrl);
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 2000);
        }
    }

    return (
        <>
            <button
                onClick={generateReviewUrl}
                disabled={urlLoading}
                className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer shadow-md hover:shadow-[0_0_20px_-5px_var(--primary-glow)] transition-all w-full sm:w-auto shrink-0"
            >
                {urlLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                    <Link2 className="w-4 h-4 shrink-0" />
                )}
                <span>{urlLoading ? "Generating..." : "Generate Review URL"}</span>
            </button>

            <dialog ref={modalRef} className="modal">
                <div
                    className="modal-box relative w-[calc(100vw-1.5rem)] sm:w-11/12 max-w-lg p-0 overflow-hidden mx-auto"
                    style={{
                        background: "hsl(222 14% 9%)",
                        border: "1px solid hsl(222 10% 17%)",
                        borderRadius: "20px",
                        boxShadow: "0 25px 60px -12px rgba(0,0,0,0.85), 0 0 40px -8px hsl(352 58% 49% / 0.18)",
                    }}
                >
                    {/* Top red accent glow line */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "55%",
                            height: "2px",
                            background: "linear-gradient(90deg, transparent, #c43448, transparent)",
                            boxShadow: "0 0 14px hsl(352 58% 49% / 0.45)",
                        }}
                    />

                    {/* Modal Header */}
                    <div
                        className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-5"
                        style={{ borderBottom: "1px solid hsl(222 10% 14%)" }}
                    >
                        <div className="min-w-0 flex-1">
                            <div className="inline-flex items-center gap-2 mb-1">
                                <Link2 size={16} style={{ color: "#f06a7d" }} className="shrink-0" />
                                <h3
                                    className="font-display text-base sm:text-lg font-bold tracking-tight truncate"
                                    style={{ color: "hsl(220 20% 94%)" }}
                                >
                                    Client Review Link
                                </h3>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: "hsl(220 10% 52%)" }}>
                                Send this unique link to your client to collect their rating & testimonial.
                            </p>
                        </div>
                        <form method="dialog" className="shrink-0">
                            <button
                                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-colors cursor-pointer hover:text-white"
                                style={{
                                    background: "hsl(222 12% 14%)",
                                    border: "1px solid hsl(222 10% 20%)",
                                    color: "hsl(220 10% 60%)",
                                }}
                            >
                                ✕
                            </button>
                        </form>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4 sm:p-6 space-y-4">
                        {urlLoading ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-3">
                                <Loader2 className="w-8 h-8 text-[#f06a7d] animate-spin" />
                                <p className="text-xs text-text-muted">Generating unique review URL…</p>
                            </div>
                        ) : (
                            <>
                                {/* Copy URL Bar */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                                        Sharable URL
                                    </label>
                                    <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-surface-2 border border-border">
                                        <div className="flex items-center gap-2 min-w-0 flex-1 pl-1">
                                            <Link2 className="w-4 h-4 text-[#f06a7d] shrink-0" />
                                            <span className="text-xs font-mono text-white/90 truncate select-all">
                                                {reviewUrl || "Generating URL..."}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={copy}
                                            className="btn-primary inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-all shadow-sm w-full min-[380px]:w-auto"
                                        >
                                            {copied ? (
                                                <span className="inline-flex items-center gap-1.5 text-white">
                                                    <Lottie
                                                        src="/Lottie/check.json"
                                                        loop={false}
                                                        autoplay
                                                        className="w-4 h-4 inline-block invert shrink-0"
                                                        style={{ width: 16, height: 16 }}
                                                    />
                                                    <span>Copied!</span>
                                                </span>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5 shrink-0" />
                                                    <span>Copy Link</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary-dim/60 border border-primary-border/40 text-xs text-text-muted">
                                    <Sparkles className="w-4 h-4 text-[#f06a7d] shrink-0 mt-0.5" />
                                    <p className="leading-relaxed break-words">
                                        Clients who open this link can submit their star rating, project feedback, and review without logging into the dashboard.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
};

export default GenerateReviewURL;