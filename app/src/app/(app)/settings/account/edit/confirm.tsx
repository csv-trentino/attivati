import Box from "@/components/ui/Box";
import Icon from "@/components/ui/Icon";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native";

export default function SettingsConfirmEditAccountScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Topbar goBackFn={() => router.replace("/settings")} empty />
      <Box px="m" mt="m" alignItems="center" flex={1}>
        <Icon name="mail" size={64} />
        <Text variant="header" textAlign="center">
          {t("accountSettingsEdited", "You have successfully updated your email address.")}
        </Text>
      </Box>
      <Box alignItems="center" mb="2xl">
        <Link href="/settings" replace>
          <Text variant="link" color="accentText" textAlign="center">
            {t("backToSettings", "Back to settings")}
          </Text>
        </Link>
      </Box>
    </SafeAreaView>
  );
}
