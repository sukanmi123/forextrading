import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, ArrowRight, Shield, TrendingUp, BarChart2, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const miniStats = [
  { label: "24h Volume", value: "$4.2B" },
  { label: "Assets", value: "850+" },
  { label: "Traders", value: "182K" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"login" | "register">("login");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regShowPw, setRegShowPw] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!regName || !regEmail || !regPassword || !regConfirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (regPassword !== regConfirm) {
      setError("Passwords do not match.");
      return;
    }
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await login(regEmail, regPassword);
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    await login("demo@nexuscrypto.io", "demo1234");
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex overflow-hidden">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col w-[52%] relative overflow-hidden">
        {/* BG layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 40%, #0f0f30 100%)" }} />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-2xl" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(79,70,229,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4f46e5] flex items-center justify-center" style={{ boxShadow: "0 0 20px rgba(79,70,229,0.6)" }}>
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Nexus Crypto</span>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-medium text-[#4f46e5] w-fit" style={{ background: "rgba(79,70,229,0.12)", border: "1px solid rgba(79,70,229,0.3)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              Live Markets Open · 850+ Assets
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
              Trade the Future
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #4f46e5, #7c3aed, #a855f7)" }}>
                With Precision
              </span>
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-10" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Institutional-grade trading infrastructure for professional traders. Deep liquidity, sub-millisecond execution, and advanced charting tools.
            </p>

            {/* Features list */}
            <div className="space-y-4 mb-10">
              {[
                { icon: Shield, text: "Multi-layer security with cold storage & 2FA" },
                { icon: TrendingUp, text: "Sub-ms order execution & deep liquidity" },
                { icon: BarChart2, text: "100+ technical indicators & custom tools" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.25)" }}>
                    <Icon size={14} className="text-[#4f46e5]" />
                  </div>
                  <span className="text-sm text-slate-300">{text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              {miniStats.map(s => (
                <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(79,70,229,0.15)" }}>
                  <div className="text-lg font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-xs text-slate-600">© 2024 Nexus Crypto. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0" style={{ background: "rgba(10,10,26,0.97)" }} />

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-xl bg-[#4f46e5] flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Nexus Crypto</span>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-8" style={{ background: "rgba(20,20,50,0.8)", border: "1px solid rgba(79,70,229,0.2)", backdropFilter: "blur(20px)" }}>
            {/* Tabs */}
            <div className="flex rounded-xl p-1 mb-8" style={{ background: "rgba(255,255,255,0.04)" }}>
              <button
                onClick={() => { setTab("login"); setError(""); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === "login" ? "bg-[#4f46e5] text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                style={tab === "login" ? { boxShadow: "0 0 14px rgba(79,70,229,0.4)" } : {}}
              >
                Sign In
              </button>
              <button
                onClick={() => { setTab("register"); setError(""); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === "register" ? "bg-[#4f46e5] text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                style={tab === "register" ? { boxShadow: "0 0 14px rgba(79,70,229,0.4)" } : {}}
              >
                Create Account
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl text-sm text-[#ef4444]" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {tab === "login" ? (
              /* --- LOGIN FORM --- */
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="trader@example.com"
                      className="w-full pl-9 pr-4 py-3 text-sm text-white rounded-xl outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(79,70,229,0.2)" }}
                      onFocus={e => (e.target.style.borderColor = "rgba(79,70,229,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(79,70,229,0.2)")}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-400">Password</label>
                    <button type="button" className="text-xs text-[#4f46e5] hover:text-[#7c6ef7] transition-colors">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-3 text-sm text-white rounded-xl outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(79,70,229,0.2)" }}
                      onFocus={e => (e.target.style.borderColor = "rgba(79,70,229,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(79,70,229,0.2)")}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-3.5 h-3.5 accent-[#4f46e5]" />
                  <label htmlFor="remember" className="text-xs text-slate-400">Remember me for 30 days</label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: loading ? "rgba(79,70,229,0.6)" : "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: loading ? "none" : "0 0 20px rgba(79,70,229,0.4)" }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight size={14} /></>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <span className="text-xs text-slate-600">or</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                </div>

                {/* Demo Login */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-medium text-slate-300 flex items-center justify-center gap-2 transition-all hover:text-white disabled:opacity-60"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(79,70,229,0.2)" }}
                >
                  <Zap size={14} className="text-[#4f46e5]" />
                  Try Demo Account
                </button>
              </form>
            ) : (
              /* --- REGISTER FORM --- */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full px-4 py-3 text-sm text-white rounded-xl outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(79,70,229,0.2)" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(79,70,229,0.6)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(79,70,229,0.2)")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="trader@example.com"
                      className="w-full pl-9 pr-4 py-3 text-sm text-white rounded-xl outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(79,70,229,0.2)" }}
                      onFocus={e => (e.target.style.borderColor = "rgba(79,70,229,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(79,70,229,0.2)")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={regShowPw ? "text" : "password"}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-9 pr-10 py-3 text-sm text-white rounded-xl outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(79,70,229,0.2)" }}
                      onFocus={e => (e.target.style.borderColor = "rgba(79,70,229,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(79,70,229,0.2)")}
                    />
                    <button type="button" onClick={() => setRegShowPw(!regShowPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {regShowPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      value={regConfirm}
                      onChange={e => setRegConfirm(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-4 py-3 text-sm text-white rounded-xl outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(79,70,229,0.2)" }}
                      onFocus={e => (e.target.style.borderColor = "rgba(79,70,229,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(79,70,229,0.2)")}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input type="checkbox" id="agree" required className="w-3.5 h-3.5 mt-0.5 accent-[#4f46e5]" />
                  <label htmlFor="agree" className="text-xs text-slate-400 leading-relaxed">
                    I agree to the <span className="text-[#4f46e5] cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#4f46e5] cursor-pointer hover:underline">Privacy Policy</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: loading ? "rgba(79,70,229,0.6)" : "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: loading ? "none" : "0 0 20px rgba(79,70,229,0.4)" }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Back to home */}
          <div className="mt-5 text-center">
            <Link to="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}