import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  User as UserIcon,
  X,
} from "lucide-react";
import Logo from "../Logo";
import AuthContext from "../../Context/AuthContext";
import dummyUser from "/user.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/process", label: "Process" },
];

export function Navbar() {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;
  const logOut = auth?.logOut;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Close user dropdown if clicked outside
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }

      // Close mobile menu if clicked outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      if (logOut) {
        await logOut();
      }
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setUserMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-[hsl(222_10%_17%)] bg-[hsl(222_16%_6%_/_0.88)] backdrop-blur-[18px] backdrop-saturate-150"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 container items-center justify-between px-4 sm:px-6">
        {/* Left side: Mobile Menu Toggle Button (on mobile) & Brand Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile dropdown/hamburger button placed on the left side */}
          <div ref={mobileMenuRef} className="relative md:hidden">
            <button
              aria-label="Toggle navigation menu"
              className="flex cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text)] transition-colors hover:bg-[var(--surface-2)] hover:text-white"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setUserMenuOpen(false);
              }}
              type="button"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <Logo />
        </div>

        {/* Center / Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link"
              data-active={location.pathname === link.to}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: User Dropdown or Sign Up button */}
        <div className="flex items-center gap-4">
          {user ? (
            /* User Avatar & Dropdown Menu */
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen((prev) => !prev);
                  setMobileMenuOpen(false);
                }}
                className="group flex items-center gap-2 rounded-full p-0.5 transition-all duration-200 hover:ring-2 hover:ring-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="Open user menu"
              >
                <div className="relative">
                  <img
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-[var(--border)] group-hover:ring-[var(--primary)] transition-all"
                    src={user.photoURL || dummyUser}
                    alt={user.displayName || "User avatar"}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = dummyUser;
                    }}
                  />
                  {/* Status Indicator */}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg)]" />
                </div>
                <ChevronDown
                  className={`hidden sm:block h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 group-hover:text-[var(--text)] ${
                    userMenuOpen ? "rotate-180 text-[var(--text)]" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Floating Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 origin-top-right rounded-2xl border border-[var(--border)] bg-[hsl(222_14%_9%_/_0.95)] p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  {/* Top glowing accent */}
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />

                  {/* User Profile Summary Header */}
                  <div className="flex items-center gap-3 border-b border-[var(--border-soft)] p-3 pb-3.5">
                    <img
                      className="h-11 w-11 rounded-full object-cover ring-1 ring-[var(--border)]"
                      src={user.photoURL || dummyUser}
                      alt={user.displayName || "User avatar"}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = dummyUser;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold text-[var(--text)]">
                          {user.displayName || "NJ Member"}
                        </p>
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <p className="truncate text-xs text-[var(--text-muted)]">
                        {user.email || "client@njagency.com"}
                      </p>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-[var(--primary-dim)] text-[#f06a7d] border border-[var(--primary-border)]">
                        Client Portal
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Navigation Menu Items */}
                  <div className="py-1.5 space-y-0.5">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[var(--text-muted)]" />
                      <span>Dashboard Overview</span>
                    </Link>

                    <Link
                      to="/services"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <Briefcase className="h-4 w-4 text-[var(--text-muted)]" />
                      <span>My Projects & Services</span>
                    </Link>

                    <Link
                      to="/about"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-[var(--text-muted)]" />
                      <span>Profile & Settings</span>
                    </Link>

                    <a
                      href="#pricing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <CreditCard className="h-4 w-4 text-[var(--text-muted)]" />
                      <span>Billing & Subscriptions</span>
                    </a>

                    <a
                      href="#contact"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <HelpCircle className="h-4 w-4 text-[var(--text-muted)]" />
                      <span>Help & Support</span>
                    </a>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[var(--border-soft)] my-1" />

                  {/* Sign Out Option (Last item) */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/sign-up"
              className="btn-primary btn cursor-pointer text-xs sm:text-sm py-2 px-4 sm:py-2.5 sm:px-5"
            >
              <span>Sign Up</span>
              <ArrowRight className="-rotate-45 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Dropdown Menu (Opened via left-side button) */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="flex flex-col gap-1 border-t border-[var(--border)] bg-[hsl(222_16%_6%_/_0.97)] px-6 py-5 backdrop-blur-xl md:hidden animate-in fade-in duration-200"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`border-b border-[var(--border-soft)] py-3 text-[0.95rem] font-medium no-underline transition-colors ${
                location.pathname === link.to
                  ? "text-[var(--text)] font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!user && (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-ghost justify-center py-2.5 text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary justify-center py-2.5 text-sm"
              >
                <span>Sign Up</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
