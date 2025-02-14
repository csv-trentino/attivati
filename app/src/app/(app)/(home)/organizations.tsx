import AppIcon from "@/components/ui/AppIcon";
import Box from "@/components/ui/Box";
import FavoriteButton from "@/components/ui/FavoriteButton";
import Icon from "@/components/ui/Icon";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import { useFilters, withFilters } from "@/contexts/filters";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Organization } from "@/types/data";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface OrganizationFilters {
  q?: string;
  favorite?: boolean;
}

function OrganizationListScreen() {
  const { t } = useTranslation();
  const listRef = useRef<FlashList<Organization>>(null);
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const { filters, setFilters } = useFilters<OrganizationFilters>();
  const { organizations, isLoading, refetch, fetchNextPage } = useOrganizations(filters);

  return (
    <SafeAreaView>
      <Box flex={1}>
        <Box
          height={48}
          borderBottomWidth={1}
          borderBottomColor="mainBorder"
          flexDirection="row"
          width="100%"
          justifyContent="space-between"
          paddingHorizontal="m"
          position="relative"
          alignItems="center"
          gap="m"
        >
          <Box minWidth={20}>
            <Icon name="search" size={24} />
          </Box>

          <Box flex={1}>
            <TextInput
              placeholder={t("organizationSearch", "Search organizations")}
              onChangeText={(t) => setFilters({ ...filters, q: t })}
            />
          </Box>
        </Box>
        <Box
          borderBottomWidth={1}
          borderBottomColor="mainBorder"
          flexDirection="row"
          gap="m"
          justifyContent="center"
          py="m"
        >
          <Pressable
            onPress={() => {
              setFavoriteOnly(false);
              setFilters({ ...filters, favorite: false });
            }}
          >
            <Box
              py="s"
              px="l"
              backgroundColor={favoriteOnly ? "whiteText" : "accentText"}
              borderRadius="s"
              borderWidth={1}
              borderColor="lightBorder"
              minWidth={110}
              alignItems="center"
            >
              <Text color={favoriteOnly ? "accentText" : "whiteText"} variant="body" fontSize={13}>
                Tutte
              </Text>
            </Box>
          </Pressable>

          <Pressable
            onPress={() => {
              setFavoriteOnly(!favoriteOnly);
              setFilters({ ...filters, favorite: true });
            }}
          >
            <Box
              py="s"
              px="l"
              borderWidth={1}
              backgroundColor={favoriteOnly ? "accentText" : "whiteText"}
              borderColor="lightBorder"
              borderRadius="s"
              minWidth={110}
              alignItems="center"
            >
              <Text variant="body" color={favoriteOnly ? "whiteText" : "accentText"} fontSize={13}>
                Preferite
              </Text>
            </Box>
          </Pressable>
        </Box>
        <FlashList
          ref={listRef}
          estimatedItemSize={195}
          refreshing={isLoading}
          onRefresh={() => refetch()}
          data={organizations || []}
          extraData={organizations}
          keyExtractor={(item) => `o-${item.id}`}
          onEndReachedThreshold={0.8}
          onEndReached={() => fetchNextPage()}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/organizations/${item.id}`)}>
              <Box
                flexDirection="row"
                gap="m"
                py="m"
                mx="m"
                borderBottomColor="lightBorder"
                borderBottomWidth={1}
                alignItems="center"
              >
                {item.logo ? (
                  <Box width={54} height={54} backgroundColor="lightBorder" borderRadius="full">
                    <Image
                      source={{ uri: item.logo }}
                      style={{ width: 54, height: 54, borderRadius: 500 }}
                    />
                  </Box>
                ) : (
                  <Box
                    width={54}
                    height={54}
                    backgroundColor="mainBorder"
                    borderRadius="full"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <AppIcon color="#fff" size={30} />
                  </Box>
                )}

                <Box flex={1}>
                  <Text variant="body">{item.name}</Text>
                  <Text variant="secondary">{item.city}</Text>
                </Box>

                <Box>
                  <FavoriteButton id={item.id} isFavorite={item.is_favorite} refetch={refetch} />
                </Box>
              </Box>
            </Pressable>
          )}
        />
      </Box>
    </SafeAreaView>
  );
}

export default withFilters(OrganizationListScreen);
