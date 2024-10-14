"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function MobileToggle() {
  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    const profileElement = document.getElementById("advisor-profile");
    const chatElement = document.getElementById("advisor-chat");

    if (profileElement && chatElement) {
      if (showProfile) {
        profileElement.style.display = "block";
        chatElement.style.display = "none";
      } else {
        profileElement.style.display = "none";
        chatElement.style.display = "block";
      }
    }
  }, [showProfile]);

  return (
    // Changed from md:hidden to lg:hidden
    <div className="flex justify-center space-x-2 mobile-toggle lg:hidden">
      <Button
        variant={showProfile ? "default" : "outline"}
        onClick={() => setShowProfile(true)}
      >
        Profile
      </Button>
      <Button
        variant={!showProfile ? "default" : "outline"}
        onClick={() => setShowProfile(false)}
      >
        Chat
      </Button>
    </div>
  );
}
