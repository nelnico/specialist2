"use client";

import { useMemo, useEffect } from "react";
import { isEqual } from "lodash";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSpecialistSearch } from "../specialist-search-provider";
import {
  specialistsSearchSchema,
  type SpecialistsSearchForm,
} from "../data/specialist-search-types";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
const SpecialistSearchForm = () => {
  const { searchParams, setSearchParams } = useSpecialistSearch();

  const normalizedDefaults = useMemo(
    () => specialistsSearchSchema.parse(searchParams ?? {}),
    [searchParams]
  );

  const form = useForm<SpecialistsSearchForm>({
    resolver: zodResolver(
      specialistsSearchSchema
    ) as Resolver<SpecialistsSearchForm>,
    defaultValues: normalizedDefaults,
    mode: "onChange",
  });

  const { register, control, reset } = form;

  useEffect(() => {
    reset(normalizedDefaults);
  }, [normalizedDefaults, reset]);

  const formWatch = useWatch<SpecialistsSearchForm>({ control });
  const debounced = useDebounce(formWatch, 300);

  useEffect(() => {
    if (!isEqual(debounced, searchParams)) {
      const merged = { ...searchParams, ...debounced };
      const parsed = specialistsSearchSchema.parse(merged);

      const queryChanged = parsed.query !== searchParams.query;
      const next: SpecialistsSearchForm = {
        ...parsed,
        page: queryChanged ? 0 : parsed.page,
      };

      if (!isEqual(next, searchParams)) {
        setSearchParams(next);
      }
    }
  }, [debounced, searchParams, setSearchParams]);

  useEffect(() => {
    if (!isEqual(formWatch, searchParams)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [formWatch, searchParams]);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="query"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Search</FormLabel>
            <FormControl>
              <Input
                placeholder="Search specialists…"
                {...field}
                autoComplete="off"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};

export default SpecialistSearchForm;
