import ExperienceDetails from "@/components/ExperienceDetails";
import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import { useNetwork } from "@/contexts/network";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { When } from "react-if";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExperienceScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { client } = useNetwork();
  if (!id || Array.isArray(id)) {
    throw new Error("id should be a string");
  }

  const experienceId = parseInt(id);

  const { data, isLoading } = useQuery({
    queryKey: ["experiences", id],
    queryFn: async () => {
      const experienceResponse = await client.GET("/experiences/{id}", {
        params: {
          path: {
            id: experienceId,
          },
        },
      });

      if (!experienceResponse?.data?.organization) {
        return null;
      }

      const organizationResponse = await client.GET("/organizations/{id}", {
        params: {
          path: {
            id: experienceResponse.data.organization.id,
          },
        },
      });

      return {
        experience: experienceResponse.data,
        organization: organizationResponse.data,
      };
    },
  });

  if (!data) {
    return null;
  }

  if (isLoading) {
    return (
      <SafeAreaView>
        <Box flex={1}>
          <ActivityIndicator />
        </Box>
      </SafeAreaView>
    );
  }

  const isEnded = new Date(data.experience.end_date.split("T")[0]) < new Date(new Date().toISOString().split("T")[0]);

  return (
    <SafeAreaView>
      <ExperienceDetails
        experience={data.experience}
        isFavorite={data?.organization?.is_favorite}
      />

      <When condition={!isEnded}>
        <Box
          position="absolute"
          bottom={32}
          left={0}
          right={0}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="primary"
            label={t("iWantToPartecipate", "I want to partecipate!")}
            paddingHorizontal="xl"
            borderRadius="full"
            onPress={() => {
              router.push(`/experiences/${id}/enroll`);
            }}
          />
        </Box>
      </When>
    </SafeAreaView> 
  );
}
