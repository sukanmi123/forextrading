import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  BarChart2,
  Settings,
  Bell,
  Zap,
  LogOut,
  LogIn,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: Zap, label: "Home", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: TrendingUp, label: "Terminal", path: "/terminal" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
  { icon: BarChart2, label: "Markets", path: "/markets" },
];

const bottomItems = [
  { icon: Bell, label: "Notifications", path: "#" },
  { icon: Settings, label: "Settings", path: "#" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-14 flex flex-col items-center py-4 z-50"
      style={{ background: "rgba(10,10,26,0.95)", borderRight: "1px solid rgba(79,70,229,0.15)" }}>
      {/* Logo */}
      <div className="mb-6 flex items-center justify-center w-9 h-9 rounded-xl bg-[#4f46e5] shadow-lg" style={{ boxShadow: "0 0 18px rgba(79,70,229,0.5)" }}>
        <Zap size={18} className="text-white" fill="white" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Tooltip key={path}>
              <TooltipTrigger asChild>
                <Link
                  to={path}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-[#4f46e5] text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  style={active ? { boxShadow: "0 0 14px rgba(79,70,229,0.5)" } : {}}
                >
                  <Icon size={18} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs bg-[#141432] border-[rgba(79,70,229,0.3)] text-slate-200">
                {label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1">
        {bottomItems.map(({ icon: Icon, label, path }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Link
                to={path}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
              >
                <Icon size={18} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs bg-[#141432] border-[rgba(79,70,229,0.3)] text-slate-200">
              {label}
            </TooltipContent>
          </Tooltip>
        ))}

        {isAuthenticated ? (
          <>
            {/* Logout button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-200"
                >
                  <LogOut size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs bg-[#141432] border-[rgba(79,70,229,0.3)] text-slate-200">
                Sign Out
              </TooltipContent>
            </Tooltip>
            {/* User Avatar */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-2 w-8 h-8 rounded-full overflow-hidden border-2 border-[#4f46e5] cursor-pointer" style={{ boxShadow: "0 0 10px rgba(79,70,229,0.5)" }}>
                  <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs bg-[#141432] border-[rgba(79,70,229,0.3)] text-slate-200">
                {user?.name}
              </TooltipContent>
            </Tooltip>
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/login"
                className="mt-2 w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10 transition-all duration-200"
              >
                <LogIn size={18} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs bg-[#141432] border-[rgba(79,70,229,0.3)] text-slate-200">
              Sign In
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}