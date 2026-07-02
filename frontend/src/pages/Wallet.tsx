import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { ChevronDown, ChevronRight, ArrowDownLeft, ArrowUpRight, QrCode, Copy, CheckCheck, Search } from "lucide-react";

interface WalletAsset {
  coin: string;
  name: string;
  balance: number;
  locked: number;
  usdValue: number;
  change: number;
  color: string;
  address: string;
}

const assets: WalletAsset[] = [
  { coin: "USDT", name: "Tether USD", balance: 5284.21, locked: 3325.00, usdValue: 8609.21, change: 0.01, color: "#22c55e", address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b" },
  { coin: "BTC", name: "Bitcoin", balance: 0.5231, locked: 0.05, usdValue: 37842.10, change: 2.41, color: "#f97316", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
  { coin: "ETH", name: "Ethereum", balance: 6.82, locked: 2.0, usdValue: 23957.30, change: 1.87, color: "#8b5cf6", address: "0xd3cda913deb6f279967175b3abf85c5ff64d0091" },
  { coin: "SOL", name: "Solana", balance: 57.4, locked: 20, usdValue: 10469.76, change: -0.92, color: "#06b6d4", address: "4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ" },
  { coin: "BNB", name: "BNB", balance: 16.3, locked: 0, usdValue: 6872.08, change: 3.12, color: "#eab308", address: "bnb1jxfh2g89z3w9168crsx4i2j8h1dv7oekwszp4l" },
  { coin: "XRP", name: "Ripple", balance: 8421, locked: 0, usdValue: 5247.45, change: -1.45, color: "#0ea5e9", address: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" },
  { coin: "ADA", name: "Cardano", balance: 12400, locked: 0, usdValue: 5967.88, change: 0.73, color: "#3b82f6", address: "addr1qxck9z7s6h3z7ynxzv4sls5aapudq6x5kgdp0j" },
];

const recentTransactions = [
  { type: "DEPOSIT", coin: "BTC", amount: 0.1, usd: 6784, time: "2024-01-15 14:32", status: "Completed", txid: "a1b2c3d4e5f6..." },
  { type: "WITHDRAW", coin: "USDT", amount: 2000, usd: 2000, time: "2024-01-14 09:21", status: "Completed", txid: "f7e8d9c0b1a2..." },
  { type: "DEPOSIT", coin: "ETH", amount: 1.5, usd: 5268, time: "2024-01-13 17:44", status: "Completed", txid: "3f4e5d6c7b8a..." },
  { type: "DEPOSIT", coin: "SOL", amount: 30, usd: 5472, time: "2024-01-12 11:08", status: "Pending", txid: "9a8b7c6d5e4f..." },
];

export default function Wallet() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw" | null>(null);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [search, setSearch] = useState("");

  const totalUSD = assets.reduce((acc, a) => acc + a.usdValue, 0);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    });
  };

  const filtered = assets.filter(a =>
    a.coin.toLowerCase().includes(search.toLowerCase()) ||
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 sm:col-span-2">
            <p className="text-xs text-slate-500 mb-1">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
              ${totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <span className="text-[#22c55e] flex items-center gap-1"><ArrowUpRight size={12} />+$2,631.20 today</span>
              <span className="text-slate-500">7 Assets Held</span>
              <span className="text-slate-500">3 With Locked Balance</span>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <p className="text-xs text-slate-500 mb-3">Quick Actions</p>
            <div className="flex flex-col gap-2">
              <button className="w-full py-2.5 rounded-xl bg-[#4f46e5] text-white text-xs font-bold flex items-center justify-center gap-2 glow-btn">
                <ArrowDownLeft size={14} /> Deposit
              </button>
              <button className="w-full py-2.5 rounded-xl text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:text-white"
                style={{ border: "1px solid rgba(79,70,229,0.3)", background: "rgba(79,70,229,0.06)" }}>
                <ArrowUpRight size={14} /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
            <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Assets</h3>
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                placeholder="Search asset..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-300 rounded-lg outline-none bg-transparent"
                style={{ border: "1px solid rgba(79,70,229,0.2)", background: "rgba(255,255,255,0.03)" }}
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid text-xs text-slate-600 font-medium px-4 pb-2 border-b" style={{ borderColor: "rgba(79,70,229,0.1)", gridTemplateColumns: "2fr 1.5fr 1.5fr 1.5fr 1fr auto" }}>
            <span>Asset</span>
            <span className="text-right">Balance</span>
            <span className="text-right">Locked</span>
            <span className="text-right hidden sm:block">USD Value</span>
            <span className="text-right hidden md:block">24h Change</span>
            <span />
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ borderColor: "rgba(79,70,229,0.08)" }}>
            {filtered.map(asset => (
              <div key={asset.coin}>
                {/* Main Row */}
                <div
                  className="grid items-center px-4 py-3.5 cursor-pointer hover:bg-white/2 transition-colors"
                  style={{ gridTemplateColumns: "2fr 1.5fr 1.5fr 1.5fr 1fr auto" }}
                  onClick={() => {
                    setExpandedRow(expandedRow === asset.coin ? null : asset.coin);
                    setActiveAction(null);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: asset.color + "22", border: `1px solid ${asset.color}44` }}>
                      {asset.coin.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{asset.coin}</div>
                      <div className="text-xs text-slate-500">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-200 font-medium">{asset.balance.toLocaleString()}</div>
                    <div className="text-xs text-slate-600">{asset.coin}</div>
                  </div>
                  <div className="text-right text-sm text-slate-500">{asset.locked > 0 ? asset.locked.toLocaleString() : "—"}</div>
                  <div className="text-right text-sm font-medium text-slate-200 hidden sm:block">${asset.usdValue.toLocaleString()}</div>
                  <div className={`text-right text-xs font-medium hidden md:block ${asset.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {asset.change >= 0 ? "+" : ""}{asset.change}%
                  </div>
                  <div className="flex items-center justify-end">
                    {expandedRow === asset.coin ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-600" />}
                  </div>
                </div>

                {/* Expanded Row */}
                {expandedRow === asset.coin && (
                  <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: "rgba(79,70,229,0.1)", background: "rgba(79,70,229,0.03)" }}>
                    {/* Action Toggle */}
                    {!activeAction && (
                      <div className="flex gap-2 pt-3 mb-4">
                        <button onClick={() => setActiveAction("deposit")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#22c55e] transition-all hover:bg-[#22c55e]/10"
                          style={{ border: "1px solid rgba(34,197,94,0.3)" }}>
                          <ArrowDownLeft size={12} /> Deposit
                        </button>
                        <button onClick={() => setActiveAction("withdraw")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#ef4444] transition-all hover:bg-[#ef4444]/10"
                          style={{ border: "1px solid rgba(239,68,68,0.3)" }}>
                          <ArrowUpRight size={12} /> Withdraw
                        </button>
                      </div>
                    )}

                    {/* Deposit view */}
                    {activeAction === "deposit" && (
                      <div className="flex flex-col sm:flex-row gap-4 pt-3">
                        {/* QR placeholder */}
                        <div className="flex items-center justify-center w-28 h-28 rounded-xl shrink-0"
                          style={{ border: "1px solid rgba(79,70,229,0.3)", background: "rgba(79,70,229,0.05)" }}>
                          <QrCode size={48} className="text-[#4f46e5]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 mb-1">Your {asset.coin} Deposit Address</p>
                          <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(79,70,229,0.2)" }}>
                            <span className="text-xs text-slate-400 font-mono flex-1 truncate">{asset.address}</span>
                            <button onClick={() => handleCopy(asset.address)} className="shrink-0 text-slate-500 hover:text-[#4f46e5] transition-colors">
                              {copiedAddr ? <CheckCheck size={14} className="text-[#22c55e]" /> : <Copy size={14} />}
                            </button>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Only send {asset.coin} to this address. Sending any other asset may result in permanent loss.
                          </p>
                          <button onClick={() => setActiveAction(null)} className="mt-3 text-xs text-slate-600 hover:text-slate-400 transition-colors">
                            ← Back
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Withdraw view */}
                    {activeAction === "withdraw" && (
                      <div className="pt-3 max-w-md">
                        <p className="text-xs text-slate-500 mb-3">Withdraw {asset.coin}</p>
                        <div className="space-y-2.5">
                          <div>
                            <label className="text-xs text-slate-600 mb-1 block">Destination Address</label>
                            <input type="text" placeholder={`${asset.coin} address`}
                              className="w-full rounded-xl px-3 py-2 text-xs text-slate-300 outline-none bg-transparent font-mono"
                              style={{ border: "1px solid rgba(79,70,229,0.2)", background: "rgba(255,255,255,0.03)" }} />
                          </div>
                          <div>
                            <label className="text-xs text-slate-600 mb-1 block">Amount</label>
                            <div className="flex gap-2">
                              <input type="number" placeholder="0.00"
                                className="flex-1 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none bg-transparent"
                                style={{ border: "1px solid rgba(79,70,229,0.2)", background: "rgba(255,255,255,0.03)" }} />
                              <button className="px-3 py-2 text-xs text-[#4f46e5] rounded-xl"
                                style={{ border: "1px solid rgba(79,70,229,0.3)", background: "rgba(79,70,229,0.08)" }}>
                                MAX
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                            <span>Available: {asset.balance.toLocaleString()} {asset.coin}</span>
                            <span>Network Fee: ~0.00042 {asset.coin}</span>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-[#ef4444] glow-btn-red transition-all">
                              Confirm Withdraw
                            </button>
                            <button onClick={() => setActiveAction(null)} className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 transition-colors"
                              style={{ border: "1px solid rgba(79,70,229,0.15)" }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>Recent Transactions</h3>
          <div className="overflow-x-auto nx-scrollbar">
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr className="text-slate-600 border-b font-medium" style={{ borderColor: "rgba(79,70,229,0.1)" }}>
                  <th className="text-left pb-2">Type</th>
                  <th className="text-left pb-2">Asset</th>
                  <th className="text-right pb-2">Amount</th>
                  <th className="text-right pb-2">USD Value</th>
                  <th className="text-right pb-2">Status</th>
                  <th className="text-right pb-2">Tx ID</th>
                  <th className="text-right pb-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, i) => (
                  <tr key={i} className="border-b" style={{ borderColor: "rgba(79,70,229,0.06)" }}>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tx.type === "DEPOSIT" ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#ef4444]/10 text-[#ef4444]"}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold text-slate-200">{tx.coin}</td>
                    <td className="py-2.5 text-right text-slate-200 font-medium">{tx.amount} {tx.coin}</td>
                    <td className="py-2.5 text-right text-slate-400">${tx.usd.toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${tx.status === "Completed" ? "text-[#22c55e] bg-[#22c55e]/8" : "text-[#eab308] bg-[#eab308]/8"}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-slate-600 font-mono">{tx.txid}</td>
                    <td className="py-2.5 text-right text-slate-600">{tx.time}</td>
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