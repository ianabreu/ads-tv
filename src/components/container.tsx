import { ReactNode } from "react";

export function Container({ children }: { children?: ReactNode }) {
  return (
    <main className="lg:m-auto mx-2 max-w-screen-lg p-2 bg-slate-800 rounded h-full min-h-[80vh] flex flex-1 flex-col">
      {children}
    </main>
  );
}
