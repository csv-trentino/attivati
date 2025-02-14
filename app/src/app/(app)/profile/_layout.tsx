import SafeAreaView from "@/components/ui/SafeAreaView";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { Stack } from "expo-router";

export default function ExploreLayout() {
  const theme = useTheme();

  return (
    <SafeAreaView>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              flex: 1,
              backgroundColor: theme.colors.mainBackground,
            },
          }}
        />
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}
