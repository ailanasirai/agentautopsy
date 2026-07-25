import { ExternalLink, Stethoscope } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm"
      style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
    >
      <div className="flex items-center gap-2">
        <Stethoscope size={14} style={{ color: "var(--accent)" }} />
        <span>AgentAutopsy — diagnose why your AI agent failed</span>
      </div>
      <a
        href="https://github.com/ailanasirai/agentautopsy"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
      >
        <ExternalLink size={14} />
        View source on GitHub
      </a>
    </footer>
  );
}
