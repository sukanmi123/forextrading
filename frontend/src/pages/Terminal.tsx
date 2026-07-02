import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { ChevronDown, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

// --- Data generators ---
function generateChartData(count = 60) {
  let price = 67800;
  return Array.from({ length: count }, (_, i) => {
    price *= 1 + (Math.random() - 0.5) * 0.008;
    const open = price;
    const close = price * (1 + (Math.random() - 0.5) * 0.004);
    const high = Math.max(open, close) * (1 + Math.random() * 0.003);
    const low = Math.min(open, close) * (1 - Math.random() * 0.003);
    return {
      time: `${String(Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`,
      price: parseFloat(price.toFixed(2)),
      open: parseFloat(open.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      volume: Math.floor(Math.random() * 500 + 100),
    };
  });
}

function generateOrderBook() {
  const mid = 67842.3;
  const asks = Array.from({ length: 12 }, (_, i) => ({
    price: parseFloat((mid + (i + 1) * 4.2 + Math.random() * 2).toFixed(2)),
    amount: parseFloat((Math.random() * 2.5 + 0.1).toFixed(4)),
    total: 0,
    depth: Math.random() * 100,
  })).reverse();
  const bids = Array.from({ length: 12 }, (_, i) => ({
    price: parseFloat((mid - (i + 1) * 4.2 - Math.random() * 2).toFixed(2)),
    amount: parseFloat((Math.random() * 2.5 + 0.1).toFixed(4)),
    total: 0,
    depth: Math.random() * 100,
  }));
  asks.forEach(a => { a.total = parseFloat((a.price * a.amount).toFixed(2)); });
  bids.forEach(b => { b.total = parseFloat((b.price * b.amount).toFixed(2)); });
  return { asks, bids, mid };
}

function generateOpenOrders() {
  return [
    { id: "ORD-4821", pair: "BTC/USDT", type: "LIMIT", side: "BUY", amount: 0.05, price: 66500, filled: 0, time: "14:31:20" },
    { id: "ORD-4820", pair: "ETH/USDT", type: "LIMIT", side: "SELL", amount: 2.0, price: 3600, filled: 45, time: "14:28:05" },
    { id: "ORD-4818", pair: "SOL/USDT", type: "STOP", side: "SELL", amount: 20, price: 178, filled: 0, time: "13:55:12" },
  ];
}

const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT"];

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="rounded-xl p-3 text-xs" style={{ background: "#141432", border: "1px solid rgba(79,70,229,0.3)" }}>
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-white font-medium">Price: <span className="text-[#4f46e5]">${d?.price?.toLocaleString()}</span></p>
      <p className="text-slate-400">Vol: {d?.volume}</p>
    </div>
  );
};

export default function Terminal() {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [showPairDropdown, setShowPairDropdown] = useState(false);
  const [chartData, setChartData] = useState(generateChartData(60));
  const [orderBook, setOrderBook] = useState(generateOrderBook());
  const [activeTab, setActiveTab] = useState<"orders" | "history" | "funds">("orders");
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy");
  const [tradeAmount, setTradeAmount] = useState("0.00");
  const [tradePrice, setTradePrice] = useState("67842.30");
  const [tradePercent, setTradePercent] = useState(0);
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");

  const pairStats = {
    "BTC/USDT": { price: 67842.3, change: 2.41, high: 68920, low: 66100, vol: "2.41B" },
    "ETH/USDT": { price: 3512.8, change: 1.87, high: 3580, low: 3421, vol: "891M" },
    "SOL/USDT": { price: 182.4, change: -0.92, high: 188, low: 179, vol: "312M" },
    "BNB/USDT": { price: 421.6, change: 3.12, high: 428, low: 410, vol: "145M" },
    "XRP/USDT": { price: 0.6231, change: -1.45, high: 0.641, low: 0.612, vol: "89M" },
  };

  const stats = pairStats[selectedPair as keyof typeof pairStats];

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook());
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const last = prev[prev.length - 1];
        const newPrice = last.price * (1 + (Math.random() - 0.5) * 0.003);
        return [...prev.slice(1), {
          time: new Date().toTimeString().slice(0, 5),
          price: parseFloat(newPrice.toFixed(2)),
          open: last.close,
          close: parseFloat(newPrice.toFixed(2)),
          high: parseFloat((newPrice * 1.002).toFixed(2)),
          low: parseFloat((newPrice * 0.998).toFixed(2)),
          volume: Math.floor(Math.random() * 500 + 100),
        }];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handlePercentClick = (pct: number) => {
    setTradePercent(pct);
    const balance = 5000;
    const cost = (balance * pct) / 100;
    const price = parseFloat(tradePrice) || stats.price;
    setTradeAmount((cost / price).toFixed(6));
  };

  const openOrders = generateOpenOrders();
  const tradeHistory = [
    { pair: "BTC/USDT", side: "BUY", price: 67210, amount: 0.042, total: 2824.02, time: "14:32:11", fee: "2.82" },
    { pair: "ETH/USDT", side: "SELL", price: 3498, amount: 1.5, total: 5247, time: "13:58:47", fee: "5.25" },
    { pair: "SOL/USDT", side: "BUY", price: 181.2, amount: 10, total: 1812, time: "12:41:03", fee: "1.81" },
  ];
  const funds = [
    { coin: "USDT", free: 5284.21, locked: 3325.00, total: 8609.21 },
    { coin: "BTC", free: 0.5231, locked: 0.05, total: 0.5731 },
    { coin: "ETH", free: 6.82, locked: 2.0, total: 8.82 },
    { coin: "SOL", free: 57.4, locked: 20, total: 77.4 },
  ];

  return (
    <AppLayout noPadding>
      <div className="h-[calc(100vh-48px)] flex flex-col overflow-hidden">
        {/* ===== TICKER BAR ===== */}
        <div className="flex items-center gap-4 px-4 py-2 shrink-0 overflow-x-auto nx-scrollbar"
          style={{ background: "rgba(14,14,36,0.95)", borderBottom: "1px solid rgba(79,70,229,0.15)" }}>
          {/* Pair Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowPairDropdown(!showPairDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-white"
              style={{ background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.3)" }}
            >
              <span style={{ fontFamily: "'Sora', sans-serif" }}>{selectedPair}</span>
              <ChevronDown size={14} />
            </button>
            {showPairDropdown && (
              <div className="absolute top-9 left-0 w-36 rounded-xl py-1 z-50 shadow-xl"
                style={{ background: "#141432", border: "1px solid rgba(79,70,229,0.3)" }}>
                {pairs.map(p => (
                  <button key={p} onClick={() => { setSelectedPair(p); setShowPairDropdown(false); }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium">
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="shrink-0">
            <div className={`text-lg font-bold ${stats.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`} style={{ fontFamily: "'Sora', sans-serif" }}>
              ${stats.price.toLocaleString()}
            </div>
            <div className={`text-xs flex items-center gap-1 ${stats.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
              {stats.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {stats.change >= 0 ? "+" : ""}{stats.change}%
            </div>
          </div>

          <div className="h-8 w-px shrink-0" style={{ background: "rgba(79,70,229,0.2)" }} />

          {[
            { label: "24h High", value: `$${stats.high.toLocaleString()}` },
            { label: "24h Low", value: `$${stats.low.toLocaleString()}` },
            { label: "24h Volume", value: stats.vol },
          ].map(s => (
            <div key={s.label} className="shrink-0">
              <div className="text-xs text-slate-600">{s.label}</div>
              <div className="text-xs font-semibold text-slate-200">{s.value}</div>
            </div>
          ))}

          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            <RefreshCw size={12} className="text-[#4f46e5] animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-xs text-slate-600">Live</span>
          </div>
        </div>

        {/* ===== MAIN TRADING AREA ===== */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* LEFT: Chart */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ borderRight: "1px solid rgba(79,70,229,0.12)" }}>
            {/* Chart */}
            <div className="flex-1 p-3 min-h-0">
              <div className="h-full glass-card rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400">Price Chart · {selectedPair}</span>
                  <div className="flex gap-1">
                    {["15m", "1h", "4h", "1d"].map(t => (
                      <button key={t} className={`text-xs px-2 py-0.5 rounded transition-all ${t === "1h" ? "bg-[#4f46e5] text-white" : "text-slate-600 hover:text-slate-300"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} interval={9} />
                    <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} width={50} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={2} fill="url(#chartGrad)" dot={false} activeDot={{ r: 4, fill: "#4f46e5" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Tab Panel */}
            <div className="h-44 shrink-0 flex flex-col" style={{ borderTop: "1px solid rgba(79,70,229,0.12)" }}>
              {/* Tabs */}
              <div className="flex items-center px-3 pt-2 gap-1 shrink-0">
                {(["orders", "history", "funds"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${activeTab === tab ? "bg-[#4f46e5] text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
                    {tab === "orders" ? "Open Orders" : tab === "history" ? "Trade History" : "Funds"}
                    {tab === "orders" && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/10 text-white text-xs">{openOrders.length}</span>}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto nx-scrollbar px-3 pb-2 mt-2">
                {activeTab === "orders" && (
                  <table className="w-full text-xs min-w-[500px]">
                    <thead>
                      <tr className="text-slate-600 border-b" style={{ borderColor: "rgba(79,70,229,0.1)" }}>
                        <th className="text-left pb-1.5 font-medium">Order ID</th>
                        <th className="text-left pb-1.5 font-medium">Pair</th>
                        <th className="text-left pb-1.5 font-medium">Type</th>
                        <th className="text-left pb-1.5 font-medium">Side</th>
                        <th className="text-right pb-1.5 font-medium">Price</th>
                        <th className="text-right pb-1.5 font-medium">Amount</th>
                        <th className="text-right pb-1.5 font-medium">Filled</th>
                        <th className="text-right pb-1.5 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {openOrders.map(o => (
                        <tr key={o.id} className="border-b" style={{ borderColor: "rgba(79,70,229,0.06)" }}>
                          <td className="py-1.5 text-slate-500 font-mono">{o.id}</td>
                          <td className="py-1.5 font-semibold text-slate-200">{o.pair}</td>
                          <td className="py-1.5 text-slate-400">{o.type}</td>
                          <td className="py-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${o.side === "BUY" ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#ef4444]/10 text-[#ef4444]"}`}>
                              {o.side}
                            </span>
                          </td>
                          <td className="py-1.5 text-right text-slate-200">${o.price.toLocaleString()}</td>
                          <td className="py-1.5 text-right text-slate-300">{o.amount}</td>
                          <td className="py-1.5 text-right text-slate-500">{o.filled}%</td>
                          <td className="py-1.5 text-right">
                            <button className="text-[#ef4444] hover:text-red-300 text-xs transition-colors">Cancel</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {activeTab === "history" && (
                  <table className="w-full text-xs min-w-[500px]">
                    <thead>
                      <tr className="text-slate-600 border-b" style={{ borderColor: "rgba(79,70,229,0.1)" }}>
                        <th className="text-left pb-1.5 font-medium">Pair</th>
                        <th className="text-left pb-1.5 font-medium">Side</th>
                        <th className="text-right pb-1.5 font-medium">Price</th>
                        <th className="text-right pb-1.5 font-medium">Amount</th>
                        <th className="text-right pb-1.5 font-medium">Total</th>
                        <th className="text-right pb-1.5 font-medium">Fee</th>
                        <th className="text-right pb-1.5 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradeHistory.map((t, i) => (
                        <tr key={i} className="border-b" style={{ borderColor: "rgba(79,70,229,0.06)" }}>
                          <td className="py-1.5 font-semibold text-slate-200">{t.pair}</td>
                          <td className="py-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${t.side === "BUY" ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#ef4444]/10 text-[#ef4444]"}`}>
                              {t.side}
                            </span>
                          </td>
                          <td className="py-1.5 text-right text-slate-200">${t.price.toLocaleString()}</td>
                          <td className="py-1.5 text-right text-slate-300">{t.amount}</td>
                          <td className="py-1.5 text-right text-slate-200">${t.total.toLocaleString()}</td>
                          <td className="py-1.5 text-right text-slate-500">${t.fee}</td>
                          <td className="py-1.5 text-right text-slate-600">{t.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {activeTab === "funds" && (
                  <table className="w-full text-xs min-w-[400px]">
                    <thead>
                      <tr className="text-slate-600 border-b" style={{ borderColor: "rgba(79,70,229,0.1)" }}>
                        <th className="text-left pb-1.5 font-medium">Asset</th>
                        <th className="text-right pb-1.5 font-medium">Free</th>
                        <th className="text-right pb-1.5 font-medium">Locked</th>
                        <th className="text-right pb-1.5 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funds.map(f => (
                        <tr key={f.coin} className="border-b" style={{ borderColor: "rgba(79,70,229,0.06)" }}>
                          <td className="py-1.5 font-semibold text-slate-200" style={{ fontFamily: "'Sora', sans-serif" }}>{f.coin}</td>
                          <td className="py-1.5 text-right text-[#22c55e]">{f.free}</td>
                          <td className="py-1.5 text-right text-slate-500">{f.locked}</td>
                          <td className="py-1.5 text-right text-slate-200 font-medium">{f.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Book + Trade Panel */}
          <div className="w-64 xl:w-72 flex flex-col shrink-0 overflow-hidden">
            {/* Order Book */}
            <div className="flex-1 flex flex-col overflow-hidden p-2" style={{ borderBottom: "1px solid rgba(79,70,229,0.12)" }}>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-slate-400">Order Book</span>
                <div className="flex gap-1.5 text-xs">
                  <span className="text-[#ef4444]">Asks</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-[#22c55e]">Bids</span>
                </div>
              </div>

              {/* Header */}
              <div className="grid grid-cols-3 text-xs text-slate-600 px-1 mb-1 font-medium">
                <span>Price</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Total</span>
              </div>

              {/* Asks */}
              <div className="flex-1 overflow-y-auto nx-scrollbar flex flex-col-reverse">
                {orderBook.asks.slice(0, 10).map((ask, i) => (
                  <div key={i} className="relative grid grid-cols-3 text-xs px-1 py-0.5 group hover:bg-[#ef4444]/5 transition-colors cursor-pointer">
                    <div className="absolute inset-y-0 right-0 depth-bar-red" style={{ width: `${ask.depth}%` }} />
                    <span className="relative z-10 text-[#ef4444] font-medium" style={{ fontFamily: "'Manrope', sans-serif" }}>${ask.price.toFixed(2)}</span>
                    <span className="relative z-10 text-right text-slate-300">{ask.amount.toFixed(4)}</span>
                    <span className="relative z-10 text-right text-slate-500">{ask.total.toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {/* Mid Price */}
              <div className="py-1.5 px-1 flex items-center gap-2 my-1 rounded" style={{ background: "rgba(79,70,229,0.08)" }}>
                <span className={`text-sm font-bold ${stats.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`} style={{ fontFamily: "'Sora', sans-serif" }}>
                  ${orderBook.mid.toFixed(2)}
                </span>
                {stats.change >= 0 ? <TrendingUp size={12} className="text-[#22c55e]" /> : <TrendingDown size={12} className="text-[#ef4444]" />}
              </div>

              {/* Bids */}
              <div className="flex-1 overflow-y-auto nx-scrollbar">
                {orderBook.bids.slice(0, 10).map((bid, i) => (
                  <div key={i} className="relative grid grid-cols-3 text-xs px-1 py-0.5 hover:bg-[#22c55e]/5 transition-colors cursor-pointer">
                    <div className="absolute inset-y-0 left-0 depth-bar-green" style={{ width: `${bid.depth}%` }} />
                    <span className="relative z-10 text-[#22c55e] font-medium" style={{ fontFamily: "'Manrope', sans-serif" }}>${bid.price.toFixed(2)}</span>
                    <span className="relative z-10 text-right text-slate-300">{bid.amount.toFixed(4)}</span>
                    <span className="relative z-10 text-right text-slate-500">{bid.total.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade Panel */}
            <div className="p-3 shrink-0">
              {/* Buy/Sell Toggle */}
              <div className="relative flex rounded-xl p-1 mb-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(79,70,229,0.15)" }}>
                <div
                  className="absolute inset-y-1 rounded-lg transition-all duration-300"
                  style={{
                    background: tradeMode === "buy" ? "#22c55e" : "#ef4444",
                    left: tradeMode === "buy" ? "4px" : "calc(50%)",
                    width: "calc(50% - 4px)",
                    boxShadow: tradeMode === "buy" ? "0 0 12px rgba(34,197,94,0.4)" : "0 0 12px rgba(239,68,68,0.4)",
                  }}
                />
                <button onClick={() => setTradeMode("buy")} className={`relative z-10 flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${tradeMode === "buy" ? "text-white" : "text-slate-500"}`}>
                  BUY
                </button>
                <button onClick={() => setTradeMode("sell")} className={`relative z-10 flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${tradeMode === "sell" ? "text-white" : "text-slate-500"}`}>
                  SELL
                </button>
              </div>

              {/* Order Type */}
              <div className="flex gap-1 mb-3">
                {(["limit", "market"] as const).map(t => (
                  <button key={t} onClick={() => setOrderType(t)}
                    className={`flex-1 py-1 text-xs font-medium rounded-lg transition-all capitalize ${orderType === t ? "text-[#4f46e5] border-[#4f46e5]" : "text-slate-600 border-transparent"}`}
                    style={{ border: "1px solid", borderColor: orderType === t ? "rgba(79,70,229,0.6)" : "rgba(79,70,229,0.15)" }}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Price input */}
              {orderType === "limit" && (
                <div className="mb-2">
                  <label className="text-xs text-slate-600 mb-1 block">Price (USDT)</label>
                  <input
                    type="number"
                    value={tradePrice}
                    onChange={e => setTradePrice(e.target.value)}
                    className="w-full rounded-lg px-2.5 py-2 text-xs text-white bg-transparent outline-none"
                    style={{ border: "1px solid rgba(79,70,229,0.25)", background: "rgba(255,255,255,0.03)" }}
                  />
                </div>
              )}

              {/* Amount input */}
              <div className="mb-3">
                <label className="text-xs text-slate-600 mb-1 block">Amount ({selectedPair.split("/")[0]})</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={e => setTradeAmount(e.target.value)}
                  className="w-full rounded-lg px-2.5 py-2 text-xs text-white bg-transparent outline-none"
                  style={{ border: "1px solid rgba(79,70,229,0.25)", background: "rgba(255,255,255,0.03)" }}
                />
              </div>

              {/* Percent Sliders */}
              <div className="grid grid-cols-4 gap-1 mb-3">
                {[25, 50, 75, 100].map(pct => (
                  <button key={pct} onClick={() => handlePercentClick(pct)}
                    className="py-1 text-xs rounded-lg transition-all font-medium"
                    style={{
                      border: `1px solid ${tradePercent === pct ? "rgba(79,70,229,0.6)" : "rgba(79,70,229,0.2)"}`,
                      background: tradePercent === pct ? "rgba(79,70,229,0.2)" : "transparent",
                      color: tradePercent === pct ? "#a5b4fc" : "#64748b",
                    }}>
                    {pct}%
                  </button>
                ))}
              </div>

              {/* Avail balance */}
              <div className="flex justify-between text-xs text-slate-600 mb-3">
                <span>Available</span>
                <span className="text-slate-400">5,284.21 USDT</span>
              </div>

              {/* Submit */}
              <button
                className={`w-full py-2.5 rounded-xl text-white text-xs font-bold transition-all ${tradeMode === "buy" ? "bg-[#22c55e] glow-btn-green" : "bg-[#ef4444] glow-btn-red"}`}
                style={{ boxShadow: tradeMode === "buy" ? "0 0 0 rgba(34,197,94,0)" : "0 0 0 rgba(239,68,68,0)" }}
              >
                {tradeMode === "buy" ? "BUY" : "SELL"} {selectedPair.split("/")[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}