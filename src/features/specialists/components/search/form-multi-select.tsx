"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import type { Control, FieldPath } from "react-hook-form";
import type { SpecialistsSearchForm } from "../../data/specialist-search-types";
import type { DataOption } from "@/lib/data/data-options";

/**
 * Restrict to fields that are arrays of numeric IDs in SpecialistsSearchForm
 */
export type SelectArrayField = Extract<
  FieldPath<SpecialistsSearchForm>,
  "genderIds" | "provinceIds" | "specialtyIds"
>;

interface FormMultiSelectProps<N extends SelectArrayField> {
  control: Control<SpecialistsSearchForm>;
  name: N;
  label: string;
  options: DataOption[]; // { label: string; value: number; priority?: number }
  placeholder?: string;
  sortByPriority?: boolean;
}

// Coerce any incoming value to number[] (helps if legacy state was strings or {value})
function coerceToNumberArray(val: unknown): number[] {
  if (!Array.isArray(val)) return [];
  return val
    .map((x) => {
      if (typeof x === "number") return x;
      if (typeof x === "string") return Number(x);
      if (x && typeof x === "object" && "value" in (x as any)) {
        const v = (x as any).value;
        return typeof v === "number" ? v : Number(v);
      }
      return NaN;
    })
    .filter((n): n is number => Number.isFinite(n));
}

export function FormMultiSelect<N extends SelectArrayField>({
  control,
  name,
  label,
  options,
  placeholder = "Select...",
  sortByPriority = true,
}: FormMultiSelectProps<N>) {
  const sorted = sortByPriority
    ? [...options].sort(
        (a, b) =>
          (a.priority ?? Number.MAX_SAFE_INTEGER) -
          (b.priority ?? Number.MAX_SAFE_INTEGER)
      )
    : options;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const currentNumbers = coerceToNumberArray(field.value);
        const values: string[] = currentNumbers.map(String);

        const handleChange = (vals: string[]) => {
          // Only store numbers in RHF state
          const selectedIds = vals
            .map((v) => Number(v))
            .filter((n) => Number.isFinite(n));
          field.onChange(selectedIds);
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <MultiSelect values={values} onValuesChange={handleChange}>
                <MultiSelectTrigger className="w-full max-w-[400px]">
                  <MultiSelectValue
                    placeholder={placeholder}
                    overflowBehavior="cutoff"
                  />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {sorted.map((o) => (
                      <MultiSelectItem key={o.value} value={String(o.value)}>
                        {o.label}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FormMultiSelect;
