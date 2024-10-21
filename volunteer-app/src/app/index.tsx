import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useSession } from "@/contexts/authentication";
import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { session, fetchUser } = useSession();
  const { t } = useTranslation();

  useEffect(() => {
    if (session && !session.user) {
      fetchUser();
    }
  }, [session, fetchUser]);

  if (session) {
    return <Redirect href="/explore" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
      <Box flex={1}>
        <Box alignItems="center" mt="xl" px="l">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{
              width: 242,
              height: 50,
              marginTop: 70,
              marginBottom: 28,
              objectFit: "contain",
            }}
          />
          <Text variant="title" textAlign="center">
            <Trans i18nKey="welcome">Trentino's voluntary app</Trans>
          </Text>
        </Box>
        <Box alignItems="center" px="l" mt="xl" gap="s">
          <Text variant="secondary" textAlign="center">
            <Trans i18nKey="aProjectBy">A project by</Trans>
          </Text>
          <Image
            source={require("@/assets/images/logo-trentovolo.png")}
            style={{
              width: 113,
              height: 86,
              marginTop: 0,
              marginBottom: 16,
              objectFit: "contain",
            }}
          />
        </Box>
        <Box alignItems="center" px="l" mt="3xl" gap="s">
          <Text variant="secondary" textAlign="center">
            <Trans i18nKey="inColaborationWith">In collaboration with</Trans>
          </Text>
          <Image
            source={require("@/assets/images/logos/csv-trentino.png")}
            style={{
              width: 113,
              height: 86,
              marginTop: 0,
              marginBottom: 16,
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>

      <Box width="100%" px="l" mb="xl">
        <Button
          variant="primary"
          label={t("continueWithEmail", "Continue with Email")}
          onPress={() => router.push("/sign-in")}
          leftIcon="mail"
        />
      </Box>
    </SafeAreaView>
  );
}
