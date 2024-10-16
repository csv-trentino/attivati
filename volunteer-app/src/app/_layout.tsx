import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { toastConfig } from "@/components/ui/Toast";
import theme from "@/config/theme";
import { SessionProvider } from "@/contexts/authentication";
import { ThemeProvider } from "@shopify/restyle";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { NetworkProvider } from "@/contexts/network";
import LocalesInit from "@/locales";
import { getLocales } from "expo-localization";

import i18next from "i18next";
import { Platform, UIManager } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

LocalesInit();

export default function RootLayout() {
  const [loaded] = useFonts({
    DMSansRegular: require("../assets/fonts/DMSans-Regular.ttf"),
    DMSansMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMSansBold: require("../assets/fonts/DMSans-Bold.ttf"),
  });

  const locale = getLocales()[0];

  i18next.changeLanguage(locale.languageCode || "en");

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1500);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <NetworkProvider>
          <SessionProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  flex: 1,
                  backgroundColor: theme.colors.mainBackground,
                },
              }}
            />
            <Toast config={toastConfig(theme)} position="bottom" />
            <StatusBar style="dark" />
          </SessionProvider>
        </NetworkProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
