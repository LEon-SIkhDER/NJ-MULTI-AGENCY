import React, { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, ShieldCheck } from "lucide-react";
import Logo from "../../Component/Logo";

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - form submission handling placeholder
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-[var(--primary-dim)] rounded-full blur-[140px] opacity-70 animate-orb" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[hsl(352_58%_49%_/_0.08)] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[hsl(222_30%_20%_/_0.15)] rounded-full blur-[120px]" />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Top navigation bar */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 py-6 flex items-center justify-between">
        <Logo />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--surface-2)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6 md:py-12">
        <div className="w-full max-w-[480px]">
          {/* Card */}
          <div className="relative rounded-2xl border border-[var(--border)] bg-[hsl(222_14%_9%_/_0.85)] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            {/* Glow accent ring */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-dim)] border border-[var(--primary-border)] text-xs font-semibold text-[#f06a7d] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Welcome Back</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
                Sign in to your account
              </h1>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Access your dashboard and manage your agency projects.
              </p>
            </div>

            {/* Google Sign-in Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] hover:border-[hsl(220_10%_28%)] text-sm font-medium text-[var(--text)] transition-all duration-200 cursor-pointer shadow-sm hover:shadow group"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-6 flex items-center">
              <div className="flex-grow border-t border-[var(--border)]" />
              <span className="flex-shrink-0 px-3 text-xs uppercase tracking-wider text-[var(--text-faint)]">
                Or continue with email
              </span>
              <div className="flex-grow border-t border-[var(--border)]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-[var(--text-muted)] hover:text-[#f06a7d] transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-primary justify-center py-3 rounded-xl font-semibold tracking-wide cursor-pointer group shadow-lg shadow-[var(--primary-dim)] mt-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </form>

            {/* Footer Redirect */}
            <div className="mt-8 pt-6 border-t border-[var(--border-soft)] text-center text-sm text-[var(--text-muted)]">
              <span>Don't have an account? </span>
              <Link
                to="/sign-up"
                className="font-semibold text-[var(--text)] hover:text-[#f06a7d] transition-colors underline-offset-4 hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Security badge note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--text-faint)]">
            <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
            <span>Secure 256-bit encrypted connection</span>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-[var(--text-faint)]">
        © {new Date().getFullYear()} NJ Multi Agency. All rights reserved.
      </footer>
    </div>
  );
};

export default SignIn;