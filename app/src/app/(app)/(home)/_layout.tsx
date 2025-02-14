import AppIcon from "@/components/ui/AppIcon";
import Box from "@/components/ui/Box";
import Icon from "@/components/ui/Icon";
import Text from "@/components/ui/Text";
import ExperienceFiltersProvider from "@/contexts/experienceFilters";
import { SearchesProvider } from "@/contexts/searches";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

interface TabBarIconProps {
  name: string;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, focused }) => {
  return (
    <Box justifyContent="center" alignItems="center">
      <Text color={focused ? "accentText" : "mainText"}>{name}</Text>
    </Box>
  );
};

export default function AppLayout() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <BottomSheetModalProvider>
      <ExperienceFiltersProvider>
        <SearchesProvider>
          <Tabs
            screenOptions={({ route }) => ({
              tabBarActiveTintColor: theme.colors.accentText,
              headerShown: false,
              tabBarStyle: {
                backgroundColor: theme.colors.mainBackground,
                paddingBottom: 25,
                paddingTop: 13,
                height: 88,
              },
              tabBarButton: (props) => (
                <Pressable
                  {...props}
                  android_ripple={{
                    color: "rgba(0, 0, 0, 0.05)",
                    borderless: true,
                  }}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.5 : 1,
                    },
                    props.style,
                  ]}
                >
                  {props.children}
                </Pressable>
              ),
              tabBarIcon: ({ focused }) => <TabBarIcon name={route.name} focused={focused} />,
            })}
          >
            <Tabs.Screen
              name="explore"
              options={{
                title: t("explore", "Explore"),
                tabBarIcon: ({ color }) => <Icon name="search" color={color} />,
              }}
            />
            <Tabs.Screen
              name="organizations"
              options={{
                title: t("organizations", "Organizations"),
                tabBarIcon: ({ color }) => <Icon name="house" color={color} />,
              }}
            />
            <Tabs.Screen
              name="experiences"
              options={{
                title: t("activities", "Activities"),
                tabBarIcon: ({ color }) => <AppIcon color={color} />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: t("profile", "Profile"),
                tabBarIcon: ({ color }) => <Icon name="user" color={color} />,
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: t("settings", "Settings"),
                tabBarIcon: ({ color }) => <Icon name="gear" color={color} />,
              }}
            />
            <Tabs.Screen
              name="search"
              options={{
                href: null,
              }}
            />
          </Tabs>
        </SearchesProvider>
      </ExperienceFiltersProvider>
    </BottomSheetModalProvider>
  );
}
