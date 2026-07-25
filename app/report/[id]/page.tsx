"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoadingState from "@/components/states/LoadingState";
import ErrorState from "@/components/states/ErrorState";
import ResultsDashboard from "@/components/analysis/ResultsDashboard";
import { FullReport } from "@/types/trace";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<FullReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/share?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setReport({ trace: data.trace, analysis: data.analysis });
        }
      })
      .catch(() => setError("Couldn't load this report."));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!report) return <LoadingState />;

  return <ResultsDashboard report={report} readOnly />;
}
