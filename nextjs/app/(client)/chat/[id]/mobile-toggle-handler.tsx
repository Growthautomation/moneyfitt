"use client";

import { useEffect } from "react";

export default function MobileToggleHandler() {
  useEffect(() => {
    const profileElement = document.getElementById("advisor-profile");
    const chatElement = document.getElementById("advisor-chat");

    if (profileElement && chatElement) {
      profileElement.classList.remove("hidden");
      chatElement.classList.add("hidden");
    }
  }, []);

  return null;
}
