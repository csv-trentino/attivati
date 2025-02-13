import { ActivityCard } from "@/components/ActivityCard";
import DoneActivityList from "@/components/DoneActivitiesList";
import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import { useFilters } from "@/contexts/filters";
import { useActivities } from "@/hooks/useActivities";
import { Activity, ActivityFilters } from "@/types/data";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function ActivitiesScreen() {
  const { t } = useTranslation();
  const listRef = useRef<FlashList<Activity>>(null);

  const { filters } = useFilters<ActivityFilters>();

  const { activities, fetchNextPage, refetch, isLoading } = useActivities({
    // end_date_from: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    refetch();

    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [filters, refetch]);

  const orderedActivities = useMemo(() => {
    return activities.sort((a, b) => {
      if (a.start_date < b.start_date) {
        return -1;
      }
      if (a.start_date > b.start_date) {
        return 1;
      }
      return 0;
    });
  }, [activities]);

  return (
    <SafeAreaView>
      <Box px="m" mt="2xl" mb="l">
        <Text variant="header">{t("volunteersActvities", "Volunteer activities")}</Text>
      </Box>

      <Box flex={1}>
        <FlashList
          estimatedItemSize={195}
          refreshing={isLoading}
          ref={listRef}
          onRefresh={() => refetch()}
          data={orderedActivities}
          keyExtractor={(item) => `a-${item.id}`}
          onEndReachedThreshold={0.8}
          onEndReached={() => fetchNextPage()}
          renderItem={({ item }) => (
            <ActivityCard
              activity={item}
              onPress={() => {
                router.push({
                  pathname: `/activities/[id]`,
                  params: { id: item.id },
                });
              }}
            />
          )}
          ListEmptyComponent={() =>
            !isLoading && (
              <Box px="m">
                <Box
                  borderColor="mainBorder"
                  borderWidth={1}
                  borderRadius="m"
                  marginVertical="m"
                  mt="l"
                  py="l"
                  px="m"
                  gap="l"
                  width="100%"
                >
                  <Text variant="header" color="accentText" textAlign="center">
                    {t("Hey", "Hey!")}
                  </Text>

                  <Text variant="body" textAlign="center">
                    {t(
                      "noExperiences",
                      "It looks like you don't have any scheduled volunteer experiences.",
                    )}
                  </Text>

                  <Button
                    variant="primary"
                    label={t("searchExperiences", "Explore experiences")}
                    onPress={() => router.push("/explore")}
                  />
                </Box>
              </Box>
            )
          }
          ListFooterComponent={() => <DoneActivityList />}
        />
      </Box>
    </SafeAreaView>
  );
}
