import { ChevronRight, Wifi, Circle, LogOut, LogIn, User } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const breadcrumbMap: Record<string, string[]> = {
  "/": ["Nexus Crypto", "Home"],
  "/dashboard": ["Nexus Crypto", "Dashboard"],
  "/terminal": ["Nexus Crypto", "Terminal", "BTC/USDT"],
  "/wallet": ["Nexus Crypto", "Wallet"],
  "/markets": ["Nexus Crypto", "Markets"],
  "/login": ["Nexus Crypto", "Sign In"],
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const crumbs = breadcrumbMap[location.pathname] || ["Nexus Crypto"];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className="fixed top-0 left-14 right-0 h-12 flex items-center justify-between px-4 z-40"
      style={{ background: "rgba(10,10,26,0.95)", borderBottom: "1px solid rgba(79,70,229,0.15)" }}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-xs font-medium" style={{ fontFamily: "'Manrope', sans-serif" }}>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="text-slate-600" />}
            <span className={i === crumbs.length - 1 ? "text-slate-200" : "text-slate-500"}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Network Status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <Wifi size={12} className="text-[#22c55e]" />
          <span>Mainnet</span>
        </div>

        {isAuthenticated && user ? (
          <>
            {/* Portfolio balance */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg glass-card">
              <span className="text-xs text-slate-400">Portfolio</span>
              <span className="text-xs font-semibold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{user.portfolio}</span>
              <span className="text-xs text-[#22c55e]">+3.21%</span>
            </div>

            {/* Connection dot */}
            <div className="flex items-center gap-1.5">
              <Circle size={7} className="fill-[#22c55e] text-[#22c55e]" style={{ filter: "drop-shadow(0 0 4px #22c55e)" }} />
              <span className="text-xs text-slate-500 hidden sm:block">Connected</span>
            </div>

            {/* User name */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300">
              <User size={12} className="text-slate-500" />
              <span>{user.name}</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-[#ef4444] transition-all hover:bg-[#ef4444]/10"
              title="Sign out"
            >
              <LogOut size={13} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </>
        ) : (
          <>
            {/* Connection dot - offline style */}
            <div className="flex items-center gap-1.5">
              <Circle size={7} className="fill-slate-600 text-slate-600" />
              <span className="text-xs text-slate-600 hidden sm:block">Not signed in</span>
            </div>

            {/* Login button */}
            <Link to="/login">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 0 12px rgba(79,70,229,0.35)" }}>
                <LogIn size={13} />
                Sign In
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}