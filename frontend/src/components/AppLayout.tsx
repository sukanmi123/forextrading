import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

export default function AppLayout({ children, noPadding }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      <TopBar />
      <main className={`ml-14 mt-12 ${noPadding ? "" : "p-4 lg:p-6"} min-h-[calc(100vh-48px)]`}>
        {children}
      </main>
    </div>
  );
}