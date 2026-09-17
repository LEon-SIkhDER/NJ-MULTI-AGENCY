import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  // MessageSquare,
  // BarChart3,
  Settings,
  Globe,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Mic,
  BadgeCheck,
  ListTodo,
  CalendarClock,
  Handshake,
  // Sparkles,
  // ExternalLink,
  // HelpCircle,
  // FolderPlus,
  CreditCard,
} from "lucide-react";

import Logo from "../../Component/Logo";
import useAuth from "../../Hook/useAuth";
import dummyUser from "/user.png";
import { confirmSignOut } from "../../utils/swal";
import { Toaster } from "react-hot-toast";
import useRole from "../../Hooks/useRole";

const adminLinks = [

  {
    category: "Main Management",
    items: [
      {
        to: "/admin",
        exact: true,
        label: "Overview",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        to: "/admin/pitchers",
        exact: false,
        label: "Pitchers & Team",
        icon: Mic,
        badge: null,
      },
      {
        to: "/admin/moderators",
        exact: false,
        label: "Moderators",
        icon: BadgeCheck,
        badge: null,
      },
      {
        to: "/admin/clients",
        exact: false,
        label: "Clients",
        icon: Handshake,
        badge: null,
      },
      {
        to: "/admin/payments",
        exact: false,
        label: "Payments",
        icon: CreditCard,
        badge: null,
      },

      {
        to: "/admin/users",
        exact: false,
        label: "Users",
        icon: Users,
        badge: null,
      },

    ],
  },
];
const moderatorLinks = [

  {
    category: "Main Management",
    items: [
      {
        to: "/moderator",
        exact: true,
        label: "Overview",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        to: "/moderator/pitchers",
        exact: false,
        label: "Pitchers & Team",
        icon: Users,
        badge: null,
      },

    ],
  },
];
const pitcherLinks = [{
  category: "Main Management",
  items: [
    {
      to: "/pitcher",
      exact: true,
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: "/pitcher/todays-tasks",
      exact: false,
      label: "Today's Tasks",
      icon: CalendarClock,
      badge: null,
    },
    {
      to: "/pitcher/all-tasks",
      exact: false,
      label: "All Tasks",
      icon: ListTodo,
      badge: null,
    },

  ],
},]
const DashboardLayout: React.FC = () => {
  const { role } = useRole();
  const dashboardUrl =
    role === "admin"
      ? "/admin"
      : role === "moderator"
      ? "/moderator"
      : role === "pitcher"
      ? "/pitcher"
      : null;

  const navLinks = role === "admin" ? adminLinks : role === 'moderator' ? moderatorLinks : role === "pitcher" ? pitcherLinks : []
  const { user, logOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Handle outside click for user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const navigate = useNavigate()
  const handleSignOut = async () => {
    await confirmSignOut(async () => {
      try {
        if (logOut) {
          await logOut();
          navigate('/')
        }
      } catch (err) {
        console.error("Dashboard signout failed:", err);
      }
    });
  };

  // Determine current page title from route
  const getPageTitle = () => {
    if (location.pathname.includes("/pitchers")) {
      return { title: "Pitchers & Team", breadcrumb: "Team Directory" };
    }
    return { title: "Dashboard Overview", breadcrumb: "Analytics & Projects" };
  };

  const { title, breadcrumb } = getPageTitle();

  return (
    <div className="relative min-h-screen w-full bg-(--bg) text-(--text) flex font-sans">
      <Toaster />
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[450px] bg-(--primary-dim) rounded-full blur-[140px] opacity-50 animate-orb" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[hsl(222_30%_20%_/_0.15)] rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 right-10 w-96 h-96 bg-[hsl(352_58%_49%_/_0.06)] rounded-full blur-[120px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* ========================================================
          SIDEBAR NAVIGATION (Desktop persistent & Mobile drawer)
          ======================================================== */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0 flex-col justify-between border-r border-(--border) bg-[hsl(222_14%_9%_/_0.95)] backdrop-blur-2xl transition-transform duration-300 ease-in-out flex ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Sidebar Header with Brand Logo & Agency Portal Badge */}
        <div className="flex flex-col border-b border-(--border-soft) p-5">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-2)] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Agency Portal
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--primary-dim)] text-[#f06a7d] border border-[var(--primary-border)]">
              PRO
            </span>
          </div> */}
        </div>

        {/* Sidebar Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-[var(--surface-2)]">
          {navLinks.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                {section.category}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.to || location.pathname === "/admin"
                  : location.pathname.startsWith(item.to);

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-[hsl(352_58%_49%_/_0.12)] text-white font-semibold border border-primary-border shadow-sm"
                      : "text-[var(--text-muted)] hover:text-text hover:bg-surface-2"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${isActive
                          ? "text-[#f06a7d]"
                          : "text-[var(--text-muted)] group-hover:text-[var(--text)]"
                          }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md border bg-[var(--surface)] text-text-muted border-border"
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Active right glow indicator */}
                    {isActive && (
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Quick Actions / External section */}
          {/* <div className="space-y-1.5 pt-2 border-t border-[var(--border-soft)]">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
              General
            </p>
            <Link
              to="/"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text)]" />
                <span>Visit Main Site</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </Link>

            <Link
              to="/about"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors group"
            >
              <HelpCircle className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text)]" />
              <span>Agency Support</span>
            </Link>
          </div> */}
        </div>

        {/* User Profile Card & Sign Out footer */}
        <div className="border-t border-border-soft p-3.5 ">
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-[var(--border)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={user?.photoURL || dummyUser}
                  alt={user?.displayName || "User"}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = dummyUser;
                  }}
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--surface)]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="truncate text-xs font-semibold text-[var(--text)]">
                    {user?.displayName || "NJ Member"}
                  </p>
                  <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                </div>
                <p className="truncate text-[11px] text-[var(--text-muted)]">
                  {user?.email || "agency@client.com"}
                </p>
              </div>
            </div>

            {/* Quick Sign Out Action Button */}
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="shrink-0 p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          MAIN VIEW AREA (Top Header + Outlet Content)
          ======================================================== */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Dashboard Top Header Bar */}
        <header className="sticky lg:hidden top-0 z-30 flex h-16 sm:h-18 items-center justify-between border-b border-[var(--border)] bg-[hsl(222_16%_6%_/_0.85)] px-4 sm:px-8 backdrop-blur-xl">
          {/* Left: Mobile hamburger & Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <span>Agency</span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                <span className="text-[var(--text)] font-medium">{breadcrumb}</span>
              </div>
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--text)] flex items-center gap-2">
                <span>{title}</span>
              </h1>
            </div>
          </div>

          {/* Right: Search, Quick Actions, Notifications, User Menu */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Search Input (Desktop) */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search projects, pitchers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 lg:w-64 pl-10 pr-12 py-2 bg-[var(--surface)] border border-(--border) rounded-xl text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border-soft)]">
                ⌘K
              </span>
            </div>

            {/* Live Website Link */}
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-xs font-medium text-[var(--text)] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#f06a7d]" />
              <span>Live Site</span>
            </Link>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text)] transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 text-[var(--text-muted)] hover:text-white transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--primary)] ring-2 ring-[var(--surface)] animate-pulse" />
            </button>

            {/* User Dropdown Header Menu */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[var(--primary)] transition-all cursor-pointer"
                aria-expanded={userDropdownOpen}
              >
                <img
                  src={user?.photoURL || dummyUser}
                  alt={user?.displayName || "Profile"}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-[var(--border)]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = dummyUser;
                  }}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-2xl border border-[var(--border)] bg-[hsl(222_14%_9%_/_0.95)] p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />

                  <div className="p-3 border-b border-[var(--border-soft)]">
                    <p className="truncate text-sm font-semibold text-[var(--text)]">
                      {user?.displayName || "NJ Member"}
                    </p>
                    <p className="truncate text-xs text-[var(--text-muted)]">
                      {user?.email || "client@njagency.com"}
                    </p>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {dashboardUrl && (
                      <Link
                        to={dashboardUrl}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#f06a7d]" />
                        <span>Dashboard Overview</span>
                      </Link>
                    )}
                    <Link
                      to="/services"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>My Services</span>
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Account Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-[var(--border-soft)] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;