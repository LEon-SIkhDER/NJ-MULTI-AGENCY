import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "../Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/process", label: "Process" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-[hsl(222_10%_17%)] bg-[hsl(222_16%_6%_/_0.88)] backdrop-blur-[18px] backdrop-saturate-150"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Logo />

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
          <Link to="/auth" className="btn-primary px-5 py-2.5">
            Join as Freelancer
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="flex cursor-pointer items-center justify-center border-0 bg-transparent p-2 text-[var(--text)] md:hidden"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-[var(--border)] bg-[hsl(222_16%_6%_/_0.97)] px-6 py-5 backdrop-blur-xl">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`border-b border-[var(--border-soft)] py-2.5 text-[0.95rem] font-medium no-underline ${
                location.pathname === link.to ? "text-[var(--text)]" : "text-[var(--text-muted)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 justify-center"
          >
            Join as Freelancer
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </header>
  );
}
