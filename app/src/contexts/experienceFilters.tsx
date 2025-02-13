import { ExperienceFilters, Place } from "@/types/data";
import * as Location from "expo-location";
import { createContext, useContext, useEffect, useState } from "react";
import { useFilters, withFilters } from "./filters";

export const ExperienceFiltersContext = createContext<{
  place: Place | null;
  setPlace: (place: Place | null) => void;
}>({
  place: null,
  setPlace: () => null,
});

export function useExperienceFilters(initialFilters?: ExperienceFilters) {
  const value = useContext(ExperienceFiltersContext);

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useExperienceFilters must be wrapped in a <FiltersProvider />");
    }
  }

  return value;
}

function ExperienceFiltersProvider(props: React.PropsWithChildren) {
  const { filters, setFilters } = useFilters<ExperienceFilters>();
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setFilters({
        ...filters,
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, [setFilters]);

  return (
    <ExperienceFiltersContext.Provider value={{ place, setPlace }}>
      {props.children}
    </ExperienceFiltersContext.Provider>
  );
}

export default withFilters(ExperienceFiltersProvider);
