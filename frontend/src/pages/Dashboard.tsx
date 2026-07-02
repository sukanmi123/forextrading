import AppLayout from "@/components/AppLayout";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, DollarSign, Percent, Activity } from "lucide-react";

const pnlData = [
  { date: "Jan", pnl: 42000, portfolio: 68000 },
  { date: "Feb", pnl: 45800, portfolio: 71200 },
  { date: "Mar", pnl: 41200, portfolio: 67000 },
  { date: "Apr", pnl: 53000, portfolio: 79500 },
  { date: "May", pnl: 58400, portfolio: 84200 },
  { date: "Jun", pnl: 55100, portfolio: 81600 },
  { date: "Jul", pnl: 63900, portfolio: 89300 },
  { date: "Aug", pnl: 71200, portfolio: 96700 },
  { date: "Sep", pnl: 68500, portfolio: 93500 },
  { date: "Oct", pnl: 75800, portfolio: 100200 },
  { date: "Nov", pnl: 72400, portfolio: 97800 },
  { date: "Dec", pnl: 84203, portfolio: 109700 },
];

const allocationData = [
  { name: "BTC", value: 42.3, color: "#f97316" },
  { name: "ETH", value: 28.7, color: "#8b5cf6" },
  { name: "SOL", value: 12.4, color: "#22c55e" },
  { name: "BNB", value: 8.2, color: "#eab308" },
  { name: "Others", value: 8.4, color: "#4f46e5" },
];

const topAssets = [
  { coin: "BTC", name: "Bitcoin", amount: 0.523, value: 35481.12, change: 2.41, color: "#f97316" },
  { coin: "ETH", name: "Ethereum", amount: 6.82, value: 23957.30, change: 1.87, color: "#8b5cf6" },
  { coin: "SOL", name: "Solana", amount: 57.4, value: 10469.76, change: -0.92, color: "#22c55e" },
  { coin: "BNB", name: "BNB", amount: 16.3, value: 6872.08, change: 3.12, color: "#eab308" },
  { coin: "XRP", name: "Ripple", amount: 8421, value: 5247.45, change: -1.45, color: "#06b6d4" },
];

const recentTrades = [
  { pair: "BTC/USDT", type: "BUY", amount: 0.042, price: 67210, total: 2824.02, time: "14:32:11", pnl: "+$142.80" },
  { pair: "ETH/USDT", type: "SELL", amount: 1.5, price: 3498, total: 5247.00, time: "13:58:47", pnl: "+$89.25" },
  { pair: "SOL/USDT", type: "BUY", amount: 10, price: 181.2, total: 1812.00, time: "12:41:03", pnl: "-$12.40" },
  { pair: "BNB/USDT", type: "BUY", amount: 2.5, price: 418.6, total: 1046.50, time: "11:22:38", pnl: "+$38.75" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl p-3 text-xs" style={{ background: "#141432", border: "1px solid rgba(79,70,229,0.3)" }}>
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: ${p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const kpis = [
  { label: "Total Portfolio", value: "$84,203.47", change: "+$2,631.20", pct: "+3.21%", icon: DollarSign, up: true },
  { label: "Today's PnL", value: "+$2,631.20", change: "vs yesterday", pct: "+3.21%", icon: TrendingUp, up: true },
  { label: "7d Return", value: "+$8,412.50", change: "vs last week", pct: "+11.09%", icon: Percent, up: true },
  { label: "Open Positions", value: "7", change: "3 profitable", pct: "42.8% win", icon: Activity, up: true },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {kpis.map(k => (
            <div key={k.label} className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500">{k.label}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(79,70,229,0.15)" }}>
                  <k.icon size={14} className="text-[#4f46e5]" />
                </div>
              </div>
              <div className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>{k.value}</div>
              <div className="flex items-center gap-1.5 text-xs">
                {k.up ? (
                  <ArrowUpRight size={12} className="text-[#22c55e]" />
                ) : (
                  <ArrowDownRight size={12} className="text-[#ef4444]" />
                )}
                <span className={k.up ? "text-[#22c55e]" : "text-[#ef4444]"}>{k.pct}</span>
                <span className="text-slate-600">{k.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* PnL Chart - 2/3 */}
          <div className="xl:col-span-2 glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Portfolio Performance</h3>
                <p className="text-xs text-slate-500 mt-0.5">PnL & Portfolio Value (YTD)</p>
              </div>
              <div className="flex gap-2">
                {["1W", "1M", "3M", "1Y"].map(t => (
                  <button key={t} className={`text-xs px-2.5 py-1 rounded-lg transition-all ${t === "1Y" ? "bg-[#4f46e5] text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={pnlData}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="portfolio" name="Portfolio" stroke="#4f46e5" strokeWidth={2} fill="url(#portfolioGrad)" dot={false} />
                <Area type="monotone" dataKey="pnl" name="PnL" stroke="#22c55e" strokeWidth={2} fill="url(#pnlGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation - 1/3 */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>Allocation</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {allocationData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="rounded-xl p-2 text-xs" style={{ background: "#141432", border: "1px solid rgba(79,70,229,0.3)" }}>
                        <span style={{ color: payload[0].payload.color }}>{payload[0].name}: {payload[0].value}%</span>
                      </div>
                    ) : null
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="space-y-2 mt-2">
              {allocationData.map(a => (
                <div key={a.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                    <span className="text-slate-400">{a.name}</span>
                  </div>
                  <span className="text-slate-200 font-medium">{a.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Top Assets */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>Holdings</h3>
            <div className="space-y-2.5">
              {topAssets.map(a => (
                <div key={a.coin} className="flex items-center gap-3 py-2 rounded-xl px-2 hover:bg-white/3 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: a.color + "33", border: `1px solid ${a.color}44` }}>
                    {a.coin.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{a.coin}</span>
                      <span className="text-sm font-semibold text-white">${a.value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-slate-500">{a.amount} {a.coin}</span>
                      <span className={`text-xs font-medium ${a.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                        {a.change >= 0 ? "+" : ""}{a.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Recent Trades</h3>
              <button className="text-xs text-[#4f46e5] hover:text-[#7c6ef7] transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto nx-scrollbar">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="text-xs text-slate-600">
                    <th className="text-left pb-2 font-medium">Pair</th>
                    <th className="text-left pb-2 font-medium">Type</th>
                    <th className="text-right pb-2 font-medium">Amount</th>
                    <th className="text-right pb-2 font-medium">PnL</th>
                    <th className="text-right pb-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((t, i) => (
                    <tr key={i} className="border-t text-xs" style={{ borderColor: "rgba(79,70,229,0.08)" }}>
                      <td className="py-2.5 font-semibold text-slate-200" style={{ fontFamily: "'Sora', sans-serif" }}>{t.pair}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.type === "BUY" ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#ef4444]/10 text-[#ef4444]"}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-slate-300">${t.total.toLocaleString()}</td>
                      <td className={`py-2.5 text-right font-medium ${t.pnl.startsWith("+") ? "text-[#22c55e]" : "text-[#ef4444]"}`}>{t.pnl}</td>
                      <td className="py-2.5 text-right text-slate-600">{t.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}