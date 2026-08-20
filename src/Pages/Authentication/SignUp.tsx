import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, User, ShieldCheck } from "lucide-react";
import Logo from "../../Component/Logo";
import { createUserWithEmailAndPassword, updateCurrentUser, updateProfile } from "firebase/auth";
import { auth } from "../../firebase.config";
import toast from "react-hot-toast";
import axios from "axios";


const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.currentTarget))
        if (!agreeTerms) {
            return
        }
        delete formData.agreeTerms
        setLoading(true)
        console.log(formData)
        createUserWithEmailAndPassword(auth, formData.email as string, formData.password as string)
            .then(async (result) => {

                setLoading(false)
                console.log(result)
                navigate("/")

                updateProfile(result.user, { displayName: formData.name as string })
                    .then(update => {
                        console.log(update)

                    })
                    .catch(error => console.log(error))
                try {
                    const userData = {
                        ...formData,
                        uid: result.user.uid
                    }
                    const { data } = await axios.post('http://localhost:5000/users', userData)
                    if (!data.insertedId) {
                        throw new Error()
                    }

                } catch {
                    localStorage.setItem("incompleteUser", "true")
                }




            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                toast.error(error.message || "something went wrong")
            })




        // UI only - form submission handling placeholder
    };


    return (
        <div className="relative min-h-screen w-full bg-(--bg) text-(--text) flex flex-col justify-between overflow-x-hidden">
            {/* Background ambient lighting */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-162.5 h-112.5 bg-(--primary-dim) rounded-full blur-[140px] opacity-70 animate-orb" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[hsl(352_58%_49%/0.08)] rounded-full blur-[120px]" />
                <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[hsl(222_30%_20%/0.15)] rounded-full blur-[120px]" />
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
                    className="inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) hover:text-(--text) transition-colors px-3 py-1.5 rounded-lg hover:bg-(--surface-2)"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                </Link>
            </header>

            {/* Main Container */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6 md:py-12">
                <div className="w-full max-w-120">
                    {/* Card */}
                    <div className="relative rounded-2xl border border-(--border) bg-[hsl(222_14%_9%/0.85)] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                        {/* Glow accent ring */}
                        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-linear-to-r from-transparent via-[#C73F52] to-transparent" />

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--primary-dim) border border-(--primary-border) text-xs font-semibold text-[#f06a7d] mb-4">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Join NJ Multi Agency</span>
                            </div>
                            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-(--text)">
                                Create an account
                            </h1>
                            <p className="mt-2 text-sm text-(--text-muted)">
                                Start scaling your business with next-gen solutions.
                            </p>
                        </div>

                        {/* Google Sign-up Button */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-(--border) bg-(--surface) hover:bg-(--surface-2) hover:border-[hsl(220_10%_28%)] text-sm font-medium text-(--text) transition-all duration-200 cursor-pointer shadow-sm hover:shadow group"
                        >
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                            <span>Sign up with Google</span>
                        </button>

                        {/* Divider */}
                        <div className="relative my-6 flex items-center">
                            <div className="grow border-t border-(--border)" />
                            <span className="shrink-0 px-3 text-xs uppercase tracking-wider text-(--text-faint)">
                                Or continue with email
                            </span>
                            <div className="grow border-t border-(--border)" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Field */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-(--text-muted) mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        // value={name}
                                        // onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        name="name"
                                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                                    />
                                </div>
                            </div>

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
                                        // value={email}
                                        // onChange={(e) => setEmail(e.target.value)}
                                        name="email"
                                        placeholder="name@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        name="password"
                                        // value={password}
                                        // onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a strong password"
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

                            {/* Terms Checkbox */}
                            <div className="flex items-center gap-2.5 pt-1">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="agreeTerms"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    required
                                    className=" h-4 w-4 rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-[var(--primary)] accent-[var(--primary)] cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-xs text-[var(--text-muted)] leading-relaxed cursor-pointer">
                                    I agree to the{" "}
                                    <a href="#" className="text-[var(--text)] underline hover:text-[#f06a7d]">
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-[var(--text)] underline hover:text-[#f06a7d]">
                                        Privacy Policy
                                    </a>
                                    .
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full btn-primary justify-center py-3 rounded-xl font-semibold tracking-wide cursor-pointer group shadow-lg shadow-[var(--primary-dim)] mt-2"
                            >
                                <span>Create Account</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </button>
                        </form>

                        {/* Footer Redirect */}
                        <div className="mt-8 pt-6 border-t border-[var(--border-soft)] text-center text-sm text-[var(--text-muted)]">
                            <span>Already have an account? </span>
                            <Link
                                to="/sign-in"
                                className="font-semibold text-[var(--text)] hover:text-[#f06a7d] transition-colors underline-offset-4 hover:underline"
                            >
                                Sign In
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

export default SignUp;
