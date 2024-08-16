import { ReactNode } from "react";

export function Container({ children }: { children?: ReactNode }) {
  return (
    <main className="lg:m-auto mx-4  max-w-screen-lg p-4 bg-slate-800 rounded px-4 h-full">
      {children}
    </main>
  );
}
