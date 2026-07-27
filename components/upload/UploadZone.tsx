"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileJson, Clipboard } from "lucide-react";

interface UploadZoneProps {
  onFileLoaded: (content: unknown) => void;
  onError: (message: string) => void;
}

export default function UploadZone({ onFileLoaded, onError }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".json")) {
        onError("Please upload a .json trace file.");
        return;
      }
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        setFileName(file.name);
        onFileLoaded(parsed);
      } catch {
        onError("Couldn't parse that file as valid JSON.");
      }
    },
    [onFileLoaded, onError]
  );

  const processPastedText = useCallback(
    (text: string) => {
      try {
        const parsed = JSON.parse(text);
        setFileName("Pasted trace.json");
        onFileLoaded(parsed);
      } catch {
        onError("Clipboard content isn't valid JSON.");
      }
    },
    [onFileLoaded, onError]
  );

  // Support pasting a JSON trace anywhere on the page with Ctrl+V
  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      const text = e.clipboardData?.getData("text");
      if (text && text.trim().startsWith("{")) {
        processPastedText(text);
      }
    }
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [processPastedText]);

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
      }}
      animate={{
        borderColor: isDragging ? "var(--accent)" : "var(--border)",
        boxShadow: isDragging
          ? "0 0 32px var(--accent-glow)"
          : "0 8px 30px -12px rgba(0,0,0,0.3)",
      }}
      whileHover={{ y: -2 }}
      className="glass-card relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors min-h-[280px] flex items-center justify-center"
      onClick={() => document.getElementById("trace-file-input")?.click()}
    >
      <input
        id="trace-file-input"
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />
      <motion.div
        animate={{ y: isDragging ? -4 : 0 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="float-icon">
          {fileName ? (
            <FileJson size={56} style={{ color: "var(--accent)" }} />
          ) : (
            <UploadCloud size={56} style={{ color: "var(--accent)" }} />
          )}
        </div>
        <p className="font-semibold text-xl">
          {fileName ? fileName : "Drop your execution trace here"}
        </p>
        <div className="flex items-center gap-2">
          <span
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {fileName ? "Click to choose a different file" : "or click to browse"}
          </span>
          <span className="json-badge">.json</span>
        </div>
        {!fileName && (
          <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            <Clipboard size={12} />
            or paste JSON anywhere with Ctrl+V
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
