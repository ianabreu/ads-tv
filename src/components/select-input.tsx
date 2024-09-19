import {
  SelectContent,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placehoder: string;
}
export function SelectInput({
  options,
  value,
  onValueChange,
  placehoder,
}: SelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="min-w-[180px]">
        <SelectValue placeholder={placehoder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option} className="cursor-pointer">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
