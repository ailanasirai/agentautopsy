import { ExternalLink, Stethoscope } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t px-6 pt-16 pb-8 mt-8"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope size={18} style={{ color: "var(--accent)" }} />
            <span className="font-bold">agentautopsy</span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            AI-powered forensic diagnosis for failing AI agents.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li>Root cause diagnosis</li>
            <li>Confidence scoring</li>
            <li>Anomaly heatmap</li>
            <li>Explainable AI</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://github.com/ailanasirai/agentautopsy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                GitHub <ExternalLink size={12} />
              </a>
            </li>
            <li style={{ color: "var(--text-secondary)" }}>Documentation</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Project</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li>MIT License</li>
            <li>v1.0.0</li>
          </ul>
        </div>
      </div>

      <div
        className="max-w-4xl mx-auto pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
      >
        <span>© 2026 AgentAutopsy. All rights reserved.</span>
        <span>Built with care for AI engineers.</span>
      </div>
    </footer>
  );
}
