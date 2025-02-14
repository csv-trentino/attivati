import { Theme } from "@/config/theme";
import { useExperienceFilters } from "@/contexts/experienceFilters";
import { useFilters } from "@/contexts/filters";
import { ExperienceFilters, Place } from "@/types/data";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import * as Location from "expo-location";
import { FC, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Box from "../ui/Box";
import Icon from "../ui/Icon";
import Text from "../ui/Text";
import FilterHeader from "./FilterHeader";
import PlaceChooser from "./PlaceChooser";

interface PlaceFilterProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
}

const PlaceFilter: FC<PlaceFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { place, setPlace } = useExperienceFilters();
  const { filters, setFilters } = useFilters<ExperienceFilters>();

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, [bottomSheetModalRef]);

  const setCurrentLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setFilters({ ...filters, lat: location.coords.latitude, lng: location.coords.longitude });
    setPlace(null);
  }, [bottomSheetModalRef, setPlace]);

  const handlePlaceChange = async (place: Place | null) => {
    setPlace(place);

    if (place === null) {
      setCurrentLocation();
    } else {
      setFilters({ ...filters, lat: place?.latitude, lng: place?.longitude });
    }

    handleCloseModalPress();
  };

  return (
    <TouchableOpacity onPress={handlePresentModalPress}>
      <Box
        flexDirection="row"
        borderRadius="s"
        alignItems="center"
        paddingHorizontal="m"
        backgroundColor="primaryLightBackground"
        paddingVertical="s"
        gap="s"
      >
        <Icon
          name={"position"}
          size={16}
          // shadowColor={selected ? theme.colors.accentText : theme.colors.secondaryText}
          strokeWith="0"
          fill={theme.colors.accentText}
          color={theme.colors.accentText}
        />
        {place ? (
          <Text variant="secondary" color="accentText" fontSize={13}>
            {place.name}
          </Text>
        ) : (
          <Text variant="secondary" color="accentText" fontSize={13}>
            {t("yourLocation", "Your location")}
          </Text>
        )}
        <Icon
          name="caret-down"
          size={8}
          fill={theme.colors.accentText}
          color={theme.colors.accentText}
        />
      </Box>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        enablePanDownToClose={true}
        handleComponent={null}
        snapPoints={["90%"]}
        backgroundStyle={styles.modalBackground}
        backdropComponent={(props) => (
          <BottomSheetBackdrop opacity={0.6} {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
      >
        <BottomSheetScrollView style={{}}>
          <FilterHeader
            title={value ? value : t("choosePosition", "Choose Position")}
            onClose={handleCloseModalPress}
          />
          <PlaceChooser onChange={handlePlaceChange} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default PlaceFilter;
