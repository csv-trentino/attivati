import { ExperienceCard } from "@/components/ExperienceCard";
import CategoryFilter from "@/components/SearchBar/CategoryFilter";
import DateFilter from "@/components/SearchBar/DateFilter";
import PlaceFilter from "@/components/SearchBar/PlaceFilter";
import RecentSearches from "@/components/SearchBar/RecentSearches";
import Box from "@/components/ui/Box";
import Icon from "@/components/ui/Icon";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import { useFilters } from "@/contexts/filters";
import { useSearches } from "@/contexts/searches";
import { useExperiences } from "@/hooks/useExperiences";
import { Experience, ExperienceFilters } from "@/types/data";
import { FlashList } from "@shopify/flash-list";
import { Href, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, TextInput } from "react-native";

export default function SearchPage() {
  const { t } = useTranslation();
  const { filters, setFilters } = useFilters<ExperienceFilters>();

  const [q, setQ] = useState<string>("");
  const listRef = useRef<FlashList<Experience>>(null);

  const { experiences, fetchNextPage, refetch, isLoading } = useExperiences();

  const { saveExperienceSearch } = useSearches();

  function handleSearch(needle: string) {
    setQ(needle);
    if (needle !== "") {
      saveExperienceSearch(needle);
      setFilters({ ...filters, q: needle });
      refetch();
    } else {
      setFilters({ ...filters, q: undefined });
      refetch();
    }
  }

  function onSearchInputBlur() {
    handleSearch(q);
  }

  // clear q filter when unmount
  useEffect(() => {
    return () => {
      setQ("");
      setFilters({ ...filters, q: undefined });
    };
  }, [setFilters]);

  return (
    <SafeAreaView>
      <Box flex={1}>
        <Box
          height={48}
          borderBottomWidth={1}
          flexDirection="row"
          borderBottomColor="mainBorder"
          width="100%"
          mb="m"
          paddingHorizontal="m"
          position="relative"
          alignItems="center"
          gap="m"
        >
          <Box minWidth={20}>
            <Pressable onPress={() => router.back()}>
              <Icon name="chevron-left" size={24} />
            </Pressable>
          </Box>
          <Box flex={1} style={{ paddingTop: 3 }}>
            <TextInput
              placeholder={t(
                "searchExperiencesOrOrganizations",
                "Search experiences or organizations",
              )}
              value={q}
              returnKeyType="search"
              autoFocus
              onBlur={onSearchInputBlur}
              onChangeText={(value) => {
                setQ(value);
                setFilters({ ...filters, q: value });
              }}
            />
          </Box>

          {q && q.length > 0 && (
            <Pressable onPress={() => handleSearch("")}>
              <Icon name="close" size={24} />
            </Pressable>
          )}
        </Box>
        <Box px="m">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Box flexDirection="row" gap="s" alignItems="center">
              <PlaceFilter />
              <DateFilter
                title={t("date", "Date")}
                value={{
                  from: filters?.date_start || null,
                  to: filters?.date_end || null,
                }}
                onChange={(value) => {
                  setFilters({
                    ...filters,
                    date_start: value?.from || undefined,
                    date_end: value?.to || undefined,
                  });
                }}
                onConfirm={console.log}
              />
              <CategoryFilter
                title={t("causes", "Causes")}
                values={filters?.categories || []}
                onChange={(values) => {
                  setFilters({
                    ...filters,
                    categories: values,
                  });
                }}
              />
            </Box>
          </ScrollView>
        </Box>

        <Box flex={1}>
          {(!q || q === "") && (
            <ScrollView>
              <Box px="m">
                <RecentSearches onSelect={handleSearch} />
              </Box>
            </ScrollView>
          )}

          {!isLoading && experiences.length === 0 && (
            <Box px="m">
              <Text py="xl" variant="header">
                {t("results", "Results")}
              </Text>
              <Text variant="body">
                {t(
                  "noResultsMsg",
                  "We are sorry, we didn't found any volunteer match with these criterias.",
                )}
              </Text>
            </Box>
          )}

          {!isLoading && experiences.length > 0 && q && q !== "" && (
            <FlashList
              ref={listRef}
              refreshing={isLoading}
              estimatedItemSize={195}
              onRefresh={() => refetch()}
              data={experiences || []}
              keyExtractor={(item) => `a-${item.id}`}
              ListHeaderComponent={
                <Box px="m">
                  <Text py="xl" variant="header">
                    {t("results", "Results")}
                  </Text>
                </Box>
              }
              onEndReachedThreshold={0.8}
              onEndReached={() => fetchNextPage()}
              ListEmptyComponent={<Text>{t("noResults", "No results")}</Text>}
              renderItem={({ item }) => (
                <ExperienceCard
                  experience={item}
                  onPress={() => {
                    router.push(`experiences/${item.id}` as Href);
                  }}
                />
              )}
            />
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
}
