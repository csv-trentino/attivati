import { useFilters } from "@/contexts/filters";
import { useNetwork } from "@/contexts/network";
import { PlaceFilters } from "@/types/data";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function usePlaces(initialFilters: PlaceFilters = {}) {
  const { client } = useNetwork();
  const { filters } = useFilters<PlaceFilters>(initialFilters); // do not works

  const { data, fetchNextPage, refetch, isLoading } = useInfiniteQuery({
    queryKey: ["places", filters, initialFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await client.GET("/places", {
        params: {
          query: {
            ...initialFilters,
            ...filters,
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

  const places = useMemo(() => {
    return data?.pages.flatMap((page) => page?.results || []) || [];
  }, [data]);

  return {
    places,
    fetchNextPage,
    refetch,
    isLoading,
  };
}
