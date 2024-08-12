import { useFilters } from "@/contexts/filters";
import { useNetwork } from "@/contexts/network";
import { ActivityFilters } from "@/types/data";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useOrganizations(initialFilters?: ActivityFilters) {
  const { client } = useNetwork();
  const { filters } = useFilters<ActivityFilters>(initialFilters);

  const { data, fetchNextPage, refetch, isLoading } = useInfiniteQuery({
    queryKey: ["organizations", filters, initialFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await client.GET("/organizations", {
        params: {
          query: {
            ...initialFilters, // todo should be in filters but it's not working
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

  console.log("fetching organizations", data);

  const organizations = useMemo(() => {
    console.log("memoizing organizations");

    const newOrganization = data?.pages.flatMap((page) => page?.results || []) || [];

    return newOrganization;
  }, [data]);

  return {
    organizations,
    fetchNextPage,
    refetch,
    isLoading,
  };
}
