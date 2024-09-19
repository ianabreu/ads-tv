import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode } from "react";

interface CheckBoxWithTextProps {
  checked: boolean;
  onCheck: () => void;
  children: ReactNode;
}

export function CheckBoxWithText({
  onCheck,
  children,
  checked,
}: CheckBoxWithTextProps) {
  return (
    <div className="items-top flex space-x-2 text-white">
      <Checkbox
        id="1"
        onCheckedChange={onCheck}
        checked={checked}
        className="border-white"
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="1"
          className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {children}
        </label>
      </div>
    </div>
  );
}
