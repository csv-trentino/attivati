import Box from "@/components/ui/Box";
import Icon from "@/components/ui/Icon";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import { router } from "expo-router";
import { Trans, useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function ActivityUpdateConfirmScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView>
      <Box padding="m">
        <Pressable onPress={() => router.dismissAll()}>
          <Icon name="close" size={24} color="black" />
        </Pressable>
      </Box>
      <Box paddingTop="xl" alignItems="center" marginHorizontal="m" flex={1}>
        <Box justifyContent="center" mb="l">
          <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <Path
              d="M25 80V100M30 20V40M35 90H15M40 30H20M65 20L73.7642 42.2218C74.7037 44.6041 75.1735 45.7953 75.8929 46.7997C76.5305 47.69 77.31 48.4695 78.2003 49.1071C79.2047 49.8265 80.3959 50.2963 82.7781 51.2358L105 60L82.7781 68.7642C80.3959 69.7037 79.2047 70.1735 78.2003 70.8928C77.31 71.5305 76.5305 72.31 75.8929 73.2003C75.1735 74.2047 74.7037 75.3958 73.7642 77.7781L65 100L56.2358 77.7781C55.2963 75.3958 54.8265 74.2047 54.1071 73.2003C53.4695 72.31 52.69 71.5305 51.7997 70.8928C50.7953 70.1735 49.6041 69.7037 47.2219 68.7642L25 60L47.2219 51.2358C49.6041 50.2963 50.7953 49.8265 51.7997 49.1071C52.69 48.4695 53.4695 47.69 54.1071 46.7997C54.8265 45.7953 55.2963 44.6041 56.2358 42.2218L65 20Z"
              stroke="#D04BFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Box>

        <Box width="70%" marginBottom="l">
          <Text variant="header" lineHeight={38} textAlign="center">
            {t("withdrawnSent", "You have withdrawn from the activity.")}
          </Text>
        </Box>

        <Text variant="secondary" textAlign="center">
          <Trans i18nKey="giveupRequestMessage">
            The organization has received your notice of withdrawal from the activity.
          </Trans>
        </Text>
      </Box>
      <Box marginBottom="3xl">
        <Pressable
          onPress={() => {
            router.replace("/experiences");
          }}
        >
          <Text variant="body" textDecorationLine="underline" color="accentText" textAlign="center">
            {t("myExperiences", "My experiences")}
          </Text>
        </Pressable>
      </Box>
    </SafeAreaView>
  );
}
