import { ReactNode } from "react";

export function Title({ children }: { children?: ReactNode }) {
  return (
    <div className="my-2">
      <h2 className="min-h-7 font-bold text-xl mb-2 md:text-left text-center">
        {children}
      </h2>
      <hr className="border-slate-700" />
    </div>
  );
}
