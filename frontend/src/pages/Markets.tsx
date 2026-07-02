import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { TrendingUp, TrendingDown, Search, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const markets = [
  { rank: 1, coin: "BTC", name: "Bitcoin", price: 67842.30, change1h: 0.41, change24h: 2.41, change7d: 8.12, vol24h: "2.41B", mcap: "1.32T", color: "#f97316" },
  { rank: 2, coin: "ETH", name: "Ethereum", price: 3512.80, change1h: 0.18, change24h: 1.87, change7d: 5.34, vol24h: "891M", mcap: "421B", color: "#8b5cf6" },
  { rank: 3, coin: "BNB", name: "BNB", price: 421.60, change1h: 0.92, change24h: 3.12, change7d: 7.81, vol24h: "145M", mcap: "62B", color: "#eab308" },
  { rank: 4, coin: "SOL", name: "Solana", price: 182.40, change1h: -0.31, change24h: -0.92, change7d: 3.21, vol24h: "312M", mcap: "79B", color: "#22c55e" },
  { rank: 5, coin: "XRP", name: "Ripple", price: 0.6231, change1h: -0.12, change24h: -1.45, change7d: -2.18, vol24h: "89M", mcap: "34B", color: "#0ea5e9" },
  { rank: 6, coin: "ADA", name: "Cardano", price: 0.4812, change1h: 0.05, change24h: 0.73, change7d: 1.92, vol24h: "42M", mcap: "17B", color: "#3b82f6" },
  { rank: 7, coin: "AVAX", name: "Avalanche", price: 37.82, change1h: 0.67, change24h: 2.18, change7d: 9.43, vol24h: "58M", mcap: "15B", color: "#ef4444" },
  { rank: 8, coin: "DOT", name: "Polkadot", price: 8.42, change1h: 0.28, change24h: 1.55, change7d: 4.12, vol24h: "31M", mcap: "12B", color: "#e879f9" },
  { rank: 9, coin: "MATIC", name: "Polygon", price: 0.9134, change1h: -0.08, change24h: -0.34, change7d: 2.71, vol24h: "28M", mcap: "9B", color: "#7c3aed" },
  { rank: 10, coin: "LINK", name: "Chainlink", price: 14.87, change1h: 1.02, change24h: 4.21, change7d: 11.24, vol24h: "19M", mcap: "8.7B", color: "#2563eb" },
  { rank: 11, coin: "LTC", name: "Litecoin", price: 89.21, change1h: 0.14, change24h: 0.82, change7d: 2.14, vol24h: "14M", mcap: "6.6B", color: "#94a3b8" },
  { rank: 12, coin: "UNI", name: "Uniswap", price: 7.84, change1h: -0.44, change24h: -2.11, change7d: -1.33, vol24h: "11M", mcap: "4.7B", color: "#f43f5e" },
];

export default function Markets() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("rank");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [starred, setStarred] = useState<string[]>(["BTC", "ETH"]);

  const toggleStar = (coin: string) => {
    setStarred(prev => prev.includes(coin) ? prev.filter(c => c !== coin) : [...prev, coin]);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = markets
    .filter(m =>
      m.coin.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: any, b: any) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });

  const SortIcon = ({ col }: { col: string }) => (
    <span className={`ml-1 text-xs ${sortKey === col ? "text-[#4f46e5]" : "text-slate-700"}`}>
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  const pctCell = (v: number) => (
    <span className={`flex items-center justify-end gap-0.5 text-xs font-medium ${v >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
      {v >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {Math.abs(v).toFixed(2)}%
    </span>
  );

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Markets</h2>
            <p className="text-xs text-slate-500">850+ assets · Prices updated in real-time</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Search markets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs text-slate-300 rounded-xl outline-none bg-transparent"
              style={{ border: "1px solid rgba(79,70,229,0.2)", background: "rgba(255,255,255,0.03)" }}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Favorites", "Top Gainers", "Top Losers", "New Listings"].map((c, i) => (
            <button key={c} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${i === 0 ? "bg-[#4f46e5] text-white" : "text-slate-500 hover:text-slate-300"}`}
              style={i !== 0 ? { border: "1px solid rgba(79,70,229,0.15)" } : {}}>
              {c}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto nx-scrollbar">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-xs text-slate-600 font-medium border-b" style={{ borderColor: "rgba(79,70,229,0.12)", background: "rgba(0,0,0,0.15)" }}>
                  <th className="py-3 px-4 text-left w-6"></th>
                  <th className="py-3 px-2 text-left cursor-pointer hover:text-slate-300 select-none" onClick={() => handleSort("rank")}>
                    # <SortIcon col="rank" />
                  </th>
                  <th className="py-3 px-2 text-left cursor-pointer hover:text-slate-300 select-none" onClick={() => handleSort("name")}>
                    Asset <SortIcon col="name" />
                  </th>
                  <th className="py-3 px-2 text-right cursor-pointer hover:text-slate-300 select-none" onClick={() => handleSort("price")}>
                    Price <SortIcon col="price" />
                  </th>
                  <th className="py-3 px-2 text-right cursor-pointer hover:text-slate-300 select-none hidden md:table-cell" onClick={() => handleSort("change1h")}>
                    1h <SortIcon col="change1h" />
                  </th>
                  <th className="py-3 px-2 text-right cursor-pointer hover:text-slate-300 select-none" onClick={() => handleSort("change24h")}>
                    24h <SortIcon col="change24h" />
                  </th>
                  <th className="py-3 px-2 text-right cursor-pointer hover:text-slate-300 select-none hidden lg:table-cell" onClick={() => handleSort("change7d")}>
                    7d <SortIcon col="change7d" />
                  </th>
                  <th className="py-3 px-2 text-right cursor-pointer hover:text-slate-300 select-none hidden xl:table-cell" onClick={() => handleSort("vol24h")}>
                    Volume <SortIcon col="vol24h" />
                  </th>
                  <th className="py-3 px-2 text-right cursor-pointer hover:text-slate-300 select-none hidden xl:table-cell" onClick={() => handleSort("mcap")}>
                    Mkt Cap <SortIcon col="mcap" />
                  </th>
                  <th className="py-3 px-4 text-right">Trade</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.coin}
                    className="border-b text-xs hover:bg-white/2 transition-colors"
                    style={{ borderColor: "rgba(79,70,229,0.06)" }}>
                    <td className="py-3 px-4">
                      <button onClick={() => toggleStar(m.coin)} className="transition-colors">
                        <Star size={13} className={starred.includes(m.coin) ? "text-[#eab308] fill-[#eab308]" : "text-slate-700 hover:text-slate-500"} />
                      </button>
                    </td>
                    <td className="py-3 px-2 text-slate-600">{m.rank}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: m.color + "22", border: `1px solid ${m.color}44` }}>
                          {m.coin.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{m.coin}</div>
                          <div className="text-slate-600">{m.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-slate-200">${m.price.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right hidden md:table-cell">{pctCell(m.change1h)}</td>
                    <td className="py-3 px-2 text-right">{pctCell(m.change24h)}</td>
                    <td className="py-3 px-2 text-right hidden lg:table-cell">{pctCell(m.change7d)}</td>
                    <td className="py-3 px-2 text-right text-slate-400 hidden xl:table-cell">${m.vol24h}</td>
                    <td className="py-3 px-2 text-right text-slate-400 hidden xl:table-cell">${m.mcap}</td>
                    <td className="py-3 px-4 text-right">
                      <Link to="/terminal">
                        <button className="px-3 py-1 rounded-lg text-xs font-medium text-[#4f46e5] transition-all hover:text-white"
                          style={{ border: "1px solid rgba(79,70,229,0.3)", background: "rgba(79,70,229,0.06)" }}>
                          Trade
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}