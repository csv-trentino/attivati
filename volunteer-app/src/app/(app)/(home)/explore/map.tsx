import { ExperienceCard } from "@/components/ExperienceCard";
import SearchBar from "@/components/SearchBar";
import Box from "@/components/ui/Box";
import Icon from "@/components/ui/Icon";
import Text from "@/components/ui/Text";
import { useFilters } from "@/contexts/filters";
import { useExperiences } from "@/hooks/useExperiences";
import { Experience } from "@/types/data";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { Href, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Marker, Region } from "react-native-maps";

const pinBlack = require("@/assets/images/location-pin-black.png");
const pinPink = require("@/assets/images/location-pin-pink.png");

const TRENTO_LATLONG = [ 41.87194, 12.56738];

export default function ExploreMapScreen() {
  const mapRef = useRef<MapView>(null);
  const { t } = useTranslation();
  const { filters, setFilters } = useFilters();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [movingCamera, setMovingCamera] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.getCamera().then((camera) => {
      setMovingCamera(true);

      mapRef.current?.setCamera({
        center: {
          latitude: filters.lat || TRENTO_LATLONG[0],
          longitude: filters.lng || TRENTO_LATLONG[1],
        },
      });
    });
  }, [filters.lat, filters.lng]);

  const { experiences, isLoading } = useExperiences();

  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  function handleMarkerPress(experience: Experience) {
    if (!selectedExperience) {
      bottomSheetModalRef.current?.present();
    }
    setSelectedExperience(experience);
  }

  function handleRegionChange(region: Region) {
    if (movingCamera) {
      setMovingCamera(false);
      return;
    }

    setFilters({
      ...filters,
      lat: region.latitude,
      lng: region.longitude,
      per_page: 100,
    });
  }

  function handleCloseExperience() {
    if (selectedExperience) {
      bottomSheetModalRef.current?.dismiss();
      setSelectedExperience(null);
    }
  }

  return (
    <Box flex={1}>
      <Box paddingHorizontal="m" marginBottom="m" backgroundColor="mainBackground">
        <SearchBar />
      </Box>
      <MapView
        initialRegion={{
          latitude: filters.lat || TRENTO_LATLONG[0],
          longitude: filters.lng || TRENTO_LATLONG[1],
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
        ref={mapRef}
        moveOnMarkerPress={false}
        rotateEnabled={false}
        onRegionChangeComplete={handleRegionChange}
        onRegionChange={handleCloseExperience}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {experiences.map((experience) => (
          <Marker
            key={experience.id}
            image={selectedExperience?.id === experience.id ? pinBlack : pinPink}
            coordinate={{
              latitude: experience.latitude,
              longitude: experience.longitude,
            }}
            onSelect={() => handleMarkerPress(experience)}
          />
        ))}
      </MapView>

      <Box
        position="absolute"
        zIndex={100}
        bottom={35}
        left={0}
        right={0}
        justifyContent="center"
        alignItems="center"
      >
        {!selectedExperience && (
          <TouchableOpacity onPress={() => router.back()}>
            <Box
              backgroundColor="darkBackground"
              paddingHorizontal="l"
              paddingVertical="s"
              borderRadius="full"
              flexDirection="row"
              alignItems="center"
              gap="m"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Icon name="list" size={28} color="#FFF" />
                  <Text variant="body" fontSize={13} color="whiteText">
                    {t("seeAsList", "See as list")}
                  </Text>
                </>
              )}
            </Box>
          </TouchableOpacity>
        )}
      </Box>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          enablePanDownToClose={true}
          onDismiss={() => setSelectedExperience(null)}
          enableDynamicSizing={true}
          handleComponent={null}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0)",
          }}
        >
          <BottomSheetView style={{}}>
            <Box width="100%" paddingBottom="l">
              {selectedExperience && (
                <ExperienceCard
                  experience={selectedExperience}
                  onPress={() => {
                    router.push(`experiences/${selectedExperience.id}` as Href);
                  }}
                  onClose={handleCloseExperience}
                />
              )}
            </Box>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </Box>
  );
}
