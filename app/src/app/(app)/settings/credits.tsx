import Box from "@/components/ui/Box";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { Image } from "expo-image";
import { Trans, useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";

export default function CreditsScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView>
      <Topbar empty goBack title={t("Credits", "Credits")} />
      <Box flex={1}>
        <Box alignItems="center" px="m">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{
              width: 242,
              height: 50,
              marginTop: 30,
              marginBottom: 28,
              objectFit: "contain",
            }}
          />
          <Text variant="title" textAlign="center">
            <Trans i18nKey="welcome">Trentino's voluntary app</Trans>
          </Text>
          <Text variant="body" textAlign="center" mt="l">
            <Trans i18nKey="creditsMessage">
              This app was developed with the support and contribution of the Municipality of Trento
              and Dolomiti Energia, thanks to the collaboration and technical support of ITAS Mutua.
            </Trans>
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
        <Box alignItems="center" px="l" mt="m" gap="s">
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
    </ScrollView>
  );
}
