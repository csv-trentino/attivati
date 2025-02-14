import { RecentSearches } from "@/types/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const SEARCHES_KEY = "recentSearches";

const SearchesContext = createContext<{
  searches: RecentSearches;
  setSearches: (searches: RecentSearches) => void;
  saveExperienceSearch: (search: string) => void;
  deleteAll: () => void;
}>({
  searches: {
    experiences: [],
    organizations: [],
  },
  setSearches: () => console.warn("no search provider"),
  saveExperienceSearch: () => console.warn("no search provider"),
  deleteAll: () => console.warn("no search provider"),
});

export function useSearches() {
  const value = useContext(SearchesContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSearches must be wrapped in a <SearchesProvider />");
    }
  }

  return value;
}

export function SearchesProvider(props: React.PropsWithChildren) {
  const [searches, setSearchesState] = useState<RecentSearches>({
    experiences: [],
    organizations: [],
  });

  const loadSearches = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(SEARCHES_KEY);
      if (value) {
        setSearchesState(JSON.parse(value));
      }
    } catch (error) {
      console.error("Error getting searches", error);
    }
  }, [setSearchesState]);

  const storeSearches = useCallback(async (searches: RecentSearches) => {
    try {
      await AsyncStorage.setItem(SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error("Error storing searches", error);
    }
  }, []);

  const setSearches = useCallback(
    (searches: RecentSearches) => {
      setSearchesState(searches);
      storeSearches(searches);
    },
    [storeSearches],
  );

  const deleteAll = useCallback(() => {
    setSearches({
      experiences: [],
      organizations: [],
    });
    storeSearches({
      experiences: [],
      organizations: [],
    });
  }, [setSearches, storeSearches]);

  const saveExperienceSearch = (search: string) => {
    const experienceSearches = searches.experiences.filter((s) => s !== search);

    setSearches({
      ...searches,
      experiences: [search, ...experienceSearches],
    });
  };

  useEffect(() => {
    loadSearches();
  }, [loadSearches]);

  return (
    <SearchesContext.Provider value={{ searches, setSearches, saveExperienceSearch, deleteAll }}>
      {props.children}
    </SearchesContext.Provider>
  );
}
