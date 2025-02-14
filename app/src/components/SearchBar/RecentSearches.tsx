import Box from "@/components/ui/Box";
import Text from "@/components/ui/Text";
import { useSearches } from "@/contexts/searches";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

interface RecentSearchesProps {
  onSelect: (value: string) => void;
}

const RecentSearches: FC<RecentSearchesProps> = ({ onSelect }) => {
  const { t } = useTranslation();

  const { searches, deleteAll } = useSearches();

  return searches.experiences.length > 0 ? (
    <Box mt="xl">
      <Box flexDirection="row" alignItems="flex-end">
        <Box flex={1}>
          <Text variant="header">{t("recentSearches", "Recent Searches")}</Text>
        </Box>
        <Box flex={1} alignItems="flex-end" pb="s">
          <Pressable onPress={deleteAll}>
            <Text variant="link">{t("deleteAll", "Delete All")}</Text>
          </Pressable>
        </Box>
      </Box>

      <Box mt="m" borderTopWidth={1} borderTopColor="mainBorder">
        {searches.experiences.map((search, index) => (
          <Pressable key={search} onPress={() => onSelect(search)}>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              py="m"
              borderBottomWidth={1}
              borderBottomColor="mainBorder"
            >
              <Text variant="body">{search}</Text>
            </Box>
          </Pressable>
        ))}
      </Box>
    </Box>
  ) : null;
};

export default RecentSearches;
