// import { Link } from "@tanstack/react-router";
import {  Menu, X } from "lucide-react";
import { useState } from "react";
// import logo from "../../assets/logo.png";
import Logo from "../Logo";
import { Link } from "react-router";

const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/process", label: "Process" },
];

export function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <header className="fixed top-0 inset-x-0 z-50">
            <div className="glass border-b border-white/5">
                <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
                    <Logo></Logo>

                    <div className="hidden md:flex items-center gap-8">
                        {links.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className="text-sm text-white/70 hover:text-white transition-colors"
                            >
                                {l.label}
                            </Link>
                        ))}
                        <Link
                            to="/auth"
                            className="ml-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover-glow"
                        >
                            Join as Freelancer
                        </Link>
                    </div>

                    <button
                        className="md:hidden p-2 -mr-2 text-white/80"
                        aria-label="Toggle menu"
                        onClick={() => setOpen((o) => !o)}
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </nav>

                {open && (
                    <div className="md:hidden border-t border-white/5 px-5 py-4 flex flex-col gap-3 animate-fade-in">
                        {links.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className="text-sm text-white/80 py-1"
                                onClick={() => setOpen(false)}
                            >
                                {l.label}
                            </Link>
                        ))}
                        <Link
                            to="/auth"
                            className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                            onClick={() => setOpen(false)}
                        >
                            Join as Freelancer
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
