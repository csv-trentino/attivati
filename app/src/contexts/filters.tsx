import { createContext, useContext, useState } from "react";

export const FiltersContext = createContext<{
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
}>({
  filters: {},
  setFilters: () => null,
});

export function useFilters<T extends Record<string, any>>(initialFilters?: T) {
  const value = useContext(FiltersContext);

  // useMemo(() => value.setFilters(initialFilters || {}), [initialFilters]);

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useFilters must be wrapped in a <FiltersProvider />");
    }
  }

  return {
    filters: value.filters as T,
    setFilters: value.setFilters as (filters: T) => void,
  };
}

export function FiltersProvider(props: React.PropsWithChildren) {
  const [filters, setFilters] = useState<Record<string, any>>({});

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {props.children}
    </FiltersContext.Provider>
  );
}

export const withFilters = <T extends Record<string, any>>(Component: React.ComponentType<T>) => {
  return (props: T) => {
    return (
      <FiltersProvider>
        <Component {...props} />
      </FiltersProvider>
    );
  };
};
