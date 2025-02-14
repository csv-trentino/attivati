import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useSession } from "@/contexts/authentication";
import { useNetwork } from "@/contexts/network";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Platform, StyleSheet } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const CELL_COUNT = 5;

export default function VerifyCodeScreen() {
  const [value, setValue] = useState("");
  const { email } = useLocalSearchParams();
  const { client } = useNetwork();
  const { verifyAuthCode, requestAuthCode } = useSession();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  async function handleResend() {
    if (!email || Array.isArray(email)) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await requestAuthCode({
        email,
        reason: "verify",
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
          icon: "mail",
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

    try {
      setIsLoading(true);
      const response = await verifyAuthCode({ email, code: value });

      if (!response) {
        setError(t("invalidCode", "The code entered is not valid"));
        setValue("");
        setIsLoading(false);
        return;
      }

      const { data } = await client.GET("/auth/user");

      if (data?.accepted_tos) {
        router.dismissAll();
        setIsLoading(false);
        return;
      }

      router.replace({
        pathname: "/registration",
      });
      setIsLoading(false);
    } catch (error) {
      setError(t("invalidCode", "The code entered is not valid"));
      setIsLoading(false);
      setValue("");
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);

  if (!email) {
    router.push("/sign-in");
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
      <Topbar title={t("verifyEmail", "Verify Email")} goBack />
      <Box
        width="100%"
        flex={1}
        flexDirection="column"
        paddingTop="l"
        paddingHorizontal="m"
        gap="l"
      >
        <Text variant="body">
          <Trans i18nKey="verifyCodeDescription" email={email}>
            Insert the 5-digit code we sent to the address {{ email }}
          </Trans>
        </Text>

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
