import { forwardRef } from "react";
import { FieldError } from "./form";
import { Input as InputPrimitive } from "../ui/input";
import { Textarea as TextareaPrimitive } from "../ui/textarea";
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

export const Input = forwardRef<HTMLInputElement, InputPropsWClass>(function Input(
  { label, type = "text", ...props },
  ref
) {
  return (
    <FormItem label={label} name={props.name}>
      <InputPrimitive type={type} ref={ref} {...props} />
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
          <div className="flex items-center gap-2 mt-6 mb-2">
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
          <FormLabel>End Date</FormLabel>
          <DateTimePickerPrimitive
            ref={ref}
            value={
              props.initialValues
                ? new CalendarDateTime(...convertDate(field.value, false))
                : undefined
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
