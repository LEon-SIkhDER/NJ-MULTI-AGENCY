import React from "react";
import { Link } from "react-router";
import {
  TrendingUp,
  Users,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import useAuth from "../../../Hook/useAuth";
import UpdateSoon from "../../../Component/UpdateSoon";

const stats = [
  {
    label: "Active Projects",
    value: "12",
    change: "+28% this month",
    positive: true,
    icon: Briefcase,
    color: "from-rose-500/20 to-rose-500/5",
    border: "border-rose-500/30",
  },
  {
    label: "Pitchers & Talent",
    value: "24",
    change: "+4 onboarded",
    positive: true,
    icon: Users,
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/30",
  },
  {
    label: "Pitch Success Rate",
    value: "94.2%",
    change: "+3.4% vs last qtr",
    positive: true,
    icon: TrendingUp,
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/30",
  },
  {
    label: "Avg. Turnaround",
    value: "48 hrs",
    change: "Superfast delivery",
    positive: true,
    icon: Clock,
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/30",
  },
];

const recentPitches = [
  {
    id: "P-104",
    client: "Apex Fintech Group",
    service: "Brand Identity & Pitch Deck",
    pitcher: "Alex Rivera",
    date: "May 24, 2026",
    status: "Delivered",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amount: "$4,500",
  },
  {
    id: "P-103",
    client: "Nexus AI Labs",
    service: "Full-Stack Web App & Pitch",
    pitcher: "Sophia Chen",
    date: "May 22, 2026",
    status: "In Review",
    statusColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    amount: "$8,200",
  },
  {
    id: "P-102",
    client: "Vanguard Mobility",
    service: "Growth Marketing Strategy",
    pitcher: "Marcus Vance",
    date: "May 19, 2026",
    status: "Pitching",
    statusColor: "bg-[#c43448]/10 text-[#f06a7d] border-[#c43448]/30",
    amount: "$3,800",
  },
  {
    id: "P-101",
    client: "Quantum Health",
    service: "UI/UX Redesign & Pitching",
    pitcher: "Elena Rostova",
    date: "May 15, 2026",
    status: "Delivered",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amount: "$6,100",
  },
];

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  return (
    // <div className="space-y-8 animate-in fade-in duration-300">
    //   {/* Top Welcome Hero Banner */}
    //   <div className="relative overflow-hidden rounded-2xl border border-(--border) bg-gradient-to-r from-[hsl(222_14%_9%)] via-[hsl(222_12%_11%)] to-[hsl(352_58%_49%_/_0.15)] p-6 sm:p-8 shadow-xl">
    //     <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-(--primary-glow) rounded-full blur-3xl opacity-20 pointer-events-none" />

    //     <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    //       <div className="space-y-2">
    //         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--primary-dim) border border-(--primary-border) text-xs font-semibold text-[#f06a7d]">
    //           <Sparkles className="w-3.5 h-3.5" />
    //           <span>Agency Dashboard Overview</span>
    //         </div>
    //         <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
    //           Welcome back, {user?.displayName || "NJ Partner"} 👋
    //         </h1>
    //         <p className="text-sm text-(--text-muted) max-w-xl">
    //           Track real-time pitch deliveries, explore our top pitching talent, and oversee agency projects from your command center.
    //         </p>
    //       </div>

    //       <div className="flex items-center gap-3">
    //         <Link
    //           to="/dashboard/pitchers"
    //           className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
    //         >
    //           <span>Explore Pitchers</span>
    //           <ArrowUpRight className="w-4 h-4" />
    //         </Link>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Stats Cards Grid */}
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
    //     {stats.map((item, idx) => {
    //       const Icon = item.icon;
    //       return (
    //         <div
    //           key={idx}
    //           className="relative overflow-hidden rounded-2xl border border-(--border) bg-[hsl(222_14%_9%_/_0.9)] p-5 backdrop-blur-xl transition-all duration-200 hover:border-[hsl(220_10%_28%)] hover:shadow-lg group"
    //         >
    //           <div className="flex items-center justify-between">
    //             <span className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
    //               {item.label}
    //             </span>
    //             <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color} border ${item.border}`}>
    //               <Icon className="w-4 h-4 text-white" />
    //             </div>
    //           </div>

    //           <div className="mt-4">
    //             <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
    //               {item.value}
    //             </div>
    //             <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
    //               <span>{item.change}</span>
    //             </div>
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>

    //   {/* Main Content Sections: Recent Pitches & Quick Status */}
    //   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
    //     {/* Recent Pitches Table (2 cols) */}
    //     <div className="lg:col-span-2 rounded-2xl border border-(--border) bg-[hsl(222_14%_9%_/_0.9)] p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <h2 className="font-display text-base sm:text-lg font-bold text-white">
    //             Recent Pitch Campaigns
    //           </h2>
    //           <p className="text-xs text-(--text-muted)">
    //             Latest client deliverables and strategic agency presentations
    //           </p>
    //         </div>
    //         <Link
    //           to="/dashboard/pitchers"
    //           className="inline-flex items-center gap-1 text-xs font-semibold text-[#f06a7d] hover:text-[#ff7f92] transition-colors"
    //         >
    //           <span>View All</span>
    //           <ArrowUpRight className="w-3.5 h-3.5" />
    //         </Link>
    //       </div>

    //       <div className="overflow-x-auto">
    //         <table className="w-full text-left text-xs sm:text-sm">
    //           <thead>
    //             <tr className="border-b border-(--border-soft) text-(--text-faint) uppercase text-[11px] tracking-wider">
    //               <th className="pb-3 font-semibold">Client / Project</th>
    //               <th className="pb-3 font-semibold hidden sm:table-cell">Lead Pitcher</th>
    //               <th className="pb-3 font-semibold">Status</th>
    //               <th className="pb-3 font-semibold text-right">Value</th>
    //             </tr>
    //           </thead>
    //           <tbody className="divide-y divide-(--border-soft)">
    //             {recentPitches.map((pitch) => (
    //               <tr key={pitch.id} className="hover:bg-(--surface-2) transition-colors group">
    //                 <td className="py-3.5">
    //                   <div className="font-semibold text-white group-hover:text-[#f06a7d] transition-colors">
    //                     {pitch.client}
    //                   </div>
    //                   <div className="text-xs text-(--text-muted)">{pitch.service}</div>
    //                 </td>
    //                 <td className="py-3.5 hidden sm:table-cell text-(--text)">
    //                   {pitch.pitcher}
    //                 </td>
    //                 <td className="py-3.5">
    //                   <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${pitch.statusColor}`}>
    //                     {pitch.status}
    //                   </span>
    //                 </td>
    //                 <td className="py-3.5 text-right font-mono font-semibold text-white">
    //                   {pitch.amount}
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>

    //     {/* Agency Quick Actions & System Info (1 col) */}
    //     <div className="space-y-6">
    //       {/* Quick Actions Panel */}
    //       <div className="rounded-2xl border border-(--border) bg-[hsl(222_14%_9%_/_0.9)] p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
    //         <h2 className="font-display text-base font-bold text-white">
    //           Quick Shortcuts
    //         </h2>

    //         <div className="space-y-2">
    //           <Link
    //             to="/services"
    //             className="flex items-center justify-between p-3 rounded-xl bg-(--surface) hover:bg-(--surface-2) border border-(--border) transition-colors group"
    //           >
    //             <div className="flex items-center gap-3">
    //               <div className="p-2 rounded-lg bg-(--primary-dim) text-[#f06a7d]">
    //                 <Briefcase className="w-4 h-4" />
    //               </div>
    //               <div>
    //                 <div className="text-xs font-semibold text-white group-hover:text-[#f06a7d] transition-colors">
    //                   Book New Service
    //                 </div>
    //                 <div className="text-[11px] text-(--text-muted)">
    //                   Explore agency capabilities
    //                 </div>
    //               </div>
    //             </div>
    //             <ArrowUpRight className="w-4 h-4 text-(--text-muted) group-hover:text-white" />
    //           </Link>

    //           <Link
    //             to="/dashboard/pitchers"
    //             className="flex items-center justify-between p-3 rounded-xl bg-(--surface) hover:bg-(--surface-2) border border-(--border) transition-colors group"
    //           >
    //             <div className="flex items-center gap-3">
    //               <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
    //                 <Users className="w-4 h-4" />
    //               </div>
    //               <div>
    //                 <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
    //                   Pitcher Profiles
    //                 </div>
    //                 <div className="text-[11px] text-(--text-muted)">
    //                   Review team specialists
    //                 </div>
    //               </div>
    //             </div>
    //             <ArrowUpRight className="w-4 h-4 text-(--text-muted) group-hover:text-white" />
    //           </Link>
    //         </div>
    //       </div>

    //       {/* Agency Support Banner */}
    //       <div className="rounded-2xl border border-(--primary-border) bg-[hsl(352_58%_49%_/_0.08)] p-5 backdrop-blur-xl relative overflow-hidden">
    //         <div className="flex items-start gap-3">
    //           <div className="p-2 rounded-xl bg-(--primary) text-white shrink-0 mt-0.5">
    //             <Sparkles className="w-4 h-4" />
    //           </div>
    //           <div className="space-y-1">
    //             <h3 className="text-sm font-semibold text-white">Need a Custom Pitch?</h3>
    //             <p className="text-xs text-(--text-muted)">
    //               Our strategic team is available 24/7 to craft your high-converting pitch deck.
    //             </p>
    //             <Link
    //               to="/#contact"
    //               className="inline-block mt-2 text-xs font-semibold text-[#f06a7d] hover:underline"
    //             >
    //               Contact Account Manager →
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <UpdateSoon title="Dashboard Home"></UpdateSoon>
  );
};

export default DashboardHome;