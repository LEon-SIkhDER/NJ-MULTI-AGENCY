import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Sparkles,
    Search,
    X,
    Handshake,
    Phone,
    Mail,
    ExternalLink,
    Calendar,
    AlignLeft,
    CheckCircle2,
    Copy,
    Globe,
    MoreVertical,
    DollarSign,
    Clock,
    Percent,
    Building2,
    Loader2,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export interface ClientItem {
    _id?: string;
    name?: string;
    email?: string;
    numbers?: string;
    phone?: string;
    photoUrl?: string;
    image?: { photoUrl: string; publicId?: string } | string;
    url?: string;
    uri?: string;
    notice?: string;
    status?: string;
    assignedBy?: string;
    assignedTo?: string;
    pitcherName?: string;
    company?: string;
    createdAt?: string | number | Date;
    updatedAt?: string | number | Date;
    completedAt?: string | number | Date;
    balance?: number;
    paymentStatus?: string;
    pitcherEarning?: number;
    moderatorEarning?: number;
    agencyEarning?: number;
    pitcherPaidStatus?: string;
    moderatorPaidStatus?: string;
    paidAt?: string | number | Date;
}

const Clients: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Pay Modal state
    const payModalRef = useRef<HTMLDialogElement | null>(null);
    const [activeClient, setActiveClient] = useState<ClientItem | null>(null);
    const [balanceVal, setBalanceVal] = useState<string>("");
    const [isSavingPay, setIsSavingPay] = useState(false);

    // Search with 500ms debounce
    const handleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const search = e.currentTarget.value;
        if (timeoutId?.current) {
            clearTimeout(timeoutId?.current);
        }
        timeoutId.current = setTimeout(() => {
            setSearchTerm(search);
        }, 500);
    };

    // Query data from API with fixed status=completed
    const { data: clients = [], isLoading, refetch } = useQuery<ClientItem[]>({
        queryKey: ["admin-clients", searchTerm],
        queryFn: async () => {
            const { data } = await axios.get(
                `http://localhost:5000/admin/clients?status=completed&search=${searchTerm}`
            );
            return Array.isArray(data) ? data : [];
        },
    });

    const closeDropdown = () => {
        const elem = document.activeElement as HTMLElement;
        elem?.blur();
    };

    const handleCopy = (text: string, label: string) => {
        closeDropdown();
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const handleOpenPayModal = (client: ClientItem) => {
        closeDropdown();
        setActiveClient(client);
        setBalanceVal(client.balance ? String(client.balance) : "");
        payModalRef.current?.showModal();
    };

    const handleClosePayModal = () => {
        payModalRef.current?.close();
        setActiveClient(null);
        setBalanceVal("");
    };

    const handleSaveBalance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeClient?._id) return;
        const num = parseFloat(balanceVal);
        if (isNaN(num) || num <= 0) {
            toast.error("Please enter a valid balance amount");
            return;
        }

        setIsSavingPay(true);
        const toastId = toast.loading("Recording payment & commissions...");
        try {
            const { data: result } = await axios.patch(
                `http://localhost:5000/task/mark-paid/${activeClient._id}`,
                { balance: num }
            );
            if (!result.matchedCount && !result.modifiedCount) {
                throw new Error("Failed to record balance");
            }
            await refetch();
            toast.dismiss(toastId);
            toast.success("Client marked as Paid! Commissions allocated.");
            handleClosePayModal();
        } catch (error) {
            const err = error as { message?: string };
            toast.dismiss(toastId);
            toast.error(err.message || "Failed to update payment");
        } finally {
            setIsSavingPay(false);
        }
    };

    const parsedBalance = parseFloat(balanceVal) || 0;
    const pitcher15 = Math.round(parsedBalance * 0.15 * 100) / 100;
    const moderator5 = Math.round(parsedBalance * 0.05 * 100) / 100;
    const agency80 = Math.round((parsedBalance - pitcher15 - moderator5) * 100) / 100;

    const totalRevenue = clients.reduce((sum, c) => sum + (Number(c.balance) || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dim border border-primary-border text-xs font-semibold text-[#f06a7d] mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Client Relationships &amp; Deals</span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        Completed Clients &amp; Payments
                    </h1>
                    <p className="text-xs sm:text-sm text-text-muted mt-1">
                        Manage closed client deals, set balances, and automate 15% Pitcher &amp; 5% Moderator commission splits.
                    </p>
                </div>

                {/* Counter Badges */}
                <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text-muted shadow-sm">
                        <Handshake className="w-4 h-4 text-[#f06a7d]" />
                        <span>Completed:</span>
                        <span className="font-bold text-white text-sm">{clients.length}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 shadow-sm">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span>Total Revenue:</span>
                        <span className="font-bold text-white text-sm">৳{totalRevenue.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* ── Search Bar Controls ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by client name, email, or phone…"
                        onChange={handleSearch}
                        className="w-full pl-10 pr-10 py-2.5 bg-surface border border-border rounded-xl text-xs sm:text-sm text-white placeholder-text-faint focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all shadow-sm"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── Clients Table / Container ── */}
            <div className="relative rounded-2xl border border-border bg-surface shadow-2xl backdrop-blur-xl">
                {/* Top red accent glow line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 rounded-xl bg-surface-2 animate-pulse border border-border/50" />
                        ))}
                    </div>
                ) : clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-text-muted mb-4 shadow-inner">
                            <Handshake className="w-7 h-7 opacity-40 text-[#f06a7d]" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">No clients found</h3>
                        <p className="text-xs sm:text-sm text-text-muted max-w-sm">
                            {searchTerm
                                ? `No completed clients matched "${searchTerm}".`
                                : "No completed clients are available in the record right now."}
                        </p>
                    </div>
                ) : (
                    <div className="">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/80 bg-surface-2/60 text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                                    <th className="py-4 px-5 sm:px-6">Client</th>
                                    <th className="py-4 px-5">Contact Details</th>
                                    <th className="py-4 px-5 hidden md:table-cell">Web / Source</th>
                                    <th className="py-4 px-5">Deal Value &amp; Splits</th>
                                    <th className="py-4 px-5">Payment Status</th>
                                    <th className="py-4 px-5 hidden lg:table-cell">Completed</th>
                                    <th className="py-4 px-5 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                                {clients.map((client, idx) => {
                                    const clientId = client._id || `client-${idx}`;
                                    const displayName = client.name || "Anonymous Client";
                                    const avatarFallback =
                                        displayName
                                            .split(" ")
                                            .slice(0, 2)
                                            .map((w) => w[0])
                                            .join("")
                                            .toUpperCase() || "C";

                                    const clientPhoto =
                                        client.photoUrl ||
                                        (typeof client.image === "string" ? client.image : client.image?.photoUrl) ||
                                        "";

                                    const phoneRaw = client.numbers || client.phone || "";
                                    const phoneList = phoneRaw
                                        ? phoneRaw.split(",").map((n) => n.trim()).filter(Boolean)
                                        : [];

                                    const targetUrl = client.url || client.uri;

                                    const dateVal = client.completedAt || client.createdAt || client.updatedAt;
                                    const clientDate = dateVal ? new Date(dateVal) : null;
                                    const dateFormatted =
                                        clientDate && !isNaN(clientDate.getTime())
                                            ? format(clientDate, "MMM dd, yyyy")
                                            : "—";

                                    const isPaid = client.paymentStatus === "paid" || Boolean(client.balance);
                                    const balance = Number(client.balance) || 0;
                                    const pitcherE = Number(client.pitcherEarning) || Math.round(balance * 0.15 * 100) / 100;
                                    const moderatorE = Number(client.moderatorEarning) || Math.round(balance * 0.05 * 100) / 100;

                                    return (
                                        <tr key={clientId} className="hover:bg-surface-2/50 transition-colors group">
                                            {/* Client Name + Photo */}
                                            <td className="py-4 px-5 sm:px-6">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="relative shrink-0">
                                                        {clientPhoto && !brokenImages[clientId] ? (
                                                            <img
                                                                src={clientPhoto}
                                                                alt={displayName}
                                                                referrerPolicy="no-referrer"
                                                                className="w-10 h-10 rounded-xl object-cover ring-1 ring-border group-hover:ring-[#c43448]/40 transition-all shadow-sm"
                                                                onError={() => {
                                                                    setBrokenImages((prev) => ({
                                                                        ...prev,
                                                                        [clientId]: true,
                                                                    }));
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center font-bold text-xs text-[#f06a7d] shadow-sm">
                                                                {avatarFallback}
                                                            </div>
                                                        )}
                                                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-surface bg-emerald-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-white truncate group-hover:text-[#f06a7d] transition-colors">
                                                            {displayName}
                                                        </p>
                                                        {client.notice && (
                                                            <div className="flex items-center gap-1 text-[10px] text-text-muted/80 truncate max-w-[200px] sm:max-w-[260px] mt-0.5">
                                                                <AlignLeft className="w-3 h-3 text-text-faint shrink-0" />
                                                                <span className="truncate">{client.notice}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Details */}
                                            <td className="py-4 px-5">
                                                <div className="space-y-1">
                                                    {phoneList.length > 0 ? (
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <Phone className="w-3.5 h-3.5 text-[#f06a7d] shrink-0" />
                                                            {phoneList.map((num, pIdx) => (
                                                                <React.Fragment key={pIdx}>
                                                                    <a
                                                                        href={`tel:${num}`}
                                                                        className="text-text-muted hover:text-white transition-colors"
                                                                    >
                                                                        {num}
                                                                    </a>
                                                                    {pIdx < phoneList.length - 1 && (
                                                                        <span className="text-text-muted/40">•</span>
                                                                    )}
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-text-faint">—</span>
                                                    )}

                                                    {client.email && (
                                                        <div className="flex items-center gap-1.5 text-text-muted text-xs">
                                                            <Mail className="w-3.5 h-3.5 text-text-faint shrink-0" />
                                                            <a
                                                                href={`mailto:${client.email}`}
                                                                className="hover:text-white transition-colors truncate max-w-[180px]"
                                                            >
                                                                {client.email}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Web Link */}
                                            <td className="py-4 px-5 hidden md:table-cell">
                                                {targetUrl ? (
                                                    <a
                                                        href={
                                                            targetUrl.startsWith("http")
                                                                ? targetUrl
                                                                : `https://${targetUrl}`
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-xs text-[#f06a7d] hover:text-white hover:border-primary-border transition-all"
                                                    >
                                                        <Globe className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate max-w-[130px]">
                                                            {targetUrl.replace(/^https?:\/\//, "")}
                                                        </span>
                                                        <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                                                    </a>
                                                ) : (
                                                    <span className="text-text-faint text-xs">—</span>
                                                )}
                                            </td>

                                            {/* Deal Value & Commission Splits */}
                                            <td className="py-4 px-5">
                                                {isPaid ? (
                                                    <div className="space-y-1">
                                                        <div className="font-display font-bold text-white text-sm flex items-center gap-1">
                                                            <span>৳{balance.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                                                            <span className="text-[#f06a7d] font-semibold">15% P: ৳{pitcherE}</span>
                                                            <span>•</span>
                                                            <span className="text-amber-400 font-semibold">5% M: ৳{moderatorE}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleOpenPayModal(client)}
                                                        className="px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-primary-dim border border-border hover:border-primary-border text-xs font-semibold text-text-muted hover:text-[#f06a7d] transition-all cursor-pointer inline-flex items-center gap-1"
                                                    >
                                                        <DollarSign size={12} />
                                                        <span>Set Balance</span>
                                                    </button>
                                                )}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-5">
                                                {isPaid ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                                        <span>Paid</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border text-amber-400 bg-amber-500/10 border-amber-500/20">
                                                        <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                                                        <span>Unpaid</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Completed Date */}
                                            <td className="py-4 px-5 hidden lg:table-cell text-text-muted">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <Calendar className="w-3.5 h-3.5 text-text-faint shrink-0" />
                                                    <span>{dateFormatted}</span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-5 sm:px-6 text-right">
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
                                                        className="dropdown-content menu bg-surface-2/95 backdrop-blur-xl border border-border/80 rounded-2xl z-50 w-52 p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.85),0_0_20px_-5px_hsl(352_58%_49%_/_0.18)] mt-2 space-y-1 overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

                                                        {/* Mark as Paid / Set Balance */}
                                                        <li>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenPayModal(client)}
                                                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 font-semibold text-xs py-2 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                            >
                                                                <DollarSign size={14} className="text-emerald-400 shrink-0" />
                                                                <span>{isPaid ? "Update Balance / Split" : "Mark as Paid"}</span>
                                                            </button>
                                                        </li>

                                                        <li onClick={() => handleCopy(displayName, "Client Name")}>
                                                            <button
                                                                type="button"
                                                                className="text-text-muted hover:text-white hover:bg-surface font-medium text-xs py-2 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                            >
                                                                <Copy size={14} className="text-text-muted shrink-0" />
                                                                <span>Copy Name</span>
                                                            </button>
                                                        </li>

                                                        {phoneList.length > 0 && (
                                                            <li onClick={() => handleCopy(phoneList[0], "Phone number")}>
                                                                <button
                                                                    type="button"
                                                                    className="text-text-muted hover:text-white hover:bg-surface font-medium text-xs py-2 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                                >
                                                                    <Phone size={14} className="text-[#f06a7d] shrink-0" />
                                                                    <span>Copy Phone</span>
                                                                </button>
                                                            </li>
                                                        )}

                                                        {targetUrl && (
                                                            <li onClick={closeDropdown}>
                                                                <a
                                                                    href={
                                                                        targetUrl.startsWith("http")
                                                                            ? targetUrl
                                                                            : `https://${targetUrl}`
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-[#f06a7d] hover:text-[#f06a7d]/80 hover:bg-primary-dim font-medium text-xs py-2 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                                >
                                                                    <ExternalLink size={14} className="text-[#f06a7d] shrink-0" />
                                                                    <span>Visit Website</span>
                                                                </a>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Set Balance & Mark Paid Modal ── */}
            {typeof document !== "undefined" && createPortal(
                <dialog ref={payModalRef} className="modal">
                    <div
                        className="modal-box relative w-11/12 max-w-lg p-0 overflow-hidden"
                        style={{
                            background: "hsl(222 14% 9%)",
                            border: "1px solid hsl(222 10% 17%)",
                            borderRadius: "20px",
                            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.85), 0 0 40px -8px hsl(352 58% 49% / 0.18)",
                        }}
                    >
                        {/* Top accent glow line */}
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

                        {/* Header */}
                        <div
                            className="flex items-center justify-between px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5"
                            style={{ borderBottom: "1px solid hsl(222 10% 14%)" }}
                        >
                            <div>
                                <div className="inline-flex items-center gap-2 mb-1">
                                    <span className="text-emerald-400 font-bold text-base">৳</span>
                                    <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-white">
                                        Set Client Balance &amp; Mark Paid
                                    </h3>
                                </div>
                                <p className="text-xs text-text-muted">
                                    Record deal amount for <span className="text-[#f06a7d] font-semibold">{activeClient?.name}</span>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleClosePayModal}
                                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer shrink-0"
                                style={{
                                    background: "hsl(222 12% 14%)",
                                    border: "1px solid hsl(222 10% 20%)",
                                    color: "hsl(220 10% 60%)",
                                }}
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSaveBalance} className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="deal-balance"
                                    className="text-xs font-semibold uppercase tracking-wider text-text-muted"
                                >
                                    Total Deal Balance (৳ BDT) <span className="text-[#f06a7d]">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400 font-bold text-sm">
                                        ৳
                                    </span>
                                    <input
                                        id="deal-balance"
                                        type="number"
                                        step="any"
                                        min="1"
                                        required
                                        value={balanceVal}
                                        onChange={(e) => setBalanceVal(e.target.value)}
                                        placeholder="e.g. 25000"
                                        style={{
                                            width: "100%",
                                            padding: "0.65rem 0.85rem 0.65rem 2rem",
                                            background: "hsl(222 12% 11%)",
                                            border: "1px solid hsl(222 10% 18%)",
                                            borderRadius: 10,
                                            color: "hsl(220 20% 90%)",
                                            fontSize: "0.95rem",
                                            outline: "none",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Live Commission Split Cards */}
                            <div className="space-y-2 pt-2">
                                <p className="text-[10px] uppercase tracking-widest font-semibold text-text-muted">
                                    Automated Commission Breakdown
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {/* Pitcher 15% */}
                                    <div className="p-3 rounded-xl bg-surface-2 border border-border text-center space-y-0.5">
                                        <span className="text-[10px] font-semibold text-[#f06a7d] uppercase tracking-wide flex items-center justify-center gap-1">
                                            <Percent size={10} /> Pitcher (15%)
                                        </span>
                                        <p className="font-display text-base font-extrabold text-white">
                                            ৳{pitcher15.toLocaleString()}
                                        </p>
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium inline-block">
                                            Unpaid Payout
                                        </span>
                                    </div>

                                    {/* Moderator 5% */}
                                    <div className="p-3 rounded-xl bg-surface-2 border border-border text-center space-y-0.5">
                                        <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide flex items-center justify-center gap-1">
                                            <Percent size={10} /> Mod (5%)
                                        </span>
                                        <p className="font-display text-base font-extrabold text-white">
                                            ৳{moderator5.toLocaleString()}
                                        </p>
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium inline-block">
                                            Unpaid Payout
                                        </span>
                                    </div>

                                    {/* Agency Net 80% */}
                                    <div className="p-3 rounded-xl bg-surface-2 border border-emerald-500/30 text-center space-y-0.5">
                                        <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide flex items-center justify-center gap-1">
                                            <Building2 size={10} /> Agency (80%)
                                        </span>
                                        <p className="font-display text-base font-extrabold text-emerald-400">
                                            ৳{agency80.toLocaleString()}
                                        </p>
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium inline-block">
                                            Net Profit
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div
                                className="flex items-center justify-end gap-3 pt-4 mt-2"
                                style={{ borderTop: "1px solid hsl(222 10% 14%)" }}
                            >
                                <button
                                    type="button"
                                    onClick={handleClosePayModal}
                                    className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer"
                                    style={{
                                        background: "hsl(222 12% 14%)",
                                        border: "1px solid hsl(222 10% 22%)",
                                        color: "hsl(220 15% 75%)",
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingPay || parsedBalance <= 0}
                                    className="btn-primary px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                                >
                                    {isSavingPay && <Loader2 size={14} className="animate-spin" />}
                                    Save &amp; Mark Paid
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={handleClosePayModal}>close</button>
                    </form>
                </dialog>,
                document.body
            )}
        </div>
    );
};

export default Clients;