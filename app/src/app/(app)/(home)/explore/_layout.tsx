import SafeAreaView from "@/components/ui/SafeAreaView";
import { Theme } from "@/config/theme";
import { SearchesProvider } from "@/contexts/searches";
import { useTheme } from "@shopify/restyle";
import { Stack } from "expo-router";

export default function ExporeLayout() {
  const theme = useTheme<Theme>();

  return (
    <SafeAreaView>
      <SearchesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              flex: 1,
              backgroundColor: theme.colors.mainBackground,
            },
          }}
        />
      </SearchesProvider>
    </SafeAreaView>
  );
}
