import {
  Input as InputField,
  InputProps as InputFieldProps,
} from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { forwardRef } from "react";

interface InputProps extends InputFieldProps {
  error?: string;
  label?: string;
}

export const InputUI = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, id, name, className, ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={id} className="text-white text-sm mb-2">
            {label}
          </Label>
        )}
        <InputField
          name={name}
          id={id}
          {...rest}
          ref={ref}
          className={cn(className, "w-full rounded text-slate-900")}
        />
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </div>
    );
  }
);
