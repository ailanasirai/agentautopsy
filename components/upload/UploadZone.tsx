"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileJson } from "lucide-react";

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
          : "0 0 0px transparent",
      }}
      className="relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors"
      style={{ background: "var(--bg-card)" }}
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
        className="flex flex-col items-center gap-3"
      >
        {fileName ? (
          <FileJson size={36} style={{ color: "var(--accent)" }} />
        ) : (
          <UploadCloud size={36} style={{ color: "var(--text-secondary)" }} />
        )}
        <p className="font-medium text-[15px]">
          {fileName ? fileName : "Drop your agent trace here"}
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {fileName
            ? "Click to choose a different file"
            : "or click to browse — .json format"}
        </p>
      </motion.div>
    </motion.div>
  );
}
