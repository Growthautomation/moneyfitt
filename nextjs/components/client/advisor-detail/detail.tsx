import { ArrowLeft } from "@/components/icons";
import { RedirectButton } from "@/components/ui/button";
import { ComponentLoading } from "@/components/ui/loading";
import { MobileToggle } from "@/components/client/advisor-detail/mobile-toggle";
import { AdvisorProfile } from "@/components/client/advisor-detail/advisor-profile";
import { AdvisorChat } from "@/components/client/advisor-detail/chat";

export default async function AdvisorDetail({
  advisorId,
  user,
  messageOffset,
}: AdvisorDetailProps) {
  // ... (previous code)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-4">
        <RedirectButton
          variant="ghost"
          size="icon"
          className="mr-2"
          href="/home"
        >
          <ArrowLeft className="h-6 w-6" />
        </RedirectButton>
        <h1 className="text-2xl font-bold">{`Chat with ${advisor.first_name} ${advisor.last_name}`}</h1>
      </div>
      <div className="lg:hidden mb-4">
        <MobileToggle />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[60%] lg:block hidden">
          <AdvisorProfile advisor={advisor} />
        </div>
        <div className="w-full lg:w-[40%] lg:sticky lg:top-8">
          <Suspense fallback={<ComponentLoading />}>
            <AdvisorChat user={user} advisor={advisor} />
          </Suspense>
        </div>
      </div>
      <div className="lg:hidden">
        <AdvisorProfile advisor={advisor} />
      </div>
    </div>
  );
}
