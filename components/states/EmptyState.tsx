"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-2 py-16 text-center"
    >
      <Search size={24} style={{ color: "var(--text-muted)" }} />
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {message}
      </p>
    </motion.div>
  );
}
