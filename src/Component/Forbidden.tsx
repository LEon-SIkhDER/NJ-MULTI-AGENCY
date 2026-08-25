import React from "react";
import { useNavigate } from "react-router";
import { ShieldAlert, ArrowLeft, Home, Lock, AlertTriangle } from "lucide-react";
import Logo from "./Logo";

const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-(--bg) text-(--text) flex flex-col justify-between overflow-x-hidden">
      {/* Background ambient glowing lights */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-(--primary-dim) rounded-full blur-[140px] opacity-70 animate-orb" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[hsl(352_58%_49%_/_0.08)] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[hsl(222_30%_20%_/_0.15)] rounded-full blur-[120px]" />
        {/* Subtle dot matrix grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Top navigation header */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 py-6 flex items-center justify-between">
        <Logo />
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) hover:text-(--text) transition-colors px-3.5 py-1.5 rounded-lg hover:bg-(--surface-2) cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6 md:py-12">
        <div className="w-full max-w-[560px]">
          <div className="relative rounded-2xl sm:rounded-3xl border border-(--border) bg-[hsl(222_14%_9%_/_0.85)] p-7 sm:p-12 shadow-2xl backdrop-blur-xl text-center overflow-hidden">
            {/* Top red accent glow line */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-(--primary) to-transparent" />

            {/* Glowing Icon Badge */}
            <div className="mx-auto mb-6 flex items-center justify-center">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-(--primary-dim) border border-(--primary-border) shadow-[0_0_35px_-5px_var(--primary-glow)]">
                <ShieldAlert className="w-10 h-10 text-[#f06a7d]" />
                <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-md bg-(--surface-2) border border-(--border) text-(--text-muted)">
                  <Lock className="w-3.5 h-3.5 text-[#f06a7d]" />
                </div>
              </div>
            </div>

            {/* 403 Status Code */}
            <div className="mb-2">
              <span className="font-display text-7xl sm:text-8xl font-extrabold tracking-tight text-gradient-red block select-none">
                403
              </span>
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--primary-dim) border border-(--primary-border) text-xs font-semibold text-[#f06a7d] mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="tracking-wide uppercase">Access Denied • Forbidden</span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-(--text) mb-3">
              Administrative Access Required
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-(--text-muted) max-w-md mx-auto leading-relaxed mb-8">
              You do not have permission to access the requested agency management dashboard or administrative resource.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto btn-ghost justify-center px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto btn-primary justify-center px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-lg shadow-(--primary-dim)"
              >
                <Home className="w-4 h-4" />
                <span>Back to Homepage</span>
              </button>
            </div>

            {/* Security Notice Footer Inside Card */}
            <div className="mt-8 pt-6 border-t border-(--border-soft) flex items-center justify-center text-xs text-(--text-faint) gap-2">
              <span>Error Code: 403_FORBIDDEN</span>
              <span>•</span>
              <span>Role Verification Failed</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-(--text-faint)">
        © {new Date().getFullYear()} NJ Multi Agency. All rights reserved.
      </footer>
    </div>
  );
};

export default Forbidden;