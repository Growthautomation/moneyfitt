"use client";

import { useState } from "react";
import Header from "./summary-header";
import { Advisor } from "@/types/advisor";
import { getChatSummary } from "@/lib/actions/chat";
import ComponentLoading from "@/components/utils/component-loading";
import SummaryDisplay from "./summary-display";

export default function Summary({ advisors }) {
  const [activeAdvisor, setActiveAdvisor] = useState<string | null>(
    advisors?.[0]?.id
  );
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>({});

  const handleSelect = (selected: string) => {
    setActiveAdvisor(selected);
    setLoading(true);
    getChatSummary(selected)
      .then((data) => {
        setSummary(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Header
        advisors={advisors}
        selected={activeAdvisor || ""}
        onSelect={handleSelect}
      />
      {loading ? (
        <ComponentLoading text="Writing summaries..." />
      ) : (
        <SummaryDisplay
          services={summary.servicesOffered ?? []}
          mainPoints={summary.mainPoints ?? []}
          quickSummary={summary.quickSummary}
          analysis={summary.analysis}
        />
      )}
    </>
  );
}
