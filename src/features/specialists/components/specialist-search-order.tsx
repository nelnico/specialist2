"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import { useSpecialistSearch } from "../specialist-search-provider";
import {
  escortSortOptionLabels,
  type SpecialistSortOption,
} from "../data/specialist-search-types";

const SpecialistSearchOrder = () => {
  const { searchParams, setSearchParams } = useSpecialistSearch();

  // current value from context (default to "newest")
  const rawValue = (searchParams?.sortOption ?? "newest") as string;

  // guard against unknown keys
  const value = useMemo<SpecialistSortOption | "newest">(() => {
    return Object.prototype.hasOwnProperty.call(
      escortSortOptionLabels,
      rawValue
    )
      ? (rawValue as SpecialistSortOption)
      : "newest";
  }, [rawValue]);

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        // update sort + reset page to 0 so results refresh from the top
        setSearchParams({
          ...searchParams,
          sortOption: next as SpecialistSortOption,
          page: 0,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(escortSortOptionLabels).map(([optValue, label]) => (
          <SelectItem key={optValue} value={optValue}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SpecialistSearchOrder;
