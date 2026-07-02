import type { Plugin } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function uxpilotCanvasVhBridge(): Plugin {
  return {
    name: "uxpilot-canvas-vh-bridge",
    transformIndexHtml(html) {
      if (html.includes("__UXP_VH_FIX_BRIDGE__")) return html;
      const bridge =
        "<script>" +
        "(function(){\n" +
        "if (window.__UXP_VH_FIX_BRIDGE__) return;\n" +
        "window.__UXP_VH_FIX_BRIDGE__ = true;\n" +
        "window.addEventListener('message', function(e) {\n" +
        "var d = e.data;\n" +
        "if (!d || d.type !== 'uxpilot:install-vh-fix' || typeof d.payload !== 'string') return;\n" +
        "if (window.__uxpVhFixInjected) return;\n" +
        "window.__uxpVhFixInjected = true;\n" +
        "var s = document.createElement('script');\n" +
        "s.setAttribute('data-uxp', 'vh-fix');\n" +
        "s.textContent = d.payload;\n" +
        "(document.head || document.documentElement).appendChild(s);\n" +
        "});\n" +
        "})();" +
        "</script>";
      return html.replace(/<head([^>]*)>/i, "<head$1>\n" + bridge + "\n");
    },
  };
}

export default defineConfig({
  base: "/",   // ✅ FIXED (important for Render)
  plugins: [react(), uxpilotCanvasVhBridge()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      "uxpilot.net",
      "host.uxpilot.net",
      "dev.host.uxpilot.net",
      "uxpilot.ai",
      "localhost",
      "127.0.0.1",
    ],
  },
});