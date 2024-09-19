import { ReactNode } from "react";
import { Link, LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps extends LinkProps {
  children?: ReactNode;
  active?: boolean;
}

export function NavLink({
  children,
  className,
  active,
  ...LinkProps
}: NavLinkProps) {
  return (
    <Link
      className={cn(
        className,
        "hover:text-amber-500 transition-colors duration-300 text-sm font-medium whitespace-nowrap flex",
        active && "text-amber-500"
      )}
      {...LinkProps}
    >
      {children}
    </Link>
  );
}
