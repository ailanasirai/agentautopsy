"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3 py-16 text-center px-6"
    >
      <AlertTriangle size={28} style={{ color: "var(--danger)" }} />
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-lg text-sm border"
          style={{ borderColor: "var(--border)" }}
        >
          Try again
        </button>
      )}
    </motion.div>
  );
}
