import { useTheme } from "@shopify/restyle";
import { Stack } from "expo-router";

export default function ExploreLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          flex: 1,
          backgroundColor: theme.colors.mainBackground,
        },
      }}
    />
  );
}
