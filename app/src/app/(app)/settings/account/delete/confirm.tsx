import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useSession } from "@/contexts/authentication";
import { useNetwork } from "@/contexts/network";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Toast from "react-native-toast-message";

const CELL_COUNT = 5;

export default function SettingsConfirmDeleteAccountScreen() {
  const [codeSent, setCodeSent] = useState(false);
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { client } = useNetwork();
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const { requestAuthCode, deleteProfile, session } = useSession();

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleResend = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await requestAuthCode({
        email: session!.user!.email,
        reason: "delete",
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
  }, [requestAuthCode, session, t]);

  async function onSubmit() {
    if (value.length < CELL_COUNT) {
      setError(t("insertCompleteCode", "Insert the complete code"));
      return;
    }

    try {
      setIsLoading(true);
      const response = await deleteProfile(value);

      if (!response) {
        setError(t("invalidCode", "The code entered is not valid"));
        setValue("");
        setIsLoading(false);
        return;
      }

      router.replace({
        pathname: "/",
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

    if (!codeSent) {
      handleResend();
      setCodeSent(true);
    }
  }, [ref, handleResend, codeSent]);

  return (
    <SafeAreaView>
      <Topbar goBack title={t("deleteAccount", "Delete account")} />
      <Box px="m" mt="xl" gap="xl">
        <Text variant="header" textAlign="center">
          {t("insertConfirmationCode", "Insert confirmation code")}
        </Text>

        <Text variant="body" textAlign="center">
          {t(
            "deleteAccountInsertCodeReceived",
            "Insert the code you received in your email to confirm the deletion of your account.",
          )}
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
