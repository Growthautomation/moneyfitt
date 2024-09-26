"use client"
import { useState } from "react";
import { Input } from "../ui/input";

export default function TextQuestion({ answer, question, onChange }) {
  const [value, setValue] = useState(answer[question.key] || "");
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">{question.category}</h2>
        <p className="text-xl text-center">{question.question}</p>
      </div>
      <div className="w-full">
        <Input
          id="answer"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(question.key, e.target.value);
          }}
          className="h-auto py-4 px-6 text-left justify-start items-start w-full"
        />
      </div>
    </>
  );
}
