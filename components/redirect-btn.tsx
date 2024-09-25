"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function RedirectButton({
  href,
  children,
  variant = "default",
  size = "default",
  className,
  ...props
}) {
  const router = useRouter();

  const handleClick = (event) => {
    event.preventDefault();
    router.push(href);
  };

  return (
    <Button
      className={className}
      onClick={handleClick}
      {...(href ? { as: "a", href } : {})}
      {...props}
    >
      {children}
    </Button>
  );
}
