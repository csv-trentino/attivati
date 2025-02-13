import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import InputText from "@/components/ui/InputText";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useSession } from "@/contexts/authentication";
import { SignInData } from "@/types/data";
import { validateEmail } from "@/utils/validators";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { requestAuthCode } = useSession();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch } = useForm<SignInData>({
    defaultValues: {
      email: "",
      reasone: "verify",
    },
  });

  const email = watch("email");

  async function onSubmit(data: SignInData) {
    if (data.email === "") {
      setError(t("emailRequired", "Email is required"));
      return;
    }

    try {
      setIsLoading(true);
      const response = await requestAuthCode({
        email: data.email,
        reason: "verify",
      });

      if (!response) {
        setError(t("errorRequestingVerificationCode", "Error requesting verification code"));
        return;
      }
      router.push(`/verify-code?email=${data.email}`);
      setError(null);
      setIsLoading(false);
    } catch (error) {
      setError(t("errorRequestingVerificationCode", "Error requesting verification code"));
      setIsLoading(false);
    }
  }

  function handleEmailChange(value: string, onChange: (value: string) => void) {
    onChange(value.toLocaleLowerCase());
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
      <Topbar title={t("signInOrRegister", "Sign in or register")} goBack />

      <Box
        width="100%"
        paddingHorizontal="m"
        flex={1}
        paddingTop="xl"
        flexDirection="column"
        gap="l"
      >
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputText
              label={t("email", "Email")}
              value={value}
              autoFocus
              keyboardType="email-address"
              onChangeText={(value) => handleEmailChange(value, onChange)}
              placeholder={t("emailPlaceholder", "Insert your email")}
            />
          )}
          name="email"
          defaultValue=""
        />

        {error && (
          <Text variant="error" textAlign="center">
            {error}
          </Text>
        )}

        <Box>
          <Text variant="secondary">
            <Trans i18nKey="privacyAcceptance">
              By clicking "continue," you declare that you have read the privacy policy.
            </Trans>
          </Text>
        </Box>

        <Button
          label={t("continue", "Continue")}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          isDisabled={!validateEmail(email) || isLoading}
          variant="primary"
        />

        <Box width="100%" justifyContent="center" alignItems="center">
          <Link href="/legal/privacy">
            <Text variant="secondary" textAlign="center" textDecorationLine="underline">
              {t("readPrivacyPolicy", "Read privacy policy")}
            </Text>
          </Link>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
