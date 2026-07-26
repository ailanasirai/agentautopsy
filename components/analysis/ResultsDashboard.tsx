"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, ArrowLeft, Check } from "lucide-react";
import { FullReport } from "@/types/trace";
import HealthScoreGauge from "./HealthScoreGauge";
import RootCauseCard from "./RootCauseCard";
import Timeline from "./Timeline";
import AnomalyHeatmap from "./AnomalyHeatmap";
import ExplainabilityPanel from "./ExplainabilityPanel";

function ActionButton({
  onClick,
  disabled,
  icon,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm transition-all hover:-translate-y-0.5"
      style={{
        borderColor: "var(--border)",
        color: "var(--text-primary)",
        background: "var(--bg-card)",
      }}
    >
      {icon} {label}
    </button>
  );
}

function Section({
  title,
  children,
  delay = 0,
}: {
  title?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className="mb-16 md:mb-20"
    >
      {title && (
        <h2
          className="text-sm font-semibold tracking-wide uppercase mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          {title}
        </h2>
      )}
      {children}
    </motion.section>
  );
}

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
    <div className="max-w-4xl mx-auto px-6 py-14 md:py-20">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-16 md:mb-20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {report.trace.agent_name}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {report.trace.framework}
          </p>
        </div>
        {!readOnly && (
          <div className="flex flex-wrap gap-2">
            <ActionButton
              onClick={handleExportPdf}
              disabled={exporting}
              icon={<Download size={14} />}
              label="Export PDF"
            />
            <ActionButton
              onClick={handleShare}
              disabled={sharing}
              icon={shareUrl ? <Check size={14} /> : <Share2 size={14} />}
              label={shareUrl ? "Link copied" : "Share"}
            />
            {onReset && (
              <ActionButton
                onClick={onReset}
                icon={<ArrowLeft size={14} />}
                label="Back to upload"
              />
            )}
          </div>
        )}
      </div>

      {/* Root cause + health score */}
      <Section title="Diagnosis">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          <HealthScoreGauge score={report.analysis.health_score} />
          <RootCauseCard analysis={report.analysis} />
        </div>
      </Section>

      {/* Timeline */}
      <Section title="Execution timeline" delay={0.05}>
        <Timeline steps={report.trace.steps} />
      </Section>

      {/* Heatmap */}
      <Section title="Anomaly heatmap" delay={0.1}>
        <AnomalyHeatmap scores={report.analysis.anomaly_scores} />
      </Section>

      {/* Explainability */}
      <Section title="AI reasoning" delay={0.15}>
        <ExplainabilityPanel chain={report.analysis.reasoning_chain} />
      </Section>
    </div>
  );
}
