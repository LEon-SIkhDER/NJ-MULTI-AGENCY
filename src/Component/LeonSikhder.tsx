import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import {
  Terminal,
  Shield,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  Cpu,
  Wifi,
  Radio,
  ArrowRight,
  RefreshCw,
  Binary,
  CheckCircle2,
  AlertTriangle,
  Power,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_SERVER_URL ||
  (import.meta.env.PROD
    ? "https://ex.njmultiagency.site"
    : "http://localhost:5000");

const INITIAL_LOGS = [
  "[SYSTEM] Kernel v6.8.4-cyber loaded successfully.",
  "[AUTH-GATEWAY] Secure node listening on port 9099.",
  "[CIPHER] Quantum-resistant AES-256-GCM initialized.",
  "[STATUS] Clearance required: LEVEL-5 (ROOT).",
];

const LeonSikhder = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [stealthMode, setStealthMode] = useState(true);
  const [rememberClearance, setRememberClearance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShutdown, setIsShutdown] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [timestamp, setTimestamp] = useState<string>("");

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-6), msg]);
  };

  // Live system clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(
        now.toISOString().replace("T", " ").substring(0, 19) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch current kill_switch state on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/kill_switch`);
        if (typeof response.data?.isShutdown === "boolean") {
          setIsShutdown(response.data.isShutdown);
          addLog(
            response.data.isShutdown
              ? "[ALERT] System is currently in LOCKDOWN mode (APIs blocked)."
              : "[SYSTEM] Mainframe active. Normal API traffic operating."
          );
        }
      } catch (error) {
        console.error("Failed to query kill_switch state:", error);
      }
    };
    fetchStatus();
  }, []);

  // Compute a live pseudo-hash based on password input
  const simulatedHash = password
    ? Array.from(password)
        .map((char, i) =>
          ((char.charCodeAt(0) * 17 + i * 31) % 16).toString(16)
        )
        .join("")
        .padEnd(16, "f")
        .substring(0, 16)
        .toUpperCase()
    : "0000-0000-0000-0000";

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setStatusMessage("ERROR: CREDENTIALS_PAYLOAD_EMPTY");
      addLog("[FAIL] Incomplete input: Operator handle or password omitted.");
      toast.error("Access Denied: Missing credentials.", {
        style: {
          background: "#111827",
          color: "#f87171",
          border: "1px solid #ef4444",
        },
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage("INITIALIZING HANDSHAKE PROTOCOL...");
    addLog(`[+] Validating credentials for '${username.trim()}' against /kill_switch...`);

    try {
      // Authenticate and verify with backend
      const response = await axios.post(`${API_BASE_URL}/kill_switch`, {
        username: username.trim(),
        password: password.trim(),
        action: isShutdown ? "restore" : "shutdown",
      });

      const updatedShutdown = response.data.isShutdown;
      setIsShutdown(updatedShutdown);
      setAccessGranted(true);
      setStatusMessage(
        updatedShutdown
          ? "CRITICAL: KILL SWITCH ENGAGED // SITE LOCKED DOWN"
          : "AUTHORIZATION CONFIRMED // MAINFRAME RESTORED"
      );
      addLog(
        updatedShutdown
          ? "[CRITICAL] Kill Switch Activated. All incoming APIs return 503."
          : "[RESTORE] Kill Switch Deactivated. All APIs restored to normal."
      );

      toast.success(
        updatedShutdown
          ? "SITE LOCKED DOWN! All APIs are now blocked."
          : "Site Restored! All APIs are operating normally.",
        {
          style: {
            background: updatedShutdown ? "#450a0a" : "#064e3b",
            color: updatedShutdown ? "#fca5a5" : "#34d399",
            border: updatedShutdown ? "1px solid #ef4444" : "1px solid #10b981",
          },
        }
      );
    } catch (error: unknown) {
      console.error("Kill switch authorization failed:", error);
      setStatusMessage("ERROR: INVALID_ROOT_CREDENTIALS");
      addLog("[FAIL] 401 Unauthorized: Mainframe rejected cryptographic key.");
      toast.error("Access Denied: Invalid credentials.", {
        style: {
          background: "#111827",
          color: "#f87171",
          border: "1px solid #ef4444",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteKillSwitch = async (action: "shutdown" | "restore") => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/kill_switch`, {
        username: username.trim(),
        password: password.trim(),
        action,
      });

      const updatedShutdown = response.data.isShutdown;
      setIsShutdown(updatedShutdown);
      addLog(
        updatedShutdown
          ? "[CRITICAL] MANUAL OVERRIDE: KILL SWITCH ENGAGED."
          : "[RESTORE] MANUAL OVERRIDE: SITE RESTORED TO NORMAL."
      );
      toast.success(
        updatedShutdown
          ? "Site successfully shut down. All APIs blocked!"
          : "Site successfully restored to normal operation.",
        {
          style: {
            background: updatedShutdown ? "#450a0a" : "#064e3b",
            color: updatedShutdown ? "#fca5a5" : "#34d399",
            border: updatedShutdown ? "1px solid #ef4444" : "1px solid #10b981",
          },
        }
      );
    } catch (error: unknown) {
      console.error("Action execution error:", error);
      toast.error("Failed to execute command.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    setAccessGranted(false);
    setUsername("");
    setPassword("");
    setStatusMessage(null);
    setLogs(INITIAL_LOGS);
    addLog("[SYS] Terminal memory cleared. Standby mode active.");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05070d] text-[#00ff66] font-mono flex flex-col justify-between selection:bg-[#00ff66]/30 selection:text-white overflow-x-hidden">
      {/* Background Matrix/Cyberpunk Grid & Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Neon green/emerald ambient orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#00ff66]/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#00e5ff]/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#c43448]/10 rounded-full blur-[120px]" />

        {/* Cyber Digital Matrix Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00ff66 1px, transparent 1px),
              linear-gradient(to bottom, #00ff66 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Scanlines Effect */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.7) 3px, rgba(0, 0, 0, 0.7) 4px)",
          }}
        />
      </div>

      {/* Top Mainframe Navigation / Status Bar */}
      <header className="relative z-10 w-full border-b border-[#00ff66]/20 bg-[#05070d]/80 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Node Identity & Shutdown Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    isShutdown ? "bg-red-500" : "bg-[#00ff66]"
                  } opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isShutdown ? "bg-red-500" : "bg-[#00ff66]"
                  }`}
                />
              </span>
              <span className="font-semibold tracking-wider text-white">
                LEON_SIKHDER::SECURE_PORTAL
              </span>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                  isShutdown
                    ? "bg-red-950/60 border-red-500/50 text-red-400 animate-pulse"
                    : "bg-[#00ff66]/10 border-[#00ff66]/30 text-[#00ff66]"
                }`}
              >
                {isShutdown ? "KILL_SWITCH ACTIVE [503]" : "MAINFRAME ONLINE"}
              </span>
            </div>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline text-white/60">
              API: <span className="text-[#00ff66]">/kill_switch</span>
            </span>
          </div>

          {/* System Telemetry Chips */}
          <div className="flex items-center gap-4 text-[11px] text-white/70">
            <div className="hidden md:flex items-center gap-1.5 bg-[#00ff66]/10 px-2.5 py-1 rounded border border-[#00ff66]/20">
              <Cpu className="w-3 h-3 text-[#00ff66]" />
              <span>CORE: 99.4% IDLE</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 bg-[#00ff66]/10 px-2.5 py-1 rounded border border-[#00ff66]/20">
              <Wifi className="w-3 h-3 text-[#00ff66]" />
              <span>CIPHER: AES-GCM</span>
            </div>
            <div className="flex items-center gap-1 text-white/50">
              <Radio className="w-3 h-3 text-[#00ff66] animate-pulse" />
              <span>{timestamp || "INITIALIZING..."}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Central Cyber Access Console */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-xl">
          {/* Mainframe Terminal Card */}
          <div
            className={`relative rounded-2xl bg-[#090d16]/90 border backdrop-blur-xl overflow-hidden transition-all duration-500 ${
              isShutdown
                ? "border-red-500/40 shadow-[0_0_60px_-10px_rgba(239,68,68,0.25)]"
                : "border-[#00ff66]/30 shadow-[0_0_50px_-10px_rgba(0,255,102,0.15)]"
            }`}
          >
            {/* Top Glowing Laser Accent Strip */}
            <div
              className={`absolute top-0 inset-x-0 h-1 transition-all duration-500 ${
                isShutdown
                  ? "bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ef4444]"
                  : "bg-gradient-to-r from-transparent via-[#00ff66] to-transparent shadow-[0_0_15px_#00ff66]"
              }`}
            />

            {/* Terminal Window Header Bar */}
            <div className="px-5 sm:px-6 py-3.5 bg-[#0d131f]/90 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/80 border border-[#ef4444]" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]/80 border border-[#f59e0b]" />
                <div className="w-3 h-3 rounded-full bg-[#10b981]/80 border border-[#10b981]" />
                <span className="ml-2 text-xs font-semibold text-white/80 tracking-wide flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
                  terminal@root-guard:~#
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                    isShutdown
                      ? "bg-red-950/60 border-red-500/40 text-red-400"
                      : "bg-[#00ff66]/15 border-[#00ff66]/30 text-[#00ff66]"
                  }`}
                >
                  {isShutdown ? "LOCKDOWN ACTIVE" : "LEVEL-5 ROOT"}
                </span>
              </div>
            </div>

            {/* Inner Content Area */}
            <div className="p-6 sm:p-8">
              {/* Header Title Section */}
              <div className="mb-6 text-center sm:text-left">
                <div
                  className={`inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded border mb-3 ${
                    isShutdown
                      ? "bg-red-950/50 border-red-500/30 text-red-400"
                      : "bg-[#00ff66]/10 border-[#00ff66]/25 text-[#00ff66]"
                  }`}
                >
                  {isShutdown ? (
                    <Power className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  ) : (
                    <Shield className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isShutdown
                      ? "SYSTEM SHUTDOWN ACTIVATED"
                      : "CLASSIFIED ACCESS PORTAL"}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  <span>LEON SIKHDER</span>
                  <span
                    className={`text-xs font-mono font-normal px-2 py-0.5 rounded border ${
                      isShutdown
                        ? "bg-red-950/60 text-red-400 border-red-500/30"
                        : "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/20"
                    }`}
                  >
                    KILL_SWITCH
                  </span>
                </h1>
                <p className="mt-1 text-xs text-white/50">
                  {isShutdown
                    ? "Mainframe traffic is currently DEFLECTED with HTTP 503. All backend APIs are frozen."
                    : "Authenticate identity to control the global kill switch and platform accessibility."}
                </p>
              </div>

              {accessGranted ? (
                /* ACCESS GRANTED STATE WITH KILL SWITCH CONTROLS */
                <div className="py-4 text-center space-y-5 animate-in fade-in zoom-in duration-300">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border shadow-lg ${
                      isShutdown
                        ? "bg-red-950/40 border-red-500/50 text-red-400 shadow-red-500/20"
                        : "bg-[#00ff66]/15 border-[#00ff66]/40 text-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.3)]"
                    }`}
                  >
                    {isShutdown ? (
                      <Power className="w-8 h-8 text-red-400 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 text-[#00ff66]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wider">
                      {isShutdown
                        ? "MAINFRAME LOCKDOWN ENGAGED"
                        : "ROOT ACCESS GRANTED: OPERATOR LEVEL-5"}
                    </h3>
                    <p
                      className={`text-xs mt-1 font-mono ${
                        isShutdown ? "text-red-400" : "text-[#00ff66]/80"
                      }`}
                    >
                      {isShutdown
                        ? "ALL API ENDPOINTS ARE RETURNING 503 (SERVICE UNAVAILABLE)"
                        : "Normal operations active. All incoming requests permitted."}
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-[#05070d] border border-white/10 text-left text-xs space-y-1.5 text-white/70">
                    <div className="flex justify-between">
                      <span className="text-white/40">Authenticated User:</span>
                      <span className="text-white font-semibold">{username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Mainframe Status:</span>
                      <span
                        className={`font-bold ${
                          isShutdown ? "text-red-400" : "text-[#00ff66]"
                        }`}
                      >
                        {isShutdown ? "HALTED // 503 DEFLECTION" : "LIVE // OPERATIONAL"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">API Target:</span>
                      <span className="text-[#00ff66]">POST /kill_switch</span>
                    </div>
                  </div>

                  {/* Direct Kill Switch Trigger Buttons */}
                  <div className="space-y-2 pt-2">
                    {isShutdown ? (
                      <button
                        type="button"
                        onClick={() => handleExecuteKillSwitch("restore")}
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#10b981] text-[#05070d] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,255,102,0.4)] hover:shadow-[0_0_35px_rgba(0,255,102,0.6)] transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4 text-[#05070d]" />
                        <span>RESTORE FULL SITE OPERATIONS</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleExecuteKillSwitch("shutdown")}
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_35px_rgba(239,68,68,0.6)] transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Power className="w-4 h-4 text-white animate-pulse" />
                        <span>ENGAGE KILL SWITCH (SHUT DOWN SITE)</span>
                      </button>
                    )}
                  </div>

                  {/* Secondary navigation */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                      to="/admin"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
                      Admin Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleResetSession}
                      className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Lock Console
                    </button>
                  </div>
                </div>
              ) : (
                /* CREDENTIALS FORM */
                <form onSubmit={handleAccessRequest} className="space-y-4">
                  {/* Status Banner */}
                  {statusMessage && (
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                        statusMessage.includes("ERROR")
                          ? "bg-red-950/40 border-red-500/50 text-red-400"
                          : statusMessage.includes("CRITICAL")
                          ? "bg-red-950/50 border-red-500/50 text-red-300"
                          : "bg-[#00ff66]/10 border-[#00ff66]/30 text-[#00ff66]"
                      }`}
                    >
                      {statusMessage.includes("ERROR") ? (
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                      ) : (
                        <Binary className="w-4 h-4 shrink-0 text-[#00ff66] animate-spin" />
                      )}
                      <span className="font-semibold tracking-wide">{statusMessage}</span>
                    </div>
                  )}

                  {/* Username / Operator ID Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label
                        htmlFor="operator-handle"
                        className="text-white/80 font-semibold flex items-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5 text-[#00ff66]" />
                        OPERATOR ID / USERNAME
                      </label>
                      <span className="text-[10px] text-[#00ff66]/60 tracking-wider">
                        [REQUIRED]
                      </span>
                    </div>

                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-white/30 text-xs select-none pointer-events-none font-mono">
                        user@
                      </div>
                      <input
                        id="operator-handle"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="operator_handle"
                        autoComplete="off"
                        disabled={isLoading}
                        className="w-full bg-[#05070d] border border-white/10 focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] text-white pl-15 pr-4 py-3 rounded-xl text-sm placeholder:text-white/20 transition-all outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Password / Access Key Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label
                        htmlFor="security-token"
                        className="text-white/80 font-semibold flex items-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#00ff66]" />
                        ACCESS KEY / PASSWORD
                      </label>
                      <span className="text-[10px] text-[#00ff66]/60 tracking-wider">
                        [AES_CIPHER]
                      </span>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        id="security-token"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••••••"
                        autoComplete="current-password"
                        disabled={isLoading}
                        className="w-full bg-[#05070d] border border-white/10 focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] text-white pl-4 pr-11 py-3 rounded-xl text-sm placeholder:text-white/20 transition-all outline-none font-mono tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-white/40 hover:text-[#00ff66] transition-colors p-1"
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Live Cryptographic Hash Preview */}
                    <div className="flex items-center justify-between text-[10px] text-white/40 px-1 pt-0.5">
                      <span>SIGNATURE HASH:</span>
                      <span className="text-[#00ff66]/80 font-mono tracking-wider">
                        SHA256::{simulatedHash}
                      </span>
                    </div>
                  </div>

                  {/* Cyber Security Options */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1 text-xs">
                    {/* Stealth Proxy Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <input
                        type="checkbox"
                        checked={stealthMode}
                        onChange={(e) => setStealthMode(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#00ff66] rounded cursor-pointer"
                      />
                      <span>Stealth Proxy Tunnel</span>
                    </label>

                    {/* Remember Clearance */}
                    <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <input
                        type="checkbox"
                        checked={rememberClearance}
                        onChange={(e) => setRememberClearance(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#00ff66] rounded cursor-pointer"
                      />
                      <span>Persist Clearance</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`relative w-full mt-3 py-3.5 px-6 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 overflow-hidden transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group ${
                      isShutdown
                        ? "bg-gradient-to-r from-[#00ff66] via-[#10b981] to-[#00e5ff] text-[#05070d] shadow-[0_0_25px_rgba(0,255,102,0.3)] hover:shadow-[0_0_35px_rgba(0,255,102,0.5)]"
                        : "bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:shadow-[0_0_35px_rgba(239,68,68,0.5)]"
                    }`}
                  >
                    {/* Glowing highlight sweep */}
                    <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />

                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-current" />
                        <span>CONNECTING TO /kill_switch...</span>
                      </>
                    ) : isShutdown ? (
                      <>
                        <Zap className="w-4 h-4 text-current" />
                        <span>DEACTIVATE KILL SWITCH & RESTORE SITE</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4 text-current animate-pulse" />
                        <span>AUTHENTICATE & TOGGLE KILL SWITCH</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Integrated Terminal Telemetry Console */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] text-white/40 mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
                    <span>DIAGNOSTIC TELEMETRY LOG</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogs(INITIAL_LOGS)}
                    className="hover:text-[#00ff66] transition-colors"
                  >
                    Clear
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-[#05070d] border border-white/5 font-mono text-[11px] leading-relaxed space-y-1 max-h-28 overflow-y-auto select-none">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={
                        log.includes("[FAIL]") || log.includes("ERROR")
                          ? "text-red-400"
                          : log.includes("[SUCCESS]")
                          ? "text-[#00ff66] font-bold"
                          : log.includes("[+]")
                          ? "text-cyan-400"
                          : "text-white/50"
                      }
                    >
                      {log}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="text-[#00ff66] animate-pulse">
                      [+] Awaiting node handshake reply... _
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terminal Window Footer */}
            <div className="px-6 py-3 bg-[#0d131f]/90 border-t border-[#00ff66]/15 flex items-center justify-between text-[11px] text-white/40">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#00ff66]" />
                END-TO-END QUANTUM PROTECTION
              </span>
              <Link
                to="/"
                className="text-white/50 hover:text-[#00ff66] transition-colors flex items-center gap-1"
              >
                <span>[ ABORT & RETURN ]</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Cyberpunk Footer Note */}
      <footer className="relative z-10 py-4 px-6 border-t border-white/5 text-center text-xs text-white/30">
        <p className="tracking-wider">
          CLASSIFIED MAINFRAME // AUTHORIZED OPERATOR ACCESS ONLY // SECURE PROTOCOL 8.9.1
        </p>
      </footer>
    </div>
  );
};

export default LeonSikhder;