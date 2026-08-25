import React, { useState, useRef } from "react";
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
}

const Clients: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                        Completed Clients
                    </h1>
                    <p className="text-xs sm:text-sm text-text-muted mt-1">
                        View and manage all successfully completed clients and finalized agency contracts.
                    </p>
                </div>

                {/* Counter Badge */}
                <div className="flex items-center gap-3 self-start md:self-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text-muted shadow-sm">
                        <Handshake className="w-4 h-4 text-[#f06a7d]" />
                        <span>Total Completed:</span>
                        <span className="font-bold text-white text-sm">
                            {clients.length}
                        </span>
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
                    /* Loading State Skeleton */
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-16 rounded-xl bg-surface-2 animate-pulse border border-border/50"
                            />
                        ))}
                    </div>
                ) : clients.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-text-muted mb-4 shadow-inner">
                            <Handshake className="w-7 h-7 opacity-40 text-[#f06a7d]" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">
                            No clients found
                        </h3>
                        <p className="text-xs sm:text-sm text-text-muted max-w-sm">
                            {searchTerm
                                ? `No completed clients matched "${searchTerm}".`
                                : "No completed clients are available in the record right now."}
                        </p>
                    </div>
                ) : (
                    /* Responsive Table Wrapper */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/80 bg-surface-2/60 text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                                    <th className="py-4 px-5 sm:px-6">Client</th>
                                    <th className="py-4 px-5">Contact Details</th>
                                    <th className="py-4 px-5 hidden md:table-cell">Web / Source</th>
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5 hidden lg:table-cell">Completed / Date</th>
                                    {/* <th className="py-4 px-5 sm:px-6 text-right">Actions</th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                                {clients.map((client, idx) => {
                                    const clientId = client._id || `client-${idx}`;
                                    const displayName = client.name || "Anonymous Client";
                                    const avatarFallback = displayName
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((w) => w[0])
                                        .join("")
                                        .toUpperCase() || "C";

                                    const clientPhoto =
                                        client.photoUrl ||
                                        (typeof client.image === "string"
                                            ? client.image
                                            : client.image?.photoUrl) ||
                                        "";

                                    const phoneRaw = client.numbers || client.phone || "";
                                    const phoneList = phoneRaw
                                        ? phoneRaw.split(",").map((n) => n.trim()).filter(Boolean)
                                        : [];

                                    const targetUrl = client.url || client.uri;

                                    const dateVal =
                                        client.completedAt || client.createdAt || client.updatedAt;
                                    const clientDate = dateVal ? new Date(dateVal) : null;
                                    const dateFormatted =
                                        clientDate && !isNaN(clientDate.getTime())
                                            ? format(clientDate, "MMM dd, yyyy")
                                            : "—";

                                    return (
                                        <tr
                                            key={clientId}
                                            className="hover:bg-surface-2/50 transition-colors group"
                                        >
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
                                                        {client.company && (
                                                            <p className="text-[11px] text-text-faint truncate">
                                                                {client.company}
                                                            </p>
                                                        )}
                                                        {client.notice && (
                                                            <div className="flex items-center gap-1 text-[10px] text-text-muted/80 truncate max-w-[200px] sm:max-w-[260px] mt-0.5">
                                                                <AlignLeft className="w-3 h-3 text-text-faint shrink-0" />
                                                                <span className="truncate">{client.notice}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Details (Phone & Email) */}
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

                                            {/* Web Link / Target URL */}
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

                                            {/* Status Badge (Fixed: Completed) */}
                                            <td className="py-4 px-5">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span>Completed</span>
                                                </span>
                                            </td>

                                            {/* Completed / Created Date */}
                                            <td className="py-4 px-5 hidden lg:table-cell text-text-muted">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <Calendar className="w-3.5 h-3.5 text-text-faint shrink-0" />
                                                    <span>{dateFormatted}</span>
                                                </div>
                                            </td>

                                            {/* Actions (3-Dot Dropdown) */}
                                            {/* <td className="py-4 px-5 sm:px-6 text-right">
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
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

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
                                            </td> */}
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

export default Clients;