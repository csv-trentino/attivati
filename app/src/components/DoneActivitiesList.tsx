import { ActivityCard } from "@/components/ActivityCard";
import Box from "@/components/ui/Box";
import Text from "@/components/ui/Text";
import { useFilters } from "@/contexts/filters";
import { useActivities } from "@/hooks/useActivities";
import { Activity, ActivityFilters } from "@/types/data";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { DoneActivityCard } from "./DoneActivityCard";

export default function DoneActivityList() {
  const { t } = useTranslation();
  const listRef = useRef<FlashList<Activity>>(null);

  const { filters } = useFilters<ActivityFilters>();

  const { activities, fetchNextPage, refetch, isLoading } = useActivities({
    end_date_to: new Date().toISOString().split("T")[0],
    status: "approved",
  });

  useEffect(() => {
    refetch();

    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [filters, refetch]);

  return (
    <FlashList
      estimatedItemSize={195}
      refreshing={isLoading}
      onRefresh={() => refetch()}
      data={activities}
      keyExtractor={(item) => `a-${item.id}`}
      onEndReachedThreshold={0.8}
      onEndReached={() => fetchNextPage()}
      renderItem={({ item }) => (
        <DoneActivityCard
          activity={item}
          onPress={() => {
            router.push(`experiences/activities/${item.id}`);
          }}
        />
      )}
      ListHeaderComponent={() => (
        <Box px="m" mt="2xl">
          <Text variant="inputLabel">{t("doneActivities", "Done activities")}</Text>
        </Box>
      )}
      ListEmptyComponent={() =>
        !isLoading && (
          <Box px="m" py="l">
            <Pressable onPress={() => refetch()}>
              <Text variant="secondary" textAlign="center">
                {t("noDoneExperiences", "You have not participated in any activities yet")}
              </Text>
            </Pressable>
          </Box>
        )
      }
    />
  );
}
