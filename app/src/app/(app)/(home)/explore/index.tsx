import { ExperienceCard } from "@/components/ExperienceCard";
import SearchBar from "@/components/SearchBar";
import Box from "@/components/ui/Box";
import Icon from "@/components/ui/Icon";
import Text from "@/components/ui/Text";
import { Theme } from "@/config/theme";
import { useFilters } from "@/contexts/filters";
import { useExperiences } from "@/hooks/useExperiences";
import { Experience, ExperienceFilters } from "@/types/data";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@shopify/restyle";
import { useQueryClient } from "@tanstack/react-query";
import { Href, router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

function ExploreListScreen() {
  const theme = useTheme<Theme>();
  const { t } = useTranslation();
  const listRef = useRef<FlashList<Experience>>(null);
  const queryClient = useQueryClient();

  const { filters } = useFilters<ExperienceFilters>();

  const { experiences, fetchNextPage, refetch, isLoading } = useExperiences({
    date_start: filters.date_start || new Date().toISOString().split("T")[0],
    date_end: filters.date_end || undefined,
    categories: filters.categories,
    q: filters.q,
  });

  const handleRefetch = useCallback(() => {
    queryClient.invalidateQueries();
    refetch();
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [refetch, queryClient]);

  useEffect(() => {
    handleRefetch();
  }, [handleRefetch]);

  return (
    <Box flex={1}>
      <FlashList
        ref={listRef}
        estimatedItemSize={195}
        refreshing={isLoading}
        onRefresh={handleRefetch}
        data={experiences || []}
        keyExtractor={(item) => `a-${item.id}`}
        onEndReachedThreshold={0.8}
        onEndReached={() => fetchNextPage()}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center" mt="2xl">
            {!isLoading ? (
              <Text variant="body" color="darkBackground">
                {t("noResults", "No results")}
              </Text>
            ) : (
              <ActivityIndicator color={theme.colors.accentText} />
            )}
          </Box>
        }
        ListHeaderComponent={
          <Box paddingHorizontal="m" marginBottom="m" backgroundColor="mainBackground">
            <SearchBar />
          </Box>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <ExperienceCard
            experience={item}
            onPress={() => {
              router.push(`experiences/${item.id}` as Href);
            }}
          />
        )}
      />
      <Box
        position="absolute"
        zIndex={100}
        bottom={35}
        left={0}
        right={0}
        justifyContent="center"
        alignItems="center"
      >
        <TouchableOpacity onPress={() => router.push("/explore/map")}>
          <Box
            backgroundColor="darkBackground"
            paddingHorizontal="l"
            paddingVertical="s"
            borderRadius="full"
            flexDirection="row"
            alignItems="center"
            gap="m"
          >
            <Icon name="map" size={28} color="#FFF" />
            <Text variant="body" fontSize={13} color="whiteText">
              {t("seeOnMap", "See on map")}
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
}

export default ExploreListScreen;
