import { useFilters } from "@/contexts/filters";
import { useNetwork } from "@/contexts/network";
import { ExperienceFilters } from "@/types/data";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useExperiences(initialFilters: ExperienceFilters = {}) {
  const { client } = useNetwork();
  const { filters } = useFilters<ExperienceFilters>(); // do not works
  const { data, fetchNextPage, refetch, isLoading } = useInfiniteQuery({
    queryKey: ["experiences", filters, initialFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await client.GET("/experiences", {
        params: {
          query: {
            date_start: new Date().toISOString().split("T")[0],
            ...initialFilters,
            ...filters,
            published: true,
            page: pageParam,
          },
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage?.page_info.has_next_page ? lastPage?.page_info.page + 1 : null,
    initialPageParam: 1,
  });

  const experiences = useMemo(() => {
    return data?.pages.flatMap((page) => page?.results || []) || [];
  }, [data]);

  return {
    experiences,
    fetchNextPage,
    refetch,
    isLoading,
  };
}
