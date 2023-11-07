import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useHookForm, UseFormProps as UseHookFormProps } from "react-hook-form";
import { ZodSchema, TypeOf } from "zod";

interface UseFormProps<T extends ZodSchema<any>> extends UseHookFormProps<TypeOf<T>> {
  schema: T;
}

export const useForm = <T extends ZodSchema<any>>({ schema, ...formConfig }: UseFormProps<T>) => {
  return useHookForm({
    ...formConfig,
    resolver: zodResolver(schema),
  });
};
