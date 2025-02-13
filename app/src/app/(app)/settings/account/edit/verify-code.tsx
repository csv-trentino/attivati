import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useSession } from "@/contexts/authentication";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Toast from "react-native-toast-message";

export default function SettingsVerifyEditAccountScreen() {
  const [value, setValue] = useState("");
  const { email } = useLocalSearchParams();
  const { verifyAuthCode, requestAuthCode } = useSession();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const CELL_COUNT = 5;
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const { t } = useTranslation();

  async function handleResend() {
    if (!email || Array.isArray(email)) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await requestAuthCode({
        email,
      });

      if (!response) {
        setError(t("errorRequestingVerificationCode", "Error requesting verification code"));
        return;
      }
      setError(null);
      setIsLoading(false);
      Toast.show({
        type: "success",
        props: {
          icon: "mail-outline",
        },
        text1: t("codeSent", "Code sent"),
        text2: t("codeSentDescription", "We sent a new verification code to the email address"),
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setError(t("errorRequestingVerificationCode", "Error requesting verification code"));
    }
  }

  async function onSubmit() {
    if (value.length < CELL_COUNT) {
      setError(t("insertCompleteCode", "Insert the complete code"));
      return;
    }

    if (!email || Array.isArray(email)) {
      return;
    }

    router.push(`/settings/account/edit/confirm?email=${email}&code=${value}`);
  }

  return (
    <SafeAreaView>
      <Topbar goBack title={t("editEmail", "Edit Email")} />
      <Box px="m" mt="l">
        <Text variant="title">{t("checkYourEmail", "Check your email")}</Text>
        <Text variant="body">{t("insert5Code", "Please enter the 5-digit code we sent to")}</Text>
      </Box>

      <Box paddingTop="l" paddingHorizontal="m" gap="l">
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
          renderCell={({ index, symbol, isFocused }) => (
            <Box
              borderWidth={1}
              borderColor="mainBorder"
              borderRadius="m"
              width={60}
              height={60}
              paddingHorizontal="m"
              key={index}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={32} onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </Box>
          )}
        />

        {error && (
          <Text variant="error" textAlign="center">
            {error}
          </Text>
        )}

        <Button
          label={t("sendCode", "Send code")}
          onPress={onSubmit}
          variant="primary"
          isLoading={isLoading}
          isDisabled={!value || value.length < CELL_COUNT}
        />
      </Box>

      <Box marginTop="l" alignItems="center">
        <Text variant="secondary">
          <Trans i18nKey="didntReceiveCode">You didn't receive the code?</Trans>
        </Text>

        <TouchableOpacity onPress={handleResend}>
          <Text variant="title" marginTop="m" textDecorationLine="underline" fontSize={18}>
            <Trans i18nKey="resend">Send again</Trans>
          </Text>
        </TouchableOpacity>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  codeFieldRoot: {
    marginTop: 20,
  },
});
