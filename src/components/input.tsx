import { RegisterOptions, UseFormRegister } from "react-hook-form";
import {
  Input as InputField,
  InputProps as InputFieldProps,
} from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface InputProps extends InputFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  label?: string;
}

export function Input({
  name,
  placeholder,
  type,
  register,
  rules,
  error,
  className,
  label,
  ...InputFieldProps
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={name} className="text-white text-sm mb-2">
          {label}
        </Label>
      )}
      <InputField
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
        className={cn("w-full border-0 rounded text-slate-900", className)}
        {...InputFieldProps}
      />
      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  );
}
