import Link from "next/link";
import ChatSummary from "./summary-display";
import { createClient } from "@/lib/supabase/server";
import { callGPT4 } from "@/lib/utils";
import { SUMMARY_PROMPT } from "@/lib/prompts";
import ComponentError from "@/components/utils/component-error";
import Header from "./summary-header";
import { Suspense } from "react";
import ComponentLoading from "@/components/utils/component-loading";
import Summarizer from "./summarizer";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default async function ChatSummaryContainer({ selectedAdvisor, user }) {
  return (
    <div className="text-sm max-w-4xl mx-auto p-4 font-['Fira_Sans'] text-[#222222]">
      <Header selectedAdvisor={selectedAdvisor} user={user} />

      <Suspense
        fallback={<ComponentLoading text="Writing up summary" />}
        key={selectedAdvisor}
      >
        <Summarizer user={user} selectedAdvisor={selectedAdvisor} />
      </Suspense>

      <p className="mt-8 text-sm italic text-[#9CABC2]">
        Disclaimer: This summary is for informational purposes only and does not
        constitute financial advice.
      </p>
    </div>
  );
}
