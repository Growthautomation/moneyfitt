"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getSuggestions } from "@/lib/actions/chat";

export default function Suggestions({
  onClick,
  recipientId,
}: {
  onClick: (value: string) => void;
  recipientId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    !loading &&
      getSuggestions(recipientId)
        .then((res) => {
          setSuggestions(res);
        })
        .finally(() => setLoading(false));
  }, []);

  if (loading) {
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
      {suggestions.map((bubble, index) => (
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
