import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "../../../../Hooks/useAxiosSecure";
import {
    MoreVertical,
    Trash2,
    ShieldAlert,
    Search,
    Users as UsersIcon,
    Mail,
    Sparkles,
    Shield,
    Calendar,
    X,
    Mic,
    BadgeCheck,
} from "lucide-react";
import { format } from "date-fns";
import Approve from "./Approve";

export interface UserItem {
    _id?: string;
    name?: string;
    email?: string;
    uid?: string;
    role?: string;
    status?: string;
    result?: string;
    photoUrl?: string;
    photoURL?: string;
    createdAt?: string | number | Date;
}

const Users: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

    const { data: users = [], isLoading, refetch } = useQuery<UserItem[]>({
        queryKey: ["users", searchTerm],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/users?search=${searchTerm}`);
            return Array.isArray(data) ? data : [];
        },
    });
    

    // Only keep standard users with role 'user' (or unassigned/default)
    // const users = allUsers.filter((u) => {
    //     const role = u.role?.toLowerCase().trim();
    //     return !role || role === "user";
    // });

    const closeDropdown = () => {
        const elem = document.activeElement as HTMLElement;
        elem?.blur();
    };
    // search 
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const handleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const search = e.currentTarget.value
        if (timeoutId?.current) {
            clearTimeout(timeoutId?.current)
        }
        setTimeout(() => {
            setSearchTerm(search)
        }, 500);

    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dim border border-primary-border text-xs font-semibold text-[#f06a7d] mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Community Directory</span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        User Management
                    </h1>
                    <p className="text-xs sm:text-sm text-text-muted mt-1">
                        Manage, verify, and view all registered users and clients on the platform.
                    </p>
                </div>

                {/* Counter Badge */}
                <div className="flex items-center gap-3 self-start md:self-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text-muted shadow-sm">
                        <UsersIcon className="w-4 h-4 text-[#f06a7d]" />
                        <span>Total Standard Users:</span>
                        <span className="font-bold text-white text-sm">
                            {users.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Search & Filter Controls ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search Input Bar */}
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by name or email"
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

            {/* ── Users Table Container ── */}
            <div className="relative rounded-2xl border border-border bg-surface shadow-2xl backdrop-blur-xl ">
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
                ) : users.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-text-muted mb-4 shadow-inner">
                            <UsersIcon className="w-7 h-7 opacity-40 text-[#f06a7d]" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">
                            No users found
                        </h3>
                        <p className="text-xs sm:text-sm text-text-muted max-w-sm">
                            No registered standard users are available at this moment.
                        </p>
                    </div>
                ) : (
                    /* Responsive Table Wrapper */
                    <div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/80 bg-surface-2/60 text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                                    <th className="py-4 px-5 sm:px-6">User</th>
                                    <th className="py-4 px-5">Contact / Email</th>
                                    <th className="py-4 px-5 hidden md:table-cell">Role</th>
                                    <th className="py-4 px-5 hidden sm:table-cell">Status</th>
                                    <th className="py-4 px-5 hidden lg:table-cell">Joined Date</th>
                                    <th className="py-4 px-5 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                                {users.map((userItem, idx) => {
                                    const avatarUrl =
                                        userItem.photoUrl ||
                                        userItem.photoURL ||
                                        userItem.result ||
                                        "";
                                    const displayName = userItem.name || "Anonymous User";
                                    const avatarFallback = displayName
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((w) => w[0])
                                        .join("")
                                        .toUpperCase() || "U";

                                    const joinedDate = userItem.createdAt
                                        ? new Date(userItem.createdAt)
                                        : null;
                                    const joinedFormatted =
                                        joinedDate && !isNaN(joinedDate.getTime())
                                            ? format(joinedDate, "MMM dd, yyyy")
                                            : "—";

                                    const rawStatus = (userItem.status || "active").toLowerCase();
                                    const isBlocked =
                                        rawStatus === "blocked" ||
                                        rawStatus === "block" ||
                                        rawStatus === "suspend" ||
                                        rawStatus === "suspended";

                                    return (
                                        <tr
                                            key={userItem._id || userItem.uid || idx}
                                            className="hover:bg-surface-2/50 transition-colors group"
                                        >
                                            {/* User Column (Avatar + Name) */}
                                            <td className="py-4 px-5 sm:px-6">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="relative shrink-0">
                                                        {avatarUrl && !brokenImages[userItem._id || userItem.uid || idx] ? (
                                                            <img
                                                                src={avatarUrl}
                                                                alt={displayName}
                                                                referrerPolicy="no-referrer"
                                                                className="w-10 h-10 rounded-xl object-cover ring-1 ring-border group-hover:ring-[#c43448]/40 transition-all shadow-sm"
                                                                onError={() => {
                                                                    setBrokenImages((prev) => ({
                                                                        ...prev,
                                                                        [userItem._id || userItem.uid || idx]: true,
                                                                    }));
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center font-bold text-xs text-[#f06a7d] shadow-sm">
                                                                {avatarFallback}
                                                            </div>
                                                        )}
                                                        <span
                                                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-surface ${isBlocked ? "bg-amber-500" : "bg-emerald-500"
                                                                }`}
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-white truncate group-hover:text-[#f06a7d] transition-colors">
                                                            {displayName}
                                                        </p>
                                                        {userItem.uid && (
                                                            <p className="text-[10px] font-mono text-text-faint truncate max-w-[120px] sm:max-w-[160px]">
                                                                {userItem.uid}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact / Email Column */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-2 text-text-muted">
                                                    <Mail className="w-3.5 h-3.5 text-[#f06a7d] shrink-0" />
                                                    <span className="truncate max-w-[180px] sm:max-w-[240px]">
                                                        {userItem.email || "No email"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Role Column */}
                                            <td className="py-4 px-5 hidden md:table-cell">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-surface-2 border border-border text-text-muted">
                                                    <Shield className="w-3 h-3 text-[#f06a7d]" />
                                                    {userItem.role || "User"}
                                                </span>
                                            </td>

                                            {/* Status Column */}
                                            <td className="py-4 px-5 hidden sm:table-cell">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${isBlocked
                                                        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                                        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-amber-500" : "bg-emerald-500"
                                                            }`}
                                                    />
                                                    {isBlocked ? "Blocked" : "Active"}
                                                </span>
                                            </td>

                                            {/* Joined Date Column */}
                                            <td className="py-4 px-5 hidden lg:table-cell text-text-muted">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <Calendar className="w-3.5 h-3.5 text-text-faint shrink-0" />
                                                    <span>{joinedFormatted}</span>
                                                </div>
                                            </td>

                                            {/* 3-Dot DaisyUI Action Dropdown */}
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
                                                        {/* Top red accent glow line */}
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

                                                        {/* Approve as Pitcher Action */}
                                                        <li>
                                                            <Approve
                                                                approveRole="pitcher"
                                                                // type="button"
                                                                user={userItem}
                                                                refetch={refetch}
                                                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                            >
                                                                <Mic size={14} className="text-emerald-400 shrink-0" />
                                                                <span>Approve as Pitcher</span>
                                                            </Approve>
                                                        </li>
                                                        <li>
                                                            <Approve
                                                                approveRole="moderator"
                                                                // type="button"
                                                                user={userItem}
                                                                refetch={refetch}
                                                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                            >
                                                                <BadgeCheck size={14} className="text-emerald-400 shrink-0" />
                                                                <span>Approve as Moderator</span>
                                                            </Approve>
                                                        </li>

                                                        {/* Block User Action */}
                                                        <li onClick={closeDropdown} >
                                                            <button
                                                                // type="button"
                                                                // refetch={refetch}
                                                                className="text-amber-400 opacity-50 hover:text-amber-300 hover:bg-amber-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                            >
                                                                <ShieldAlert size={14} className="text-amber-400 shrink-0" />
                                                                <span>Block User</span>
                                                            </button>
                                                        </li>

                                                        {/* Delete User Action */}
                                                        <li onClick={closeDropdown}>
                                                            <button
                                                                type="button"
                                                                className="text-red-400 opacity-50 hover:text-red-300 hover:bg-red-500/10 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center gap-2.5 w-full text-left transition-all cursor-pointer"
                                                            >
                                                                <Trash2 size={14} className="text-red-400 shrink-0" />
                                                                <span>Delete User</span>
                                                            </button>
                                                        </li>
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
        </div>
    );
};

export default Users;