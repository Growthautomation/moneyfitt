import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function Welcome({ onNext, onSkip }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl space-y-6 p-20">
        <h1 className="text-xl text-center">Let&apos;s Get MoneyFitt</h1>
        <p>Our commitment to you:</p>
        <ul className="ml-10 list-disc">
          <li>Expertly matched with the right professional for your needs</li>
          <li>No commissions, no bias, just objective recommendations</li>
          <li>Anonymous identity until you decide to share a contact card</li>
        </ul>
        <p>
          We know financial planning can be overwhelming. Lets begin by helping
          you understand your specific needs.
        </p>
        <div>
          <div className="text-center">
            <Button onClick={() => onNext?.()}>Lets go</Button>
          </div>
          <div
            onClickCapture={() => onSkip?.()}
            className="text-right mt-0 hover:cursor-pointer hover:underline hover:text-blue-600 decoration-solid text-normal text-blue-500"
          >
            I have an account
          </div>
        </div>
      </Card>
    </div>
  );
}
