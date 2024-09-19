import { ReactNode } from "react";

export function Title({ children }: { children?: ReactNode }) {
  return (
    <div className="my-2">
      <h2 className="font-bold text-xl mb-2">{children}</h2>
      <hr className="border-slate-700" />
    </div>
  );
}
