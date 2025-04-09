
import { ReactNode } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

type FieldProps = {
  form: UseFormReturn<any>;
  name: string;
  label: ReactNode;
  icon: ReactNode;
  placeholder: string;
  type?: string;
  disabled?: boolean;
};

const AuthFormField = ({
  form,
  name,
  label,
  icon,
  placeholder,
  type = "text",
  disabled = false,
}: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 flex items-center gap-2">
            {icon} {label}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className="border-gray-300 focus:border-hatch-coral focus:ring-hatch-coral/20 transition-all duration-300"
              disabled={disabled}
            />
          </FormControl>
          <FormMessage className="text-hatch-coral" />
        </FormItem>
      )}
    />
  );
};

export default AuthFormField;
