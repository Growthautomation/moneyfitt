"use client"
import React from "react";
import clsx from "clsx";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function RedirectButton({
  href,
  children,
  className,
  ...props
}) {
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };
  return (
    <Button
      className={clsx(
        "bg-primary p-2 rounded text-white text-center",
        className
      )}
      {...props}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
