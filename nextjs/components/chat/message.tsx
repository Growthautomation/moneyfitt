"use client";

import clsx from "clsx";
import { Message as MsgT } from "@/types/chat";
import FileMsg from "./file-message-display";
import { User, UserCircle, Settings } from "lucide-react";

export default function Message({
  message,
  ismine,
  senderName,
  systemMessagePostfix,
}: {
  message: MsgT;
  ismine: boolean;
  senderName: string;
  systemMessagePostfix?: string;
}) {
  const isSystemMsg = message.message.startsWith("[SYSTEM]");
  if (isSystemMsg) {
    return (
      <div className="my-5">
        <div className="flex items-center text-xs font-bold">
          <Settings className="w-4 h-4" />
          <span>System</span>
          <span className="text-xs ml-2 text-gray-500">
            {new Date(message.created_at!).toLocaleTimeString()}
          </span>
        </div>
        <div className="bg-secondary whitespace-pre-wrap text-center rounded p-1 text-sm">
          {`${message.message.replace("[SYSTEM]", "")}. \n${systemMessagePostfix}`}
        </div>
      </div>
    );
  }
  return (
    <div className="mb-4">
      <div
        className={clsx("flex", {
          "justify-end": ismine,
        })}
      >
        <div
          className={clsx("flex items-center gap-1 mb-1", {
            "flex-row-reverse": ismine,
          })}
        >
          {/* Use UserCircle for user and User for advisor with exact color codes */}
          {ismine ? (
            <UserCircle style={{ color: "#5C59E4" }} className="w-4 h-4" />
          ) : (
            <User style={{ color: "#2E2C72" }} className="w-4 h-4" />
          )}
          <span className="text-xs font-semibold">
            {ismine ? "You" : senderName}
          </span>
          <span className="text-xs ml-2 text-gray-500">
            {new Date(message.created_at!).toLocaleTimeString()}
          </span>
        </div>
      </div>
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
            className={`inline-block p-2 rounded-lg text-sm bg-secondary text-secondary-foreground`}
          >
            {message.message}
          </span>
        )}
      </div>
    </div>
  );
}
