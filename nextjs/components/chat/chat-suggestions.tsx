"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getSuggestions } from "@/lib/actions/chat";
import ComponentLoading from "@/components/utils/component-loading";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <ComponentLoading text="Writing up suggestions" />;
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
              {bubble.trim()}
            </span>
          </Button>
        </div>
      ))}
    </div>
  );
}
