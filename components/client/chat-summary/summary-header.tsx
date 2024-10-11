"use client";
import { Button } from "@/components/ui/button";
import { Advisor } from "@/types/advisor";

export default function Header({
  advisors,
  selected,
  onSelect,
}: {
  advisors: Advisor[];
  selected: string;
  onSelect: (advisor: string) => void;
}) {
  return (
    <div className="flex mb-6 border-b border-[#ECF0F3]">
      {advisors.map((advisor) => (
        <Button
          key={advisor?.id}
          onClick={() => onSelect(advisor.id)}
          className={`px-4 py-2 text-lg bg-transparent hover:bg-gray-200 border-0 outline-none shadow-none ring-0 rounded-none ${
            selected === advisor?.id
              ? "text-[#5C59E4] border-b-2 border-[#5C59E4]"
              : "text-[#9CABC2]"
          }`}
        >
          {`${advisor?.first_name} ${advisor?.last_name}`}
        </Button>
      ))}
    </div>
  );
}
