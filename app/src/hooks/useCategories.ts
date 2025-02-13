import { useNetwork } from "@/contexts/network";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  const { client } = useNetwork();
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await client.GET("/categories");
      return response.data;
    },
  });

  return {
    categories: data,
    isLoading,
  };
}
