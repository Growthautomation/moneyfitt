"use client";

import clsx from "clsx";
import { Message as MsgT } from "@/types/chat";
import FileMsg from "./file-message-display";

export default function Message({
  message,
  ismine,
}: {
  message: MsgT;
  ismine: boolean;
}) {
  return (
    <div
      className={clsx("flex", {
        "justify-end": ismine,
      })}
    >
      {(message.files as string[])?.length ? (
        <div className="flex flex-col gap-2">
          {(message.files as string[])?.map((f) => (
            <FileMsg key={f} path={f} />
          ))}
        </div>
      ) : (
        <span
          className={`inline-block p-2 rounded-lg text-sm ${
            message.sender === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {message.message}
        </span>
      )}
    </div>
  );
}
