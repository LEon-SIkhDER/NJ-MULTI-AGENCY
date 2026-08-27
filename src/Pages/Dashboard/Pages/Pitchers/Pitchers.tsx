import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { Sparkles, Users, TrendingUp, Briefcase, CalendarDays, Mail, Phone, Target, BarChart2, UserCheck, Search } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import useRole from "../../../../Hooks/useRole";

type Pitcher = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  gender?: string;
  maxQualification?: string;
  joinedAt?: string;
  experienceYears?: string;
  specialization?: string;
  bio?: string;
  presentAddress?: string;
  permanentAddress?: string;
  image?: { photoUrl: string; publicId: string };
  cv?: { cvUrl: string; publicId: string };
  NID?: Array<{ NIDUrl?: string; NIDURL?: string; publicId: string }>;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  totalClientsHandled?: number;
  successRate?: number;
  avgClientPerMonth?: number;
  successfullyHandledClient?: number;
  activePitches?: number;
  status: string;
};

import useAuth from "../../../../Hook/useAuth";

const Pitchers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { role } = useRole()
  const { user } = useAuth()

  const handleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    if (timeoutId?.current) {
      clearTimeout(timeoutId?.current);
    }
    timeoutId.current = setTimeout(() => {
      setSearchTerm(search);
    }, 500);
  };

  const { data: pitchers } = useQuery({
    queryKey: ["pitchers", searchTerm, role, user?.uid],
    queryFn: async () => {
      // moderators only see pitchers assigned to them
      const modParam = role === "moderator" && user?.uid ? `&moderatorUid=${user.uid}` : ""
      const { data: result } = await axios.get(
        `http://localhost:5000/pitchers?search=${searchTerm}${modParam}`
      );
      return result;
    },
    enabled: !!role,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dim border border-primary-border text-xs font-semibold text-[#f06a7d] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Elite Pitching Talent</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Agency Pitchers &amp; Specialists
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Top-performing storytellers and pitch strategists dedicated to winning your next venture round or client deal.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Summary pill */}
          {pitchers && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text-muted">
              <Users className="w-3.5 h-3.5 text-[#f06a7d]" />
              <span className="font-semibold text-white">{pitchers.length}</span>&nbsp;Pitchers
            </div>
          )}
          {/* <AddPitchersButton refetch={refetch} className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm py-2.5 px-4 rounded-xl cursor-pointer">
            <Plus size={18} /> Add Pitcher
          </AddPitchersButton> */}
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search pitchers…"
          onChange={handleSearch}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-[#c43448]/60 transition-colors"
        />
      </div>

      {/* ── Card Grid ── */}
      {!pitchers ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface animate-pulse h-64" />
          ))}
        </div>
      ) : pitchers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-text-muted">
          <Users className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {searchTerm ? `No pitchers found for "${searchTerm}".` : "No pitchers added yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {pitchers.map((pitcher: Pitcher) => (
            <PitcherCard key={pitcher._id} pitcher={pitcher} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PitcherCard
   ═══════════════════════════════════════════════════════════════════ */
const PitcherCard = ({ pitcher }: { pitcher: Pitcher }) => {
  const { role } = useRole()
  console.log(role)
  const joinedDate = pitcher.joinedAt ? new Date(pitcher.joinedAt) : null;
  const joinedLabel = joinedDate && !isNaN(joinedDate.getTime()) ? format(joinedDate, "MMM yyyy") : "—";
  const tenureLabel = joinedDate && !isNaN(joinedDate.getTime()) ? formatDistanceToNow(joinedDate, { addSuffix: false }) : "—";

  const avatarFallback = pitcher.name
    ? pitcher.name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
    : "P";

  const rawStatus = (pitcher.status || "active").toLowerCase();
  const isSuspended = rawStatus === "suspend" || rawStatus === "suspended" || rawStatus === "suspaned";
  const isFired = rawStatus === "fired";
  const statusDotColor = isFired ? "bg-red-500" : isSuspended ? "bg-amber-500" : "bg-emerald-500";
  const statusBadgeStyle = isFired
    ? "text-red-400 bg-red-500/10 border-red-500/20"
    : isSuspended
      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  const statusLabel = isFired ? "Fired" : isSuspended ? "Suspended" : "Active";

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-border bg-surface overflow-hidden
                 transition-all duration-300 hover:border-[hsl(352_58%_49%_/_0.4)] hover:shadow-[0_8px_32px_-8px_hsl(352_58%_49%_/_0.18)]"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#c43448]/60 to-transparent" />

      {/* ── Avatar + Name ── */}
      <div className="flex items-start gap-4 p-5 pb-4">
        <div className="relative shrink-0">
          {pitcher.image?.photoUrl ? (
            <img
              src={pitcher.image.photoUrl}
              alt={pitcher.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const fallback = (e.currentTarget.nextElementSibling as HTMLElement);
                if (fallback) fallback.style.display = "flex";
              }}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-border group-hover:ring-[#c43448]/40 transition-all"
            />
          ) : null}
          <div
            className="w-14 h-14 rounded-xl bg-primary-dim border border-primary-border flex items-center justify-center text-lg font-bold text-[#f06a7d]"
            style={{ display: pitcher.image?.photoUrl ? "none" : "flex" }}
          >
            {avatarFallback}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-surface ${statusDotColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <Link to={`/${role}/pitcher/${pitcher._id}`}>
            <h3 className="text-sm font-bold text-white truncate hover:text-[#f06a7d] transition-colors">
              {pitcher.name}
            </h3>
          </Link>
          {/* <p className="text-xs text-[#f06a7d] font-medium truncate mt-0.5">{pitcher.specialization || "—"}</p> */}
          {/* Successfully Handled Clients — replacing rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">
              {pitcher.successfullyHandledClient ?? 0}
            </span>
            <span className="text-[10px] text-text-muted">Handled Clients</span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeStyle}`}>
            {statusLabel}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-text-muted">
            <Briefcase className="w-3 h-3" />
            {pitcher.experienceYears || 0} yr{Number(pitcher.experienceYears) !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Success Rate bar ── */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#f06a7d]" /> Success Rate
          </span>
          <span className="text-xs font-bold text-white">{pitcher.successRate ?? 0}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#c43448] to-[#f06a7d] transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(0, pitcher.successRate ?? 0))}%` }}
          />
        </div>
      </div>

      {/* ── Stat chips ── */}
      <div className="px-5 pb-4 grid grid-cols-3 gap-2">
        <StatChip icon={<UserCheck className="w-3.5 h-3.5" />} label="Clients" value={pitcher.totalClientsHandled ?? 0} />
        <StatChip icon={<BarChart2 className="w-3.5 h-3.5" />} label="Avg/Month" value={pitcher.avgClientPerMonth ?? 0} />
        <StatChip icon={<Target className="w-3.5 h-3.5" />} label="Active" value={pitcher.activePitches ?? 0} />
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 h-px bg-border-soft" />

      {/* ── Footer ── */}
      <div className="px-5 py-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
          <CalendarDays className="w-3 h-3 shrink-0" />
          <span>Joined {joinedLabel}</span>
          <span className="text-[#f06a7d] font-medium">· {tenureLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          {pitcher.email && (
            <a
              href={`mailto:${pitcher.email}`}
              title={pitcher.email}
              className="p-1.5 rounded-lg bg-surface-2 border border-border hover:border-[#c43448]/40 hover:text-[#f06a7d] text-text-muted transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {pitcher.phone && (
            <a
              href={`tel:${pitcher.phone}`}
              title={pitcher.phone}
              className="p-1.5 rounded-lg bg-surface-2 border border-border hover:border-[#c43448]/40 hover:text-[#f06a7d] text-text-muted transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/* Reusable stat chip */
const StatChip = ({ icon, label, value }: { icon: ReactNode; label: string; value: number | string }) => (
  <div className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl bg-surface-2 border border-border">
    <span className="text-[#f06a7d]">{icon}</span>
    <span className="text-xs font-bold text-white leading-none">{value}</span>
    <span className="text-[9px] uppercase tracking-wider text-text-muted leading-none">{label}</span>
  </div>
);

export default Pitchers;