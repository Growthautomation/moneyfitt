"use client";
import { Button } from "../ui/button";

export default function Suggestions({
  onClick,
}: {
  onClick: (value: string) => void;
}) {
  const editableBubbles = [
    "What financial products are suitable for me?",
    "How can I start investing in Singapore?",
    "Tell me about insurance options in Singapore.",
  ];

  const isLoading = true;

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 my-5">
        {"Loading...".split("").map((char, index) => (
          <span
            key={index}
            className={`inline-block animate-bounce`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: "1s",
            }}
          >
            {char}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      {editableBubbles.map((bubble, index) => (
        <div key={index} className="relative group">
          <Button
            variant="outline"
            className="w-full h-auto py-2 px-3 text-left flex flex-col items-start justify-start"
            onClick={() => onClick(bubble)}
          >
            <span className="text-xs break-words whitespace-pre-wrap">
              {bubble}
            </span>
          </Button>
        </div>
      ))}
    </div>
  );
}
