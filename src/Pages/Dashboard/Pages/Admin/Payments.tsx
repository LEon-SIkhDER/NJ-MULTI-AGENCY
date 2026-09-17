import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Sparkles,
    Search,
    X,
    CreditCard,
    Users,
    BadgeCheck,
    Mic,
    CheckCircle2,
    Clock,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Filter,
    ArrowUpDown,
    Eye,
    Receipt,
} from "lucide-react";
import toast from "react-hot-toast";
import { showCustomSwal } from "../../../../utils/swal";

type DealItem = {
    _id: string;
    clientName: string;
    balance: number;
    earning: number;
    paidStatus: string;
    paidAt?: string | number | Date;
};

type EmployeePayment = {
    _id: string;
    uid: string;
    name: string;
    email: string;
    phone?: string;
    role: "pitcher" | "moderator";
    image?: { photoUrl: string; publicId: string };
    status?: string;
    totalEarned: number;
    paidBalance: number;
    unpaidBalance: number;
    paidDealsCount: number;
    unpaidDealsCount: number;
    deals: DealItem[];
};

type PaymentsResponse = {
    employees: EmployeePayment[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

const Payments: React.FC = () => {
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Deals view modal
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeePayment | null>(null);
    const dealsModalRef = useRef<HTMLDialogElement | null>(null);

    const handleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        if (timeoutId.current) clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
            setSearchTerm(val);
            setPage(1);
        }, 450);
    };

    const { data, isLoading, refetch } = useQuery<PaymentsResponse>({
        queryKey: ["admin-payments", roleFilter, statusFilter, searchTerm, page],
        queryFn: async () => {
            const res = await axios.get(
                `http://localhost:5000/admin/payments?role=${roleFilter}&paymentStatus=${statusFilter}&search=${searchTerm}&page=${page}&limit=20`
            );
            return res.data;
        },
    });

    const employees = data?.employees || [];
    const pagination = data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 };

    // Overview Stats
    const { data: statsData } = useQuery({
        queryKey: ["admin-overview-stats"],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:5000/admin/overview-stats`);
            return data;
        },
    });

    const financials = statsData?.financials || {
        totalRevenue: 0,
        totalPitcherPayouts: 0,
        totalModeratorPayouts: 0,
        totalUnpaidPayouts: 0,
    };

    // ── Pay / Clear Unpaid Balance ──
    const handlePayEmployee = async (emp: EmployeePayment) => {
        if (emp.unpaidBalance <= 0) {
            toast.error("No unpaid balance for this employee");
            return;
        }

        const confirm = await showCustomSwal({
            title: `Pay ৳${emp.unpaidBalance.toLocaleString()}?`,
            des: `Mark all unpaid commission earnings for ${emp.name} (${emp.role === "pitcher" ? "Pitcher 15%" : "Moderator 5%"}) as Paid?`,
            confirmButtonText: "Confirm Payout",
            icon: "success",
        });
        if (!confirm) return;

        const toastId = toast.loading(`Processing payout for ${emp.name}...`);
        try {
            const { data: result } = await axios.patch(`http://localhost:5000/admin/pay-employee`, {
                employeeUid: emp.uid,
                role: emp.role,
            });
            if (!result.modifiedCount && !result.matchedCount) {
                throw new Error("Payout update failed");
            }
            await refetch();
            toast.dismiss(toastId);
            toast.success(`Payout of ৳${emp.unpaidBalance.toLocaleString()} marked as Paid!`);
        } catch (error) {
            const err = error as { message?: string };
            toast.dismiss(toastId);
            toast.error(err.message || "Failed to process payout");
        }
    };

    const openDealsModal = (emp: EmployeePayment) => {
        setSelectedEmployee(emp);
        dealsModalRef.current?.showModal();
    };

    const avatarFallback = (name: string) =>
        name
            ? name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
            : "E";

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dim border border-primary-border text-xs font-semibold text-[#f06a7d] mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Agency Treasury &amp; Payouts</span>
                    </div>
                    <h1 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-white">
                        Employee Payments &amp; Commissions
                    </h1>
                    <p className="text-xs sm:text-sm text-text-muted mt-1">
                        Settle commission earnings for Pitchers (15%) and Moderators (5%) with real-time payout tracking.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-stretch md:self-auto">
                    <div className="w-full md:w-auto px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 shadow-sm flex items-center gap-2">
                        <Clock size={14} className="text-amber-400" />
                        <span>Pending:</span>
                        <span className="font-bold text-white text-sm">
                            ৳{financials.totalUnpaidPayouts?.toLocaleString() ?? 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Summary Financial Metrics Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <span className="text-[#f06a7d] font-bold text-xs">৳</span> Total Invoiced
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-white">
                        ৳{financials.totalRevenue?.toLocaleString() ?? 0}
                    </p>
                    <span className="text-[10px] text-text-muted block">Closed client contracts</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <Mic size={13} className="text-[#f06a7d]" /> Pitcher Share (15%)
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-[#f06a7d]">
                        ৳{financials.totalPitcherPayouts?.toLocaleString() ?? 0}
                    </p>
                    <span className="text-[10px] text-amber-300/80 block">
                        Unpaid: ৳{financials.unpaidPitcherPayouts?.toLocaleString() ?? 0}
                    </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <BadgeCheck size={13} className="text-amber-400" /> Mod Share (5%)
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-amber-400">
                        ৳{financials.totalModeratorPayouts?.toLocaleString() ?? 0}
                    </p>
                    <span className="text-[10px] text-amber-300/80 block">
                        Unpaid: ৳{financials.unpaidModeratorPayouts?.toLocaleString() ?? 0}
                    </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-text-muted flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400" /> Agency Net (80%)
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-emerald-400">
                        ৳{financials.totalAgencyProfit?.toLocaleString() ?? 0}
                    </p>
                    <span className="text-[10px] text-text-muted block">Retained agency capital</span>
                </div>
            </div>

            {/* ── Filters & Search Controls ── */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
                {/* Search (Scoped to selected role) */}
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                        type="text"
                        placeholder={`Search ${
                            roleFilter === "moderator"
                                ? "moderators"
                                : roleFilter === "pitcher"
                                ? "pitchers"
                                : "all employees"
                        } by name, email, phone…`}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-[#c43448]/60 transition-colors shadow-sm"
                    />
                </div>

                {/* Filter Dropdowns */}
                <div className="grid grid-cols-1 min-[430px]:grid-cols-2 lg:flex lg:items-center gap-2 w-full md:w-auto">
                    {/* Role Filter Dropdown */}
                    <div className="relative flex items-center min-w-0">
                        <Users size={13} className="text-[#f06a7d] absolute left-3 pointer-events-none z-10" />
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setPage(1);
                            }}
                            className="select select-sm pl-8 pr-8 bg-surface border border-border text-white text-xs rounded-xl focus:outline-none focus:border-primary font-semibold cursor-pointer w-full"
                        >
                            <option value="all" className="bg-surface text-white">Role: All Employees</option>
                            <option value="pitcher" className="bg-surface text-white">Role: Pitchers</option>
                            <option value="moderator" className="bg-surface text-white">Role: Moderators</option>
                        </select>
                    </div>

                    {/* Payment Status Filter Dropdown */}
                    <div className="relative flex items-center min-w-0">
                        <Filter size={13} className="text-amber-400 absolute left-3 pointer-events-none z-10" />
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="select select-sm pl-8 pr-8 bg-surface border border-border text-white text-xs rounded-xl focus:outline-none focus:border-primary font-semibold cursor-pointer w-full"
                        >
                            <option value="all" className="bg-surface text-white">Status: All Payouts</option>
                            <option value="unpaid" className="bg-surface text-white">Status: Unpaid Only</option>
                            <option value="paid" className="bg-surface text-white">Status: Settled / Paid</option>
                        </select>
                    </div>

                    {/* Priority info pill */}
                    <div className="hidden lg:inline-flex items-center gap-1 text-[11px] text-text-muted px-2.5 py-1.5 bg-surface-2/60 rounded-xl border border-border/60">
                        <ArrowUpDown size={11} className="text-amber-400" />
                        <span>Unpaid Priority Top</span>
                    </div>
                </div>
            </div>

            {/* ── Employees Payment Table ── */}
            <div className="relative rounded-2xl border border-border bg-surface shadow-2xl backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent pointer-events-none" />

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                        <Loader2 size={28} className="animate-spin text-[#f06a7d]" />
                        <p className="text-sm font-medium text-text-muted">Loading employee payout balances…</p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-text-muted shadow-inner">
                            <CreditCard className="w-7 h-7 opacity-40 text-[#f06a7d]" />
                        </div>
                        <h3 className="text-base font-bold text-white">No employees found</h3>
                        <p className="text-xs sm:text-sm text-text-muted max-w-sm">
                            {searchTerm
                                ? `No employees matching "${searchTerm}".`
                                : "No payout records matching the current filters."}
                        </p>
                    </div>
                ) : (
                    <>
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/80 bg-surface-2/60 text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                                    <th className="py-4 px-5 sm:px-6">Employee</th>
                                    <th className="py-4 px-5">Role &amp; Commission</th>
                                    <th className="py-4 px-5">Total Earned</th>
                                    <th className="py-4 px-5">Paid Balance</th>
                                    <th className="py-4 px-5">Unpaid Balance</th>
                                    <th className="py-4 px-5 hidden md:table-cell">Closed Deals</th>
                                    <th className="py-4 px-5 sm:px-6 text-right">Payout Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                                {employees.map((emp) => {
                                    const hasUnpaid = emp.unpaidBalance > 0;
                                    const roleLabel = emp.role === "pitcher" ? "Pitcher (15%)" : "Moderator (5%)";
                                    const roleBadgeStyle =
                                        emp.role === "pitcher"
                                            ? "text-[#f06a7d] bg-[#f06a7d]/10 border-[#f06a7d]/20"
                                            : "text-amber-400 bg-amber-500/10 border-amber-500/20";

                                    return (
                                        <tr
                                            key={emp.uid}
                                            className={`hover:bg-surface-2/50 transition-colors ${
                                                hasUnpaid ? "bg-amber-500/[0.02]" : ""
                                            }`}
                                        >
                                            {/* Employee Name + Photo */}
                                            <td className="py-4 px-5 sm:px-6">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="relative shrink-0">
                                                        {emp.image?.photoUrl ? (
                                                            <img
                                                                src={emp.image.photoUrl}
                                                                alt={emp.name}
                                                                className="w-10 h-10 rounded-xl object-cover ring-1 ring-border shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center font-bold text-xs text-[#f06a7d] shadow-sm">
                                                                {avatarFallback(emp.name)}
                                                            </div>
                                                        )}
                                                        <span
                                                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-surface ${
                                                                hasUnpaid ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                                                            }`}
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-white truncate">
                                                            {emp.name}
                                                        </p>
                                                        <p className="text-[11px] text-text-muted truncate">
                                                            {emp.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="py-4 px-5">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleBadgeStyle}`}
                                                >
                                                    {emp.role === "pitcher" ? <Mic size={10} /> : <BadgeCheck size={10} />}
                                                    <span>{roleLabel}</span>
                                                </span>
                                            </td>

                                            {/* Total Earned */}
                                            <td className="py-4 px-5">
                                                <span className="font-display font-bold text-white">
                                                    ৳{emp.totalEarned.toLocaleString()}
                                                </span>
                                            </td>

                                            {/* Paid Balance */}
                                            <td className="py-4 px-5">
                                                <span className="font-semibold text-emerald-400">
                                                    ৳{emp.paidBalance.toLocaleString()}
                                                </span>
                                            </td>

                                            {/* Unpaid Balance */}
                                            <td className="py-4 px-5">
                                                {hasUnpaid ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                                                        <Clock size={12} />
                                                        <span>৳{emp.unpaidBalance.toLocaleString()}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-text-muted text-xs font-medium">
                                                        ৳0 (Settled)
                                                    </span>
                                                )}
                                            </td>

                                            {/* Closed Deals */}
                                            <td className="py-4 px-5 hidden md:table-cell">
                                                <button
                                                    onClick={() => openDealsModal(emp)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs text-text-muted hover:text-white transition-colors cursor-pointer"
                                                >
                                                    <Eye size={12} />
                                                    <span>{emp.paidDealsCount} deal{emp.paidDealsCount !== 1 ? "s" : ""}</span>
                                                </button>
                                            </td>

                                            {/* Payout Actions */}
                                            <td className="py-4 px-5 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {hasUnpaid ? (
                                                        <button
                                                            onClick={() => handlePayEmployee(emp)}
                                                            className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
                                                        >
                                                            <span className="font-bold text-xs">৳</span>
                                                            <span>Pay ৳{emp.unpaidBalance.toLocaleString()}</span>
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                            <CheckCircle2 size={12} />
                                                            <span>Fully Paid</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="lg:hidden divide-y divide-border/60">
                        {employees.map((emp) => {
                            const hasUnpaid = emp.unpaidBalance > 0;
                            const roleLabel = emp.role === "pitcher" ? "Pitcher (15%)" : "Moderator (5%)";
                            const roleBadgeStyle =
                                emp.role === "pitcher"
                                    ? "text-[#f06a7d] bg-[#f06a7d]/10 border-[#f06a7d]/20"
                                    : "text-amber-400 bg-amber-500/10 border-amber-500/20";

                            return (
                                <div
                                    key={emp.uid}
                                    className={`p-3.5 sm:p-5 space-y-4 ${hasUnpaid ? "bg-amber-500/[0.02]" : ""}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                            <div className="relative shrink-0">
                                                {emp.image?.photoUrl ? (
                                                    <img
                                                        src={emp.image.photoUrl}
                                                        alt={emp.name}
                                                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-border shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center font-bold text-xs text-[#f06a7d] shadow-sm">
                                                        {avatarFallback(emp.name)}
                                                    </div>
                                                )}
                                                <span
                                                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-surface ${
                                                        hasUnpaid ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                                                    }`}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-white truncate">
                                                    {emp.name}
                                                </p>
                                                <p className="text-[11px] text-text-muted truncate">
                                                    {emp.email}
                                                </p>
                                                {emp.phone && (
                                                    <p className="text-[11px] text-text-muted truncate">
                                                        {emp.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <span
                                            className={`inline-flex shrink-0 items-center gap-1 px-2 py-0.5 rounded-full text-[9px] min-[380px]:text-[10px] font-bold uppercase tracking-wider border ${roleBadgeStyle}`}
                                        >
                                            {emp.role === "pitcher" ? <Mic size={10} /> : <BadgeCheck size={10} />}
                                            <span>{roleLabel}</span>
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="rounded-xl bg-surface-2/60 border border-border/60 p-3 min-w-0">
                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-text-muted mb-1">
                                                Total
                                            </p>
                                            <p className="font-display font-bold text-white text-sm break-words">
                                                ৳{emp.totalEarned.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-surface-2/60 border border-border/60 p-3 min-w-0">
                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-text-muted mb-1">
                                                Paid
                                            </p>
                                            <p className="font-semibold text-emerald-400 text-sm break-words">
                                                ৳{emp.paidBalance.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-surface-2/60 border border-border/60 p-3 min-w-0">
                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-text-muted mb-1">
                                                Unpaid
                                            </p>
                                            {hasUnpaid ? (
                                                <p className="font-bold text-amber-300 text-sm break-words">
                                                    ৳{emp.unpaidBalance.toLocaleString()}
                                                </p>
                                            ) : (
                                                <p className="font-semibold text-text-muted text-sm">৳0</p>
                                            )}
                                        </div>
                                        <div className="rounded-xl bg-surface-2/60 border border-border/60 p-3 min-w-0">
                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-text-muted mb-1">
                                                Deals
                                            </p>
                                            <button
                                                onClick={() => openDealsModal(emp)}
                                                className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-white transition-colors cursor-pointer"
                                            >
                                                <Eye size={12} />
                                                <span>{emp.paidDealsCount} deal{emp.paidDealsCount !== 1 ? "s" : ""}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        {hasUnpaid ? (
                                            <button
                                                onClick={() => handlePayEmployee(emp)}
                                                className="btn-primary w-full min-[420px]:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
                                            >
                                                <span className="font-bold text-xs">৳</span>
                                                <span>Pay ৳{emp.unpaidBalance.toLocaleString()}</span>
                                            </button>
                                        ) : (
                                            <span className="w-full min-[420px]:w-auto justify-center inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 px-2 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                <CheckCircle2 size={12} />
                                                <span>Fully Paid</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    </>
                )}

                {/* ── Pagination Bar (shows after 20 employees or when multiple pages) ── */}
                {pagination.totalPages > 1 && (
                    <div className="flex flex-col min-[460px]:flex-row min-[460px]:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-border/80 bg-surface-2/40 text-xs text-text-muted">
                        <div className="text-center min-[460px]:text-left">
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                            <span className="font-bold text-white">{pagination.total}</span> employees
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <span className="font-semibold text-white px-1 min-[380px]:px-2">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                className="p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Employee Deals Breakdown Modal ── */}
            {typeof document !== "undefined" && createPortal(
                <dialog ref={dealsModalRef} className="modal">
                    <div
                        className="modal-box relative w-[calc(100vw-1rem)] sm:w-11/12 max-w-2xl p-0 overflow-hidden"
                        style={{
                            background: "hsl(222 14% 9%)",
                            border: "1px solid hsl(222 10% 17%)",
                            borderRadius: "20px",
                            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.85), 0 0 40px -8px hsl(352 58% 49% / 0.18)",
                        }}
                    >
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
                            className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5"
                            style={{ borderBottom: "1px solid hsl(222 10% 14%)" }}
                        >
                            <div className="min-w-0">
                                <div className="inline-flex items-center gap-2 mb-1">
                                    <Receipt size={16} style={{ color: "#f06a7d" }} />
                                    <h3 className="font-display text-sm min-[380px]:text-base sm:text-lg font-bold tracking-tight text-white">
                                        Commission Breakdown — {selectedEmployee?.name}
                                    </h3>
                                </div>
                                <p className="text-xs text-text-muted">
                                    {selectedEmployee?.role === "pitcher" ? "Pitcher 15%" : "Moderator 5%"} deal shares
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => dealsModalRef.current?.close()}
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

                        {/* Deals List */}
                        <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-3" style={{ maxHeight: "65vh" }}>
                            {!selectedEmployee?.deals || selectedEmployee.deals.length === 0 ? (
                                <div className="py-12 text-center text-text-muted text-xs">
                                    No closed client deals on record for this employee yet.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {selectedEmployee.deals.map((deal, idx) => {
                                        const isPaid = deal.paidStatus === "paid";
                                        return (
                                            <div
                                                key={deal._id || idx}
                                                className="flex flex-col min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between gap-3 p-3.5 rounded-xl bg-surface-2 border border-border"
                                            >
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-white text-xs break-words">{deal.clientName}</p>
                                                    <p className="text-[11px] text-text-muted">
                                                        Contract Balance: ৳{Number(deal.balance).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="min-[420px]:text-right">
                                                    <p className="font-display font-bold text-white text-sm">
                                                        +৳{Number(deal.earning).toLocaleString()}
                                                    </p>
                                                    <span
                                                        className={`inline-block text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                                                            isPaid
                                                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                                                : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                                        }`}
                                                    >
                                                        {isPaid ? "Paid" : "Unpaid Payout"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => dealsModalRef.current?.close()}>close</button>
                    </form>
                </dialog>,
                document.body
            )}
        </div>
    );
};

export default Payments;
