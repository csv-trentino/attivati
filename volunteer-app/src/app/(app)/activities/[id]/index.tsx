import ExperienceDetails from "@/components/ExperienceDetails";
import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useNetwork } from "@/contexts/network";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { client } = useNetwork();
  if (!id || Array.isArray(id)) {
    throw new Error("id should be a string");
  }

  const experienceId = parseInt(id);

  const { data, isLoading } = useQuery({
    queryKey: ["activities", id],
    queryFn: async () => {
      const response = await client.GET("/activities/{id}", {
        params: {
          path: {
            id: experienceId,
          },
        },
      });

      if (!response?.data?.experience.organization) {
        return null;
      }

      const organizationResponse = await client.GET("/organizations/{id}", {
        params: {
          path: {
            id: response.data.experience.organization.id,
          },
        },
      });

      return {
        activity: response.data,
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

  return (
    <SafeAreaView>
      <ExperienceDetails
        activityStatus={data.activity.status}
        experience={data.activity.experience}
        isFavorite={data?.organization?.is_favorite}
      />

      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="mainBackground"
        flexDirection="row"
        pt="l"
        pb="xl"
        px="m"
      >
        <Box>
          {(data.activity.start_date || data.activity.end_date) && (
            <Text variant="secondary">{t("weWillWaitYou", "We'll wait you")}:</Text>
          )}
          <Box flexDirection="row" gap="xs">
            {data.activity.start_date && (
              <>
                <Text variant="body">{t("from", "From")}</Text>
                <Text variant="body">{format(new Date(data.activity.start_date), "d/MM")}</Text>
              </>
            )}
            {data.activity.end_date && (
              <>
                <Text variant="body">{t("to", "To").toLowerCase()}</Text>
                <Text variant="body">{format(new Date(data.activity.end_date), "d/MM")}</Text>
              </>
            )}
          </Box>
        </Box>
        {["pending", "approved"].indexOf(data.activity.status) >= 0 && (
          <Button
            variant="primary"
            label={t("Edit", "Edit")}
            paddingHorizontal="l"
            onPress={() => {
              router.push({
                pathname: `/activities/[id]/edit`,
                params: { id: data.activity.id },
              });
            }}
          />
        )}
      </Box>
    </SafeAreaView>
  );
}
