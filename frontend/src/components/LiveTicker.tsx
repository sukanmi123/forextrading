import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const basePrices = [
  { pair: "BTC/USDT", price: 67842.30, change: 2.41 },
  { pair: "ETH/USDT", price: 3512.80, change: 1.87 },
  { pair: "SOL/USDT", price: 182.40, change: -0.92 },
  { pair: "BNB/USDT", price: 421.60, change: 3.12 },
  { pair: "XRP/USDT", price: 0.6231, change: -1.45 },
  { pair: "ADA/USDT", price: 0.4812, change: 0.73 },
  { pair: "AVAX/USDT", price: 37.82, change: 2.18 },
  { pair: "MATIC/USDT", price: 0.9134, change: -0.34 },
  { pair: "DOT/USDT", price: 8.42, change: 1.55 },
  { pair: "LINK/USDT", price: 14.87, change: 4.21 },
];

interface TickerItem {
  pair: string;
  price: number;
  change: number;
}

export default function LiveTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(basePrices);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev =>
        prev.map(t => ({
          ...t,
          price: t.price * (1 + (Math.random() - 0.5) * 0.002),
          change: t.change + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const doubled = [...tickers, ...tickers];

  return (
    <div
      className="w-full overflow-hidden py-2.5 border-y"
      style={{ borderColor: "rgba(79,70,229,0.2)", background: "rgba(20,20,50,0.4)" }}
    >
      <div className="flex ticker-scroll" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-5 shrink-0">
            <span className="text-xs font-semibold text-slate-300" style={{ fontFamily: "'Sora', sans-serif" }}>
              {item.pair}
            </span>
            <span className="text-xs text-white font-medium" style={{ fontFamily: "'Manrope', sans-serif" }}>
              ${item.price.toFixed(item.price < 1 ? 4 : 2)}
            </span>
            <span className={`text-xs flex items-center gap-0.5 ${item.change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
              {item.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(item.change).toFixed(2)}%
            </span>
            <span className="text-slate-700 ml-2">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}