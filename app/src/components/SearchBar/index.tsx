import { useFilters } from "@/contexts/filters";
import { ExperienceFilters } from "@/types/data";
import { router } from "expo-router";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Box from "../ui/Box";
import Icon from "../ui/Icon";
import Text from "../ui/Text";
import CategoryFilter from "./CategoryFilter";
import DateFilter from "./DateFilter";
import PlaceFilter from "./PlaceFilter";

const SearchBar: FC = () => {
  const { t } = useTranslation();
  const { filters, setFilters } = useFilters<ExperienceFilters>();

  return (
    <Box>
      <Pressable onPress={() => router.push("/search")}>
        <Box
          borderRadius="full"
          height={64}
          marginTop="l"
          marginBottom="m"
          backgroundColor="mainBackground"
          alignItems="center"
          justifyContent="space-between"
          flexDirection="row"
          paddingHorizontal="m"
          shadowColor="shadow"
          shadowOffset={{ width: -2, height: 4 }}
          shadowOpacity={0.2}
          shadowRadius={3}
          elevation={6}
        >
          <Icon name="search" />
          <Box marginLeft="m" flex={1}>
            <Text variant="body" fontWeight="bold" lineHeight={20}>
              {t("search", "Search")}
            </Text>
            <Text variant="secondary">
              {t("volunteersActvities", "Volunteer activities")} •{" "}
              {t("organizations", "Organizations")}
            </Text>
          </Box>

          {filters.q && (
            <Pressable onPress={() => setFilters({ ...filters, q: undefined })}>
              <Icon name="close" />
            </Pressable>
          )}
        </Box>
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Box flexDirection="row" gap="s" alignItems="center">
          <PlaceFilter />
          <DateFilter
            title={t("date", "Date")}
            value={{
              from: filters.date_start || null,
              to: filters.date_end || null,
            }}
            onChange={(value) => {
              setFilters({
                ...filters,
                date_start: value?.from || undefined,
                date_end: value?.to || undefined,
              });
            }}
            onConfirm={() => {
              Keyboard.dismiss();
            }}
          />
          <CategoryFilter
            title={t("categories", "Categories")}
            values={filters.categories || []}
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
  );
};

export default SearchBar;
