import { useNetwork } from "@/contexts/network";
import { ProfileData } from "@/types/data";
import { useMutation } from "@tanstack/react-query";

export default function useProfile() {
  const { client } = useNetwork();

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileData) => {
      return client.PATCH("/auth/user", {
        body: data,
      });
    },
  });

  return {
    updateProfile,
  };
}
