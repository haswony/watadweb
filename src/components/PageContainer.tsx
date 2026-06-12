import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function PageContainer({
  children,
  className = "",
  fullWidth = false,
}: PageContainerProps) {
  return (
    <div
      className={`${fullWidth ? "w-full" : "site-container"} ${className}`}
    >
      {children}
    </div>
  );
}
