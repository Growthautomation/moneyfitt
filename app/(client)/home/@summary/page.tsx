import ChatSummaryContainer from "@/components/client/chat-summary/container";
import ComponentLoading from "@/components/utils/component-loading";
import { Suspense } from "react";

export default async function Summary({ searchParams }) {
  return (
    <Suspense fallback={<ComponentLoading text="Writing summary..." />}>
      <div className="w-full">
        <ChatSummaryContainer selectedAdvisor={searchParams?.advisorId} />
      </div>
    </Suspense>
  );
}
