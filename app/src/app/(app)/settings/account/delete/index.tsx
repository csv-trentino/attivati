import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native";

export default function SettingsDeleteAccountScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView>
      <Topbar goBack title={t("deleteAccount", "Delete account")} />
      <Box px="m" mt="xl" gap="xl">
        <Text variant="header" textAlign="center">
          {t("deleteAccountConfirm", "Do you confirm that you want to delete your account?")}
        </Text>

        <Text variant="body" textAlign="center">
          {t(
            "deleteAccountWarning",
            "By deleting your account, all your volunteer experiences will be removed. This action is irreversible. Do you really want to proceed?",
          )}
        </Text>

        <Button
          onPress={() => router.push("/settings/account/delete/confirm")}
          label={t("deleteAccount", "Delete account")}
          variant="danger"
        />
      </Box>
    </SafeAreaView>
  );
}
