import { Suspense } from "react";
import MobileToggleHandler from "./[id]/mobile-toggle-handler";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <MobileToggleHandler />
      </Suspense>
      {children}
    </>
  );
}
