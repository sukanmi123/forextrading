import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

const pairs = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA"];

export default function QuickBuyWidget() {
  const [fromCoin, setFromCoin] = useState("USDT");
  const [toCoin, setToCoin] = useState("BTC");
  const [amount, setAmount] = useState("1000");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const rate = toCoin === "BTC" ? 67842.3 : toCoin === "ETH" ? 3512.8 : toCoin === "SOL" ? 182.4 : 1;
  const receiveAmount = (parseFloat(amount || "0") / rate).toFixed(6);

  return (
    <div className="glass-card rounded-2xl p-6 w-full max-w-sm">
      <h3 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
        Quick Buy
      </h3>

      {/* You Pay */}
      <div className="mb-3">
        <label className="text-xs text-slate-500 mb-1 block">You Pay</label>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(79,70,229,0.2)" }}>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm font-medium outline-none placeholder-slate-600"
            placeholder="0.00"
          />
          <div className="relative">
            <button
              onClick={() => setShowFrom(!showFrom)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              {fromCoin}
              <ChevronDown size={12} />
            </button>
            {showFrom && (
              <div className="absolute right-0 top-6 w-20 rounded-xl py-1 z-10" style={{ background: "#141432", border: "1px solid rgba(79,70,229,0.3)" }}>
                {["USDT", "USDC", "BTC"].map(c => (
                  <button key={c} onClick={() => { setFromCoin(c); setShowFrom(false); }}
                    className="w-full px-3 py-1.5 text-xs text-left text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* You Receive */}
      <div className="mb-4">
        <label className="text-xs text-slate-500 mb-1 block">You Receive</label>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(79,70,229,0.2)" }}>
          <span className="flex-1 text-sm font-medium text-[#4f46e5]">{receiveAmount}</span>
          <div className="relative">
            <button
              onClick={() => setShowTo(!showTo)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              {toCoin}
              <ChevronDown size={12} />
            </button>
            {showTo && (
              <div className="absolute right-0 top-6 w-20 rounded-xl py-1 z-10" style={{ background: "#141432", border: "1px solid rgba(79,70,229,0.3)" }}>
                {pairs.map(c => (
                  <button key={c} onClick={() => { setToCoin(c); setShowTo(false); }}
                    className="w-full px-3 py-1.5 text-xs text-left text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate */}
      <div className="flex justify-between text-xs text-slate-500 mb-4">
        <span>Rate</span>
        <span className="text-slate-300">1 {toCoin} = ${rate.toLocaleString()} {fromCoin}</span>
      </div>

      {/* CTA */}
      <button className="w-full py-3 rounded-xl bg-[#4f46e5] text-white text-sm font-semibold flex items-center justify-center gap-2 glow-btn">
        Buy {toCoin} Now
        <ArrowRight size={14} />
      </button>
    </div>
  );
}