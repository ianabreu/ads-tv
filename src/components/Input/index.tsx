import { RegisterOptions, UseFormRegister } from "react-hook-form";
import {
  Input as InputField,
  InputProps as InputFieldProps,
} from "../ui/input";
import { cn } from "@/lib/utils";

interface InputProps extends InputFieldProps {
  type: string;
  placeholder: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

export function Input({
  name,
  placeholder,
  type,
  register,
  rules,
  error,
  className,
  ...InputFieldProps
}: InputProps) {
  return (
    <div>
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
