"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadZone from "@/components/upload/UploadZone";
import DemoTraceSelector from "@/components/upload/DemoTraceSelector";
import LoadingState from "@/components/states/LoadingState";
import ErrorState from "@/components/states/ErrorState";
import ResultsDashboard from "@/components/analysis/ResultsDashboard";
import { FullReport } from "@/types/trace";

import loopFailureTrace from "@/lib/sampleTraces/loop-failure.json";
import wrongToolCallTrace from "@/lib/sampleTraces/wrong-tool-call.json";
import hallucinationTrace from "@/lib/sampleTraces/hallucination.json";
import successCaseTrace from "@/lib/sampleTraces/success-case.json";

const DEMO_TRACES: Record<string, unknown> = {
  "loop-failure": loopFailureTrace,
  "wrong-tool-call": wrongToolCallTrace,
  hallucination: hallucinationTrace,
  "success-case": successCaseTrace,
};

type Stage = "upload" | "loading" | "results" | "error";

export default function Home() {
  const [stage, setStage] = useState<Stage>("upload");
  const [report, setReport] = useState<FullReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function analyzeTrace(traceJson: unknown) {
    setStage("loading");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(traceJson),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStage("error");
        return;
      }
      setReport({ trace: data.trace, analysis: data.analysis });
      setStage("results");
    } catch {
      setErrorMsg("Couldn't reach the analysis engine. Please try again.");
      setStage("error");
    }
  }

  async function loadDemo(id: string) {
    const trace = DEMO_TRACES[id];
    if (!trace) {
      setErrorMsg("Couldn't load that demo trace.");
      setStage("error");
      return;
    }
    analyzeTrace(trace);
  }

  function reset() {
    setReport(null);
    setStage("upload");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col relative">
      <AnimatePresence mode="wait">
        {stage === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative"
          >
            <div className="ambient-bg">
              <div className="ambient-orb orb-1" />
              <div className="ambient-orb orb-2" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl w-full text-center mb-10 relative z-10"
            >
              <h1 className="text-4xl md:text-5xl font-medium mb-4 hero-glow-text">
                Find out why your{" "}
                <span style={{ color: "var(--accent)" }}>AI agent</span>{" "}
                failed
              </h1>
              <p
                className="text-base md:text-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                Upload an execution trace and get a forensic diagnosis: root
                cause, confidence, and a concrete fix — in seconds.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="max-w-xl w-full relative z-10"
            >
              <div className="upload-ambient rounded-2xl">
                <UploadZone
                  onFileLoaded={analyzeTrace}
                  onError={(m) => {
                    setErrorMsg(m);
                    setStage("error");
                  }}
                />
              </div>
              <DemoTraceSelector onSelect={loadDemo} />
            </motion.div>
          </motion.div>
        )}

        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <LoadingState />
          </motion.div>
        )}

        {stage === "error" && (
          <motion.div key="error" className="flex-1">
            <ErrorState message={errorMsg} onRetry={reset} />
          </motion.div>
        )}

        {stage === "results" && report && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <ResultsDashboard report={report} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
