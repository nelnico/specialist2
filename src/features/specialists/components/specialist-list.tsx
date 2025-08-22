"use client";

import { useEffect, useRef } from "react";
import { useSpecialistSearch } from "../specialist-search-provider";
import { useInView } from "react-intersection-observer";
import SpecialistCard from "./specialist-card";
import useMounted from "@/hooks/use-mounted";

export default function SpecialistList() {
  const {
    specialists = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSpecialistSearch();

  const { ref, inView } = useInView({ threshold: 0.5 });
  const mounted = useMounted();

  const fetchingRef = useRef(false);

  useEffect(() => {
    if (mounted && !isLoading && !isFetchingNextPage) {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        sessionStorage.removeItem("scrollPosition");
      }
    }
  }, [mounted, isLoading, isFetchingNextPage]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !fetchingRef.current) {
      fetchingRef.current = true;

      (async () => {
        try {
          await fetchNextPage();
        } finally {
          setTimeout(() => {
            fetchingRef.current = false;
          }, 500); // Adjust delay if needed
        }
      })();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isLoading) return <div>Loading specialists...</div>;
  if (error) return <div>Error loading specialists</div>;

  const savePosition = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {specialists.map((specialist, index) => {
        const triggerIndex = Math.floor(specialists.length * 0.75);
        const refToUse =
          hasNextPage && index === triggerIndex ? ref : undefined;

        return (
          <SpecialistCard
            onClick={savePosition}
            key={specialist.id}
            specialist={specialist}
            ref={refToUse}
          />
        );
      })}

      {isFetchingNextPage && hasNextPage && (
        <div>
          <div>Loading more...</div>
        </div>
      )}
    </div>
  );
}
