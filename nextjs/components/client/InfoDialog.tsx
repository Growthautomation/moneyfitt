"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function InfoDialog() {
  const { toast } = useToast();

  const showMessage = () => {
    toast({
      title: "Welcome to your secure chat",
      description: (
        <div className="mt-2 space-y-2">
          <p>🔒 Your data is secure and encrypted.</p>
          <p>🕵️ Your identity remains anonymous to the advisor.</p>
          <p>🌟 Take the first step towards your financial goals today!</p>
        </div>
      ),
      duration: 10000, // 10 seconds
    });
  };

  useEffect(() => {
    const hasSeenMessage = localStorage.getItem("hasSeenChatInfoMessage");
    if (!hasSeenMessage) {
      showMessage();
      localStorage.setItem("hasSeenChatInfoMessage", "true");
    }
  }, []);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={showMessage}
      className="flex items-center gap-2"
    >
      <Info className="w-4 h-4" />
      Chat Information
    </Button>
  );
}
