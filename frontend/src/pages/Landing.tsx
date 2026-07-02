import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, BarChart2, TrendingUp, ChevronRight, Globe, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LiveTicker from "@/components/LiveTicker";
import QuickBuyWidget from "@/components/QuickBuyWidget";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const miniChartData = Array.from({ length: 20 }, (_, i) => ({
  v: 60000 + Math.sin(i * 0.5) * 5000 + Math.random() * 2000,
}));

const stats = [
  { label: "24h Volume", value: "$4.2B", change: "+12.4%" },
  { label: "Active Traders", value: "182K", change: "+8.1%" },
  { label: "Listed Assets", value: "850+", change: "" },
  { label: "Countries", value: "120+", change: "" },
];

const features = [
  {
    icon: Zap,
    title: "Ultra-Low Latency",
    desc: "Sub-millisecond order execution with our high-frequency trading engine built for professionals.",
  },
  {
    icon: Shield,
    title: "Institutional Security",
    desc: "Multi-layer custody with cold storage, 2FA, and real-time threat monitoring.",
  },
  {
    icon: BarChart2,
    title: "Advanced Analytics",
    desc: "Comprehensive charting suite with 100+ technical indicators and custom drawing tools.",
  },
  {
    icon: Globe,
    title: "Global Liquidity",
    desc: "Deep order books aggregated from top liquidity providers ensuring best-price execution.",
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleOpenTerminal = () => {
    if (isAuthenticated) navigate("/terminal");
    else navigate("/login");
  };

  const handleViewDashboard = () => {
    if (isAuthenticated) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      <TopBar />

      <main className="ml-14 mt-12">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-48px)] flex flex-col">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
          </div>

          <div className="relative flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-16 max-w-7xl mx-auto w-full">
            {/* Left - Hero Text */}
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-medium text-[#4f46e5]" style={{ background: "rgba(79,70,229,0.12)", border: "1px solid rgba(79,70,229,0.3)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                Live Markets Open · 850+ Assets
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                Trade the Future
                <br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #4f46e5, #7c3aed, #a855f7)" }}>
                  With Precision
                </span>
              </h1>

              <p className="text-base text-slate-400 mb-8 leading-relaxed max-w-lg" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Nexus Crypto delivers institutional-grade trading infrastructure for professional traders. Deep liquidity, sub-ms execution, and a terminal built for the most demanding market conditions.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleOpenTerminal}
                  className="px-6 py-3 rounded-xl bg-[#4f46e5] text-white text-sm font-semibold flex items-center gap-2 glow-btn transition-all hover:opacity-90"
                  style={{ boxShadow: "0 0 20px rgba(79,70,229,0.4)" }}
                >
                  Open Terminal <ArrowRight size={16} />
                </button>
                <button
                  onClick={handleViewDashboard}
                  className="px-6 py-3 rounded-xl text-slate-300 text-sm font-semibold flex items-center gap-2 transition-all hover:text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(79,70,229,0.2)" }}
                >
                  View Dashboard <ChevronRight size={16} />
                </button>
                {!isAuthenticated && (
                  <Link to="/login">
                    <button className="px-6 py-3 rounded-xl text-[#4f46e5] text-sm font-semibold flex items-center gap-2 transition-all hover:text-[#7c6ef7]"
                      style={{ background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.25)" }}>
                      <LogIn size={16} /> Sign In
                    </button>
                  </Link>
                )}
              </div>

              {/* Stats row */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map(s => (
                  <div key={s.label} className="glass-card rounded-xl p-3">
                    <div className="text-lg font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                    {s.change && <div className="text-xs text-[#22c55e] mt-0.5">{s.change}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Glass card with widget + mini chart */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <QuickBuyWidget />

              {/* BTC mini chart */}
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>BTC/USDT</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] font-medium">+2.41%</span>
                    </div>
                    <span className="text-xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>$67,842.30</span>
                  </div>
                  <TrendingUp size={20} className="text-[#22c55e]" />
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={miniChartData}>
                    <defs>
                      <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#4f46e5" strokeWidth={2} fill="url(#miniGrad)" dot={false} />
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="text-xs text-white px-2 py-1 rounded" style={{ background: "#141432", border: "1px solid rgba(79,70,229,0.3)" }}>
                            ${payload[0].value?.toLocaleString()}
                          </div>
                        ) : null
                      }
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Ticker */}
          <LiveTicker />
        </section>

        {/* Features */}
        <section className="px-6 py-20 max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
              Built for Professionals
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Every feature is engineered to give serious traders the edge they need in volatile markets.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => (
              <div key={f.title} className="glass-card-hover rounded-2xl p-5 cursor-default">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.25)" }}>
                  <f.icon size={18} className="text-[#4f46e5]" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t px-6 py-8 max-w-7xl mx-auto w-full" style={{ borderColor: "rgba(79,70,229,0.15)" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#4f46e5] flex items-center justify-center">
                <Zap size={14} className="text-white" fill="white" />
              </div>
              <span className="text-sm font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Nexus Crypto</span>
              <span className="text-xs text-slate-600 ml-2">© 2024 All rights reserved</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">API Docs</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}