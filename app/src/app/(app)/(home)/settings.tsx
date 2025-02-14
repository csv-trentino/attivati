import Box from "@/components/ui/Box";
import Icon from "@/components/ui/Icon";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import { router } from "expo-router";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

interface SettingsItemProps {
  title: string;
  onPress: () => void;
}

const SettingsItem: FC<SettingsItemProps> = ({ title, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        py="m"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="mainBorder"
      >
        <Text variant="body">{title}</Text>
        <Icon name="chevron-right" strokeWith="1.3" />
      </Box>
    </Pressable>
  );
};

export default function SettingsListScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView>
      <Box flex={1} px="m" mt="2xl">
        <Text variant="header">{t("settings", "Settings")}</Text>

        <Box my="2xl" borderTopWidth={1} borderTopColor="mainBorder">
          <SettingsItem
            title={t("accounts", "Account")}
            onPress={() => router.push("/settings/account")}
          />
          <SettingsItem
            title={t("notifications", "Notifications")}
            onPress={() => router.push("/settings/notifications")}
          />
        </Box>

        <Box gap="m">
          <Pressable onPress={() => router.push("/settings/credits")}>
            <Text variant="link">{t("credits", "Credits")}</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/legal/tos")}>
            <Text variant="link">{t("termsOfService", "Terms of service")}</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/legal/privacy")}>
            <Text variant="link">{t("privacyPolicy", "Privacy Policy")}</Text>
          </Pressable>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
