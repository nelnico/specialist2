"use client";

import { useEffect, useState } from "react";
import { useSpecialistSearch } from "../../specialist-search-provider";
import { useInView } from "react-intersection-observer";
import SpecialistCard from "./specialist-card";
import useMounted from "@/hooks/use-mounted";
import { useRouter } from "next/navigation";

export default function SpecialistList() {
  const {
    specialists = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSpecialistSearch();

  const mounted = useMounted();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "400px 0px",
  });

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
    if (!inView) return;
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;

    fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;

    const needsMore =
      document.documentElement.scrollHeight <= window.innerHeight + 100;

    if (needsMore) {
      fetchNextPage();
    }
  }, [
    specialists.length,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  ]);

  if (isLoading) return <div>Loading specialists...</div>;
  if (error) return <div>Error loading specialists</div>;

  const savePosition = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
  };

  const handleCardClick = (id: number) => {
    setLoadingId(id);
    savePosition();
    router.push(`/${id}`);
  };

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mt-4">
        {specialists.map((specialist) => (
          <SpecialistCard
            key={specialist.id}
            specialist={specialist}
            onClick={() => handleCardClick(specialist.id)}
            isLoading={loadingId === specialist.id}
          />
        ))}
      </div>

      <div ref={sentinelRef} />

      {isFetchingNextPage && hasNextPage && (
        <div>
          <div>Loading more...</div>
        </div>
      )}
    </div>
  );
}
