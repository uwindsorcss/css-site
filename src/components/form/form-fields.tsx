import { forwardRef } from "react";
import { FieldError } from "./form";
import { Input as InputPrimitive } from "../ui/input";
import { Textarea as TextareaPrimitive } from "../ui/textarea";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  Select as SelectPrimitive,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormField, FormItem as FormItemPrimitive, FormLabel, FormMessage } from "../ui/form";
import { Checkbox as CheckboxPrimitive } from "../ui/checkbox";
import { CalendarDateTime } from "@internationalized/date";
import { DateTimePicker as DateTimePickerPrimitive } from "../ui/date-time-picker/date-time-picker";

interface InputProps {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
}

interface InputPropsWClass extends InputProps {
  className?: string;
}

const FormItem = ({ label, name, children }: any) => {
  return (
    <FormItemPrimitive>
      <FormLabel>{label}</FormLabel>
      {children}
      <FieldError name={name} />
    </FormItemPrimitive>
  );
};

export const Input = forwardRef<HTMLInputElement, InputPropsWClass>(function Input(props, ref) {
  return (
    <FormItem label={props.label} name={props.name}>
      <InputPrimitive type={props.type} ref={ref} className={props.className} {...props} />
    </FormItem>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, InputPropsWClass>(function Textarea(
  { label, type = "text", className, ...props },
  ref
) {
  return (
    <FormItem label={label} name={props.name}>
      <TextareaPrimitive ref={ref} className={className || "h-30"} {...props} />
    </FormItem>
  );
});

export const Checkbox = forwardRef<HTMLInputElement, any>(function Checkbox(
  { label, ...props },
  ref
) {
  const id = `checkbox-${props.name}`;
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItemPrimitive>
          <div className="mb-2 mt-6 flex items-center gap-2">
            <CheckboxPrimitive
              ref={ref}
              id={id}
              size="medium"
              checked={field.value}
              onCheckedChange={field.onChange}
              {...props}
            />
            <FormLabel htmlFor={id} className="cursor-pointer">
              {label}
            </FormLabel>
          </div>
          <FieldError name={props.name} />
        </FormItemPrimitive>
      )}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, any>(function Select(props, ref) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem label={props.label} name={props.name}>
          <SelectPrimitive onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {props.options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectPrimitive>
        </FormItem>
      )}
    />
  );
});

export const DateTimePicker = forwardRef<HTMLInputElement, any>(function DateTimePicker(
  { label, ...props },
  ref
) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <DateTimePickerPrimitive
            ref={ref}
            value={
              field.value ? new CalendarDateTime(...convertDate(field.value, false)) : undefined
            }
            granularity={"minute"}
            onChange={field.onChange}
            label="End Date"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

export function convertDate(
  date: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  },
  adjustMonth = true
): [number, number, number, number, number] {
  return [date.year, adjustMonth ? date.month - 1 : date.month, date.day, date.hour, date.minute];
}
