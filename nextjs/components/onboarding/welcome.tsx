import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function Welcome({ onNext, onSkip }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl space-y-6 p-6 sm:p-20">
        <h1 className="text-3xl font-bold text-center mb-6">
          Let&apos;s Get MoneyFitt
        </h1>
        <p className="text-lg font-semibold">Our commitment to you:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Expertly matched with the right professional for your needs</li>
          <li>No commissions, no bias, just objective recommendations</li>
          <li>Anonymous identity until you decide to share a contact card</li>
        </ul>
        <p className="mt-6">
          We know financial planning can be overwhelming. Let&apos;s begin by
          helping you understand your specific needs.
        </p>
        <div className="flex flex-col items-center space-y-6 mt-8">
          <Button onClick={() => onNext?.()} className="w-full sm:w-auto">
            Let&apos;s go
          </Button>
          <span
            onClick={() => onSkip?.()}
            className="text-center mt-4 hover:cursor-pointer hover:underline hover:text-blue-600 text-sm text-blue-500"
          >
            I have an account
          </span>
        </div>
        <div className="text-xs text-gray-400 text-center">
          You&apos;re using the beta version of our financial matching platform.
          For any issues, contact{" "}
          <a
            href="mailto:feedback@moneyfitt.co"
            className="hover:underline text-blue-500"
          >
            feedback@moneyfitt.co
          </a>{" "}
          {". "}
          MoneyFitt (ProConnect Technologies Pte Ltd) is not responsible for any
          errors, omissions, or outcomes from using the platform, including
          reliance on matches with third-party financial professionals. All
          information is provided &quot;as is,&quot; without guarantees of
          accuracy, completeness, or results. MoneyFitt does not provide
          financial advice, nor are we licensed to do so.
        </div>
      </Card>
    </div>
  );
}
