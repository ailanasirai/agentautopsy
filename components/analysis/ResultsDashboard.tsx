"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, RotateCcw, Check } from "lucide-react";
import { FullReport } from "@/types/trace";
import HealthScoreGauge from "./HealthScoreGauge";
import RootCauseCard from "./RootCauseCard";
import Timeline from "./Timeline";
import AnomalyHeatmap from "./AnomalyHeatmap";
import ExplainabilityPanel from "./ExplainabilityPanel";

export default function ResultsDashboard({
  report,
  onReset,
  readOnly = false,
}: {
  report: FullReport;
  onReset?: () => void;
  readOnly?: boolean;
}) {
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  async function handleShare() {
    setSharing(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trace: report.trace, analysis: report.analysis }),
      });
      const data = await res.json();
      if (data.shareId) {
        const url = `${window.location.origin}/report/${data.shareId}`;
        setShareUrl(url);
        await navigator.clipboard.writeText(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSharing(false);
    }
  }

  async function handleExportPdf() {
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const { trace, analysis } = report;

      doc.setFontSize(18);
      doc.text("AgentAutopsy report", 14, 20);
      doc.setFontSize(11);
      doc.text(`Agent: ${trace.agent_name} (${trace.framework})`, 14, 32);
      doc.text(`Health score: ${analysis.health_score}/100`, 14, 40);
      doc.text(
        `Failure type: ${analysis.failure_detected ? analysis.failure_type : "none"}`,
        14,
        48
      );
      doc.text(`Confidence: ${analysis.confidence}%`, 14, 56);

      const rootCauseLines = doc.splitTextToSize(
        `Root cause: ${analysis.root_cause}`,
        180
      );
      doc.text(rootCauseLines, 14, 68);

      const fixLines = doc.splitTextToSize(
        `Suggested fix: ${analysis.suggested_fix}`,
        180
      );
      doc.text(fixLines, 14, 68 + rootCauseLines.length * 6 + 6);

      doc.save(`agentautopsy-${trace.agent_name}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium">{report.trace.agent_name}</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {report.trace.framework}
          </p>
        </div>
        <div className="flex gap-2">
          {!readOnly && (
            <>
              <button
                onClick={handleExportPdf}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                <Download size={14} /> Export PDF
              </button>
              <button
                onClick={handleShare}
                disabled={sharing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                {shareUrl ? <Check size={14} /> : <Share2 size={14} />}
                {shareUrl ? "Link copied" : "Share"}
              </button>
              {onReset && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--border)" }}
                >
                  <RotateCcw size={14} /> New analysis
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 mb-4">
        <HealthScoreGauge score={report.analysis.health_score} />
        <RootCauseCard analysis={report.analysis} />
      </div>

      <div className="flex flex-col gap-4">
        <Timeline steps={report.trace.steps} />
        <AnomalyHeatmap scores={report.analysis.anomaly_scores} />
        <ExplainabilityPanel chain={report.analysis.reasoning_chain} />
      </div>
    </div>
  );
}
