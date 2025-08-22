"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import {
  DefaultSpecialistSearchParams,
  type SpecialistListItem,
  type SpecialistSortOption,
  type SpecialistsSearchForm,
  specialistsSearchSchema,
} from "./data/specialist-search-types";
import { searchSpecialist } from "./data/specialist-search-action";
import {
  useInfiniteQuery,
  type QueryFunctionContext,
  type InfiniteData,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/data/queryKeys";
import { omitEmptySearchValues } from "@/lib/helpers/empty-helpers";

const LOCAL_STORAGE_KEY = "last-search";
const PAGE_SIZE = 60;

interface SpecialistSearchProviderProps {
  children: ReactNode;
}

interface SpecialistSearchContextType {
  specialists?: SpecialistListItem[];
  searchParams: SpecialistsSearchForm;
  setSearchParams: (params: SpecialistsSearchForm) => void;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  changeOrder: (option: SpecialistSortOption) => void;
}

const SpecialistSearchContext = createContext<
  SpecialistSearchContextType | undefined
>(undefined);

type SearchKey = ReturnType<typeof queryKeys.specialistSearch>;

/** Synchronous localStorage hydration + zod validation */
function loadInitialSearchParams(): SpecialistsSearchForm {
  try {
    if (typeof window === "undefined") {
      return DefaultSpecialistSearchParams;
    }
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const merged = { ...DefaultSpecialistSearchParams, ...parsed };
    const res = specialistsSearchSchema.safeParse(merged);
    return res.success ? res.data : DefaultSpecialistSearchParams;
  } catch (e) {
    console.error("Failed to load search params:", e);
    return DefaultSpecialistSearchParams;
  }
}

/**
 * Build the payload for the server action:
 * - client 1-based page → server 0-based
 * - include client PAGE_SIZE
 * - omit empty values relative to defaults
 * - ALWAYS return an object (never undefined) to satisfy the server action signature
 */
function buildCleanSearchPayload(
  params: SpecialistsSearchForm,
  clientPage: number
): Partial<SpecialistsSearchForm> {
  const search: SpecialistsSearchForm = {
    ...params,
    page: Math.max(0, clientPage - 1),
    pageSize: PAGE_SIZE,
  };

  const clean = omitEmptySearchValues(
    search,
    DefaultSpecialistSearchParams
  ) as Partial<SpecialistsSearchForm>;

  // return {} if nothing meaningful changed; server action merges with defaults
  return Object.keys(clean).length === 0 ? {} : clean;
}

export const SpecialistSearchProvider: React.FC<
  SpecialistSearchProviderProps
> = ({ children }) => {
  const [searchParams, setSearchParams] = useState<SpecialistsSearchForm>(() =>
    loadInitialSearchParams()
  );

  // persist on change
  useEffect(() => {
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(searchParams)
      );
    } catch (e) {
      console.error("Failed to save search params:", e);
    }
  }, [searchParams]);

  const changeOrder = useCallback((option: SpecialistSortOption) => {
    setSearchParams((prev) => ({
      ...prev,
      sortOption: option,
      page: 0,
    }));
  }, []);

  const fetchSpecialists = async ({
    pageParam = 1,
  }: QueryFunctionContext<SearchKey, number>): Promise<
    SpecialistListItem[]
  > => {
    const clientPage =
      typeof pageParam === "number" ? pageParam : Number(pageParam) || 1;

    const payload = buildCleanSearchPayload(searchParams, clientPage);
    return await searchSpecialist(payload); // payload is always an object
  };

  const infiniteKey = useMemo<SearchKey>(
    () => queryKeys.specialistSearch(searchParams),
    [searchParams]
  );

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    error,
  } = useInfiniteQuery<
    SpecialistListItem[],
    Error,
    InfiniteData<SpecialistListItem[]>,
    SearchKey,
    number
  >({
    queryKey: infiniteKey,
    queryFn: fetchSpecialists,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined,
  });

  // Scroll-to-top when page changes
  useEffect(() => {
    if (typeof searchParams.page === "number") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchParams.page]);

  return (
    <SpecialistSearchContext.Provider
      value={{
        specialists: data?.pages.flatMap((p) => p) ?? [],
        searchParams,
        setSearchParams,
        changeOrder,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isFetching,
        error: error ?? null,
      }}
    >
      {children}
    </SpecialistSearchContext.Provider>
  );
};

export const useSpecialistSearch = () => {
  const ctx = useContext(SpecialistSearchContext);
  if (!ctx) {
    throw new Error(
      "useSpecialistSearch must be used within a SpecialistSearchProvider"
    );
  }
  return ctx;
};
