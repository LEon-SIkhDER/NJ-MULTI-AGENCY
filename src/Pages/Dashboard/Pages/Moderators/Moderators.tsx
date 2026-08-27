import type { ReactNode } from "react";
import { useRef, useState } from "react";
import {
  Sparkles,
  Users,
  Mail,
  Phone,
  CalendarDays,
  Briefcase,
  ShieldCheck,
  Search,
  UserCheck,
  ClipboardList,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

type Moderator = {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  gender?: string;
  maxQualification?: string;
  joinedAt?: string;
  experienceYears?: string;
  specialization?: string;
  bio?: string;
  presentAddress?: string;
  permanentAddress?: string;
  image?: { photoUrl: string; publicId: string };
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  status: string;
  uid?: string;
  totalAssignedTasks?: number;
  lastAssignedAt?: string;
};

const Moderators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    if (timeoutId?.current) {
      clearTimeout(timeoutId?.current);
    }
    timeoutId.current = setTimeout(() => {
      setSearchTerm(search);
    }, 500);
  };

  const { data: moderators } = useQuery({
    queryKey: ["moderators", searchTerm],
    queryFn: async () => {
      const { data: result } = await axios.get(
        `https://nj-multi-agency-api.vercel.app/moderators?search=${searchTerm}`
      );
      return result;
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dim border border-primary-border text-xs font-semibold text-[#f06a7d] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Guardians</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Agency Moderators
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Trusted moderators managing operations, overseeing quality, and
            keeping the agency running smoothly.
          </p>
        </div>

        {/* Summary pill */}
        {moderators && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text-muted self-start sm:self-auto">
            <Users className="w-3.5 h-3.5 text-[#f06a7d]" />
            <span className="font-semibold text-white">{moderators.length}</span>
            Moderators
          </div>
        )}
      </div>

      {/* ── Search Bar ── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search moderators…"
          onChange={handleSearch}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-[#c43448]/60 transition-colors"
        />
      </div>

      {/* ── Card Grid ── */}
      {!moderators ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface animate-pulse h-56"
            />
          ))}
        </div>
      ) : moderators.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-text-muted">
          <Users className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {searchTerm
              ? `No moderators found for "${searchTerm}".`
              : "No moderators added yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {moderators.map((moderator: Moderator) => (
            <ModeratorCard key={moderator._id} moderator={moderator} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ModeratorCard
   ═══════════════════════════════════════════════════════════════════ */
const ModeratorCard = ({ moderator }: { moderator: Moderator }) => {
  const joinedDate = moderator.joinedAt ? new Date(moderator.joinedAt) : null;
  const joinedLabel =
    joinedDate && !isNaN(joinedDate.getTime())
      ? format(joinedDate, "MMM yyyy")
      : "—";
  const tenureLabel =
    joinedDate && !isNaN(joinedDate.getTime())
      ? formatDistanceToNow(joinedDate, { addSuffix: false })
      : "—";

  const avatarFallback = moderator.name
    ? moderator.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "M";

  const rawStatus = (moderator.status || "active").toLowerCase();
  const isSuspended =
    rawStatus === "suspend" ||
    rawStatus === "suspended" ||
    rawStatus === "suspaned";
  const isFired = rawStatus === "fired";
  const statusDotColor = isFired
    ? "bg-red-500"
    : isSuspended
    ? "bg-amber-500"
    : "bg-emerald-500";
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
          {moderator.image?.photoUrl ? (
            <img
              src={moderator.image.photoUrl}
              alt={moderator.name}
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
            style={{ display: moderator.image?.photoUrl ? "none" : "flex" }}
          >
            {avatarFallback}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-surface ${statusDotColor}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <Link to={`/admin/moderator/${moderator._id}`}>
            <h3 className="text-sm font-bold text-white truncate hover:text-[#f06a7d] transition-colors">
              {moderator.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 mt-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f06a7d]" />
            <span className="text-xs font-semibold text-[#f06a7d]">
              {moderator.role || "Moderator"}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeStyle}`}
          >
            {statusLabel}
          </span>
          {moderator.experienceYears && (
            <span className="flex items-center gap-1 text-[10px] text-text-muted">
              <Briefcase className="w-3 h-3" />
              {moderator.experienceYears} yr
              {Number(moderator.experienceYears) !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* ── Info chips ── */}
      <div className="px-5 pb-4 grid grid-cols-3 gap-2">
        <InfoChip
          icon={<UserCheck className="w-3.5 h-3.5" />}
          label="Gender"
          value={
            moderator.gender
              ? moderator.gender.charAt(0).toUpperCase() +
                moderator.gender.slice(1)
              : "—"
          }
        />
        <InfoChip
          icon={<ShieldCheck className="w-3.5 h-3.5" />}
          label="Qualification"
          value={moderator.maxQualification || "—"}
        />
        <InfoChip
          icon={<ClipboardList className="w-3.5 h-3.5" />}
          label="Tasks"
          value={moderator.totalAssignedTasks ?? 0}
        />
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
          {moderator.email && (
            <a
              href={`mailto:${moderator.email}`}
              title={moderator.email}
              className="p-1.5 rounded-lg bg-surface-2 border border-border hover:border-[#c43448]/40 hover:text-[#f06a7d] text-text-muted transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {moderator.phone && (
            <a
              href={`tel:${moderator.phone}`}
              title={moderator.phone}
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

/* Reusable info chip */
const InfoChip = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl bg-surface-2 border border-border">
    <span className="text-[#f06a7d]">{icon}</span>
    <span className="text-xs font-bold text-white leading-none truncate max-w-full px-1 text-center">
      {value}
    </span>
    <span className="text-[9px] uppercase tracking-wider text-text-muted leading-none">
      {label}
    </span>
  </div>
);

export default Moderators;