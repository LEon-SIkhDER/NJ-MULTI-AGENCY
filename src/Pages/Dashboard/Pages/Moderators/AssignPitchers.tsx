import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    X,
    Users,
    Search,
    Loader2,
    UserMinus,
    Mail,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { showCustomSwal } from "../../../../utils/swal";

type Pitcher = {
    _id: string;
    uid: string;
    name: string;
    email: string;
    image?: { photoUrl: string; publicId: string };
    status?: string;
    moderatorUid?: string;
};

type props = {
    children: React.ReactNode;
    className: string;
    moderatorUid: string;
    moderatorName: string;
    refetch?: UseQueryResult["refetch"] | (() => void);
};

const AssignPitchers = ({ children, className, moderatorUid, moderatorName, refetch }: props) => {
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [checked, setChecked] = useState<Set<string>>(new Set());
    const [submitting, setSubmitting] = useState(false);

    // already assigned pitchers to this moderator
    const { data: assignedPitchers = [], refetch: refetchAssigned, isLoading: assignedLoading } = useQuery<Pitcher[]>({
        queryKey: ["assigned-pitchers", moderatorUid],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:5000/pitchers/by-moderator?moderatorUid=${moderatorUid}`);
            return data;
        },
        enabled: !!moderatorUid,
    });

    // pitchers available to be assigned (free or already on this mod)
    const { data: availablePitchers = [], isLoading: listLoading } = useQuery<Pitcher[]>({
        queryKey: ["assignable-pitchers", moderatorUid, search],
        queryFn: async () => {
            const { data } = await axios.get(
                `http://localhost:5000/pitchers/assignable?moderatorUid=${moderatorUid}&search=${search}`
            );
            return data;
        },
        enabled: !!moderatorUid,
    });

    // pre-check pitchers already assigned
    useEffect(() => {
        if (assignedPitchers.length > 0) {
            setChecked(new Set(assignedPitchers.map((p) => p.uid)));
        }
    }, [assignedPitchers]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        setSearchInput(val);
        if (timeoutId.current) clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => setSearch(val), 450);
    };

    const toggleCheck = (uid: string) => {
        setChecked((prev) => {
            const next = new Set(prev);
            if (next.has(uid)) next.delete(uid);
            else next.add(uid);
            return next;
        });
    };

    const openModal = () => {
        modalRef.current?.showModal();
    };

    const closeModal = () => {
        modalRef.current?.close();
        setSearch("");
        setSearchInput("");
    };

    // ── Unassign a single pitcher ──
    const handleUnassign = async (pitcher: Pitcher) => {
        closeModal()
        const confirm = await showCustomSwal({
            des: `Remove ${pitcher.name} from ${moderatorName}?`,
            confirmButtonText: "Remove",
        });
        if (!confirm) return;

        const toastId = toast.loading("Removing...");
        try {
            await axios.patch("http://localhost:5000/pitchers/unassign-moderator", {
                pitcherUid: pitcher.uid,
            });
            await refetchAssigned();
            if (refetch) await refetch();
            setChecked((prev) => {
                const next = new Set(prev);
                next.delete(pitcher.uid);
                return next;
            });
            toast.dismiss(toastId);
            toast.success(`${pitcher.name} removed`);
        } catch {
            toast.dismiss(toastId);
            toast.error("Something went wrong");
        }
    };

    // ── Assign selected pitchers ──
    const handleAssign = async () => {
        if (checked.size === 0) return toast.error("Select at least one pitcher");

        setSubmitting(true);
        const toastId = toast.loading("Assigning...");
        try {
            const { data: result } = await axios.patch("http://localhost:5000/pitchers/assign-moderator", {
                pitcherUids: [...checked],
                moderatorUid,
            });
            if (!result.modifiedCount && !result.matchedCount) {
                throw new Error("Assign failed");
            }
            await refetchAssigned();
            if (refetch) await refetch();
            toast.dismiss(toastId);
            toast.success("Pitchers assigned successfully");
            closeModal();
        } catch (error) {
            const err = error as { message?: string };
            toast.dismiss(toastId);
            toast.error(err.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const listToShow = search ? availablePitchers : availablePitchers.slice(0, 5);

    const avatarFallback = (name: string) =>
        name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();

    return (
        <>
            <button className={className} onClick={openModal}>
                {children}
            </button>

            {typeof document !== "undefined" && createPortal(
                <dialog ref={modalRef} className="modal">
                    <div
                        className="modal-box relative w-11/12 max-w-lg p-0 overflow-hidden"
                        style={{
                            background: "hsl(222 14% 9%)",
                            border: "1px solid hsl(222 10% 17%)",
                            borderRadius: "20px",
                            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.85), 0 0 40px -8px hsl(352 58% 49% / 0.18)",
                        }}
                    >
                    {/* top accent glow line */}
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "55%", height: "2px", background: "linear-gradient(90deg, transparent, #c43448, transparent)", boxShadow: "0 0 14px hsl(352 58% 49% / 0.45)" }} />

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-6 pt-6 pb-5" style={{ borderBottom: "1px solid hsl(222 10% 14%)" }}>
                        <div>
                            <div className="inline-flex items-center gap-2 mb-1">
                                <Users size={16} style={{ color: "#f06a7d" }} />
                                <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: "hsl(220 20% 94%)" }}>
                                    Assign Pitchers
                                </h3>
                            </div>
                            <p className="text-xs" style={{ color: "hsl(220 10% 52%)" }}>
                                Assign pitchers under <span style={{ color: "#f06a7d", fontWeight: 600 }}>{moderatorName}</span>
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer"
                            style={{ background: "hsl(222 12% 14%)", border: "1px solid hsl(222 10% 20%)", color: "hsl(220 10% 60%)" }}
                        >
                            <X size={15} />
                        </button>
                    </div>

                    <div className="overflow-y-auto px-6 py-5 space-y-5" style={{ maxHeight: "72vh" }}>

                        {/* ── Already Assigned Section ── */}
                        {assignedLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 size={18} className="animate-spin" style={{ color: "#f06a7d" }} />
                            </div>
                        ) : assignedPitchers.length > 0 ? (
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-semibold mb-2.5" style={{ color: "hsl(220 10% 50%)" }}>
                                    Currently Assigned ({assignedPitchers.length})
                                </p>
                                <div className="flex flex-col gap-2">
                                    {assignedPitchers.map((p) => (
                                        <div
                                            key={p.uid}
                                            className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl"
                                            style={{ background: "hsl(222 12% 12%)", border: "1px solid hsl(222 10% 18%)" }}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {p.image?.photoUrl ? (
                                                    <img
                                                        src={p.image.photoUrl}
                                                        alt={p.name}
                                                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).style.display = "none";
                                                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
                                                        }}
                                                    />
                                                ) : null}
                                                <div
                                                    className="w-8 h-8 rounded-lg shrink-0 items-center justify-center text-xs font-bold"
                                                    style={{
                                                        display: p.image?.photoUrl ? "none" : "flex",
                                                        background: "hsl(352 58% 18%)",
                                                        border: "1px solid hsl(352 58% 28%)",
                                                        color: "#f06a7d",
                                                    }}
                                                >
                                                    {avatarFallback(p.name)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                                                    <p className="text-[11px] truncate flex items-center gap-1" style={{ color: "hsl(220 10% 50%)" }}>
                                                        <Mail size={11} />
                                                        {p.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUnassign(p)}
                                                className="shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer"
                                                style={{ color: "hsl(0 70% 60%)", background: "hsl(0 58% 14%)", border: "1px solid hsl(0 58% 22%)" }}
                                                title="Unassign"
                                            >
                                                <UserMinus size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* ── Divider ── */}
                        {assignedPitchers.length > 0 && (
                            <div style={{ height: 1, background: "hsl(222 10% 15%)" }} />
                        )}

                        {/* ── Search ── */}
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2.5" style={{ color: "hsl(220 10% 50%)" }}>
                                {search ? `Search results` : `Available Pitchers (showing first 5)`}
                            </p>
                            <div className="relative mb-3">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "hsl(220 10% 45%)" }} />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={handleSearch}
                                    placeholder="Search by name or email..."
                                    style={{
                                        width: "100%",
                                        padding: "0.55rem 0.85rem 0.55rem 2.1rem",
                                        background: "hsl(222 12% 11%)",
                                        border: "1px solid hsl(222 10% 18%)",
                                        borderRadius: 10,
                                        color: "hsl(220 20% 90%)",
                                        fontSize: "0.8rem",
                                        outline: "none",
                                    }}
                                />
                            </div>

                            {/* ── Pitcher list with checkboxes ── */}
                            {listLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 size={20} className="animate-spin" style={{ color: "#f06a7d" }} />
                                </div>
                            ) : listToShow.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 gap-2" style={{ color: "hsl(220 10% 45%)" }}>
                                    <Users size={28} style={{ opacity: 0.3 }} />
                                    <p className="text-xs">
                                        {search ? `No pitchers found for "${search}"` : "No available pitchers"}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {listToShow.map((p) => {
                                        const isAlreadyOtherMod = p.moderatorUid && p.moderatorUid !== moderatorUid;
                                        const isChecked = checked.has(p.uid);
                                        return (
                                            <label
                                                key={p.uid}
                                                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${isAlreadyOtherMod ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                                                style={{
                                                    background: isChecked ? "hsl(352 58% 11%)" : "hsl(222 12% 12%)",
                                                    border: `1px solid ${isChecked ? "hsl(352 58% 28%)" : "hsl(222 10% 18%)"}`,
                                                }}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {p.image?.photoUrl ? (
                                                        <img
                                                            src={p.image.photoUrl}
                                                            alt={p.name}
                                                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                                                (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div
                                                        className="w-8 h-8 rounded-lg shrink-0 items-center justify-center text-xs font-bold"
                                                        style={{
                                                            display: p.image?.photoUrl ? "none" : "flex",
                                                            background: "hsl(352 58% 18%)",
                                                            border: "1px solid hsl(352 58% 28%)",
                                                            color: "#f06a7d",
                                                        }}
                                                    >
                                                        {avatarFallback(p.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                                                        <p className="text-[11px] truncate flex items-center gap-1" style={{ color: "hsl(220 10% 50%)" }}>
                                                            <Mail size={11} />
                                                            {p.email}
                                                        </p>
                                                        {isAlreadyOtherMod && (
                                                            <span className="text-[10px] font-semibold" style={{ color: "hsl(0 70% 55%)" }}>
                                                                Assigned to another moderator
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-sm border-border"
                                                    checked={isChecked}
                                                    disabled={!!isAlreadyOtherMod}
                                                    onChange={() => !isAlreadyOtherMod && toggleCheck(p.uid)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ accentColor: "#c43448" }}
                                                />
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ── Actions ── */}
                        <div className="flex items-center justify-end gap-3 pt-3" style={{ borderTop: "1px solid hsl(222 10% 14%)" }}>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                                style={{ background: "hsl(222 12% 14%)", border: "1px solid hsl(222 10% 22%)", color: "hsl(220 15% 75%)" }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAssign}
                                disabled={submitting || checked.size === 0}
                                className="btn-primary px-5 py-2.5 text-sm font-semibold rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                            >
                                {submitting && <Loader2 size={14} className="animate-spin" />}
                                Assign ({checked.size})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Backdrop close */}
                <form method="dialog" className="modal-backdrop">
                    <button type="submit" onClick={closeModal}>close</button>
                </form>
            </dialog>,
            document.body
        )}
        </>
    );
};

export default AssignPitchers;
