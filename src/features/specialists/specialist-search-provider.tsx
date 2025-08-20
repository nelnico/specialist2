"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DefaultSpecialistSearchParams,
  SpecialistListItem,
  SpecialistSortOption,
  SpecialistsSearchForm,
} from "./specialist-search-types";
import { searchSpecialist } from "./specialist-search-action";
import {
  useInfiniteQuery,
  type QueryFunctionContext,
  type InfiniteData,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/data/queryKeys";
import { omitEmptySearchValues } from "@/lib/helpers/empty-helpers";

const LOCAL_STORAGE_KEY = "last-search";
const PAGE_SIZE = 10;

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

export const SpecialistSearchProvider: React.FC<
  SpecialistSearchProviderProps
> = ({ children }) => {
  const [searchParams, setSearchParams] = useState<SpecialistsSearchForm>(
    DefaultSpecialistSearchParams
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSearchParams({ ...DefaultSpecialistSearchParams, ...parsed });
      }
    } catch (err) {
      console.error("Failed to load search params:", err);
      setSearchParams(DefaultSpecialistSearchParams);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(searchParams));
    } catch (err) {
      console.error("Failed to save search params:", err);
    }
  }, [searchParams]);

  const changeOrder = (option: SpecialistSortOption) => {
    setSearchParams((prev) => ({
      ...prev,
      sortOption: option,
      page: 0, // server expects 0-based
    }));
  };

  const fetchSpecialists = async ({
    pageParam = 1,
  }: QueryFunctionContext<SearchKey, number>): Promise<
    SpecialistListItem[]
  > => {
    const clientPage =
      typeof pageParam === "number" ? pageParam : Number(pageParam) || 1;
    const search: SpecialistsSearchForm = {
      ...searchParams,
      page: Math.max(0, clientPage - 1), // convert to 0-based for server
      pageSize: PAGE_SIZE,
    };
    const clean = omitEmptySearchValues(
      search,
      DefaultSpecialistSearchParams
    ) as Partial<SpecialistsSearchForm>;
    return await searchSpecialist(clean);
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
    initialPageParam: 1, // client is 1-based
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.length ? allPages.length + 1 : undefined,
  });

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
