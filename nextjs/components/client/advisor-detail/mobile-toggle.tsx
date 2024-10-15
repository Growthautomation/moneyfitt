"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function MobileToggle() {
  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    const profileElement = document.getElementById("advisor-profile");
    const chatElement = document.getElementById("advisor-chat");

    if (profileElement && chatElement) {
      if (window.innerWidth < 1024) { // Only apply toggle on mobile
        if (showProfile) {
          profileElement.style.display = "block";
          chatElement.style.display = "none";
        } else {
          profileElement.style.display = "none";
          chatElement.style.display = "block";
        }
      } else {
        profileElement.style.display = "block";
        chatElement.style.display = "block";
      }
    }
  }, [showProfile]);

  useEffect(() => {
    const handleResize = () => {
      const profileElement = document.getElementById("advisor-profile");
      const chatElement = document.getElementById("advisor-chat");

      if (profileElement && chatElement) {
        if (window.innerWidth >= 1024) {
          profileElement.style.display = "block";
          chatElement.style.display = "block";
        } else {
          setShowProfile(true); // Reset to profile view on mobile
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
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
