import React from "react";
import Link from "next/link";
import clsx from "clsx";

export function RedirectButton({
  href,
  children,
  variant = "default",
  size = "default",
  className,
  ...props
}) {
  return (
    <Link
      className={clsx(
        "bg-primary p-2 rounded text-white text-center",
        className
      )}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
