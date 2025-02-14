import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import InputText from "@/components/ui/InputText";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useSession } from "@/contexts/authentication";
import { SignInData } from "@/types/data";
import { validateEmail } from "@/utils/validators";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { When } from "react-if";
import { Pressable, SafeAreaView } from "react-native";

export default function SettingsAccountScreen() {
  const { t } = useTranslation();
  const { signOut, session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, watch } = useForm<SignInData>();
  const email = watch("email");

  async function onSubmit(data: SignInData) {
    if (data.email === "") {
      setError(t("emailRequired", "Email is required"));
      return;
    }

    router.push(`/settings/account/edit/verify-code?email=${data.email}`);
  }

  async function handleLogout() {
    signOut();
    router.replace("/");
  }

  return (
    <SafeAreaView>
      <Topbar goBack empty />
      <Box px="m" mt="m">
        <Text variant="header">{t("accountSettings", "Account Settings")}</Text>

        <Box
          py="m"
          my="2xl"
          borderBottomWidth={1}
          borderTopWidth={1}
          borderColor="lightBorder"
          flexDirection="row"
          alignItems="center"
        >
          <When condition={!showForm}>
            <Box flex={1}>
              <Text variant="body">{t("email", "Email")}</Text>
              <Text variant="secondary">{session?.user?.email}</Text>
            </Box>
            <Pressable onPress={() => setShowForm(true)}>
              <Text variant="link">{t("Edit", "Edit")}</Text>
            </Pressable>
          </When>
          <When condition={showForm}>
            <Box gap="m" flex={1}>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <InputText
                    label={t("email", "Email")}
                    value={value}
                    autoFocus
                    keyboardType="email-address"
                    onChangeText={onChange}
                    placeholder={t("emailPlaceholder", "Insert your email")}
                  />
                )}
                name="email"
                defaultValue=""
              />
              <Button
                label={t("continue", "Continue")}
                onPress={handleSubmit(onSubmit)}
                isLoading={false}
                isDisabled={!validateEmail(email)}
                variant="primary"
              />
            </Box>
          </When>
        </Box>

        <Box mt="l" gap="l">
          <Pressable onPress={handleLogout}>
            <Text variant="link">{t("logout", "Logout")}</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/settings/account/delete")}>
            <Text variant="link" color="errorText">
              {t("deleteAccount", "Delete account")}
            </Text>
          </Pressable>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
