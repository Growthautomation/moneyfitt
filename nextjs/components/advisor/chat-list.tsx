"use client";
import { useParams } from "next/navigation";
import ListItem from "./chat-list-item";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ChatList({ clients }) {
  const param = useParams<{ id?: string }>();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <button 
        className="md:hidden w-full flex items-center justify-between p-2 text-[#222222]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">
          {clients.length} Client{clients.length !== 1 ? 's' : ''}
        </span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Client list - collapsible on mobile */}
      <div className={`
        md:block
        ${isExpanded ? 'block' : 'hidden'}
        overflow-y-auto max-h-[calc(100vh-200px)]
        scrollbar-thin scrollbar-thumb-[#9CABC2] scrollbar-track-transparent
      `}>
        {!clients.length && (
          <div className="text-center py-8 text-[#9CABC2]">
            You have no matches yet
          </div>
        )}
        {clients.length > 0 && clients
          .sort((a, b) => Number(b["name"] != null) - Number(a["name"] != null))
          .map((client) => (
            <ListItem
              key={client.id}
              href={`/advisor/chat/${client.id}`}
              displayName={client?.name || 'Anonymous'}
              selectedClientId={param?.id}
              clientId={client.id}
            />
          ))
        }
      </div>
    </div>
  );
}
