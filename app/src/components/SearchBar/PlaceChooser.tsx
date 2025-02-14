import { Theme } from "@/config/theme";
import { usePlaces } from "@/hooks/usePlaces";
import { Place } from "@/types/data";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@shopify/restyle";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import Box from "../ui/Box";
import Icon from "../ui/Icon";
import InputText from "../ui/InputText";
import Text from "../ui/Text";

interface PlaceChooserProps {
  value?: Place | null;
  onChange: (value: Place | null) => void;
}

const PlaceChooser: FC<PlaceChooserProps> = ({ value, onChange }) => {
  const listRef = useRef<FlashList<Place>>(null);
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [search, setSearch] = useState<string>("");

  const placeFilter = useMemo(() => {
    if (search === "") {
      return {};
    }

    return {
      q: search,
    };
  }, [search]);

  const { places, fetchNextPage, isLoading, refetch } = usePlaces(placeFilter);

  const handleSetCurrentLocation = useCallback(() => {
    onChange(null);
  }, [onChange]);

  useEffect(() => {
    refetch();
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [search, refetch]);

  const sortedPlaces = useMemo(() => {
    return (places || []).sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }, [places]);

  return (
    <Box height="100%">
      <Box marginHorizontal="m" marginTop="m" gap="m">
        <InputText
          value={search || ""}
          onChangeText={setSearch}
          placeholder={t("searchACity", "Search a city")}
          autoFocus
        />
        {search.length < 3 && (
          <Pressable onPress={handleSetCurrentLocation}>
            <Box flexDirection="row" gap="s" alignItems="center">
              <Icon name="marker" color={theme.colors.accentText} />
              <Text variant="link" color="accentText" textDecorationLine="none" fontWeight="100">
                {t("useYourLocation", "Use your location")}
              </Text>
            </Box>
          </Pressable>
        )}
      </Box>

      {search.length >= 3 && (
        <Box flex={1}>
          <FlashList
            estimatedItemSize={30}
            refreshing={isLoading}
            ref={listRef}
            onRefresh={() => refetch()}
            data={sortedPlaces}
            keyExtractor={(item) => `p-${item.id}`}
            onEndReachedThreshold={0.8}
            onEndReached={() => fetchNextPage()}
            renderItem={({ item: place }) => (
              <Pressable key={place.id} onPress={() => onChange(place)}>
                <Box
                  flexDirection="row"
                  marginHorizontal="m"
                  gap="s"
                  alignItems="center"
                  py="m"
                  borderBottomWidth={1}
                  borderBottomColor="mainBorder"
                >
                  <Text variant="body" textDecorationLine="none" fontWeight="100">
                    {place.name}
                  </Text>
                </Box>
              </Pressable>
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default PlaceChooser;
