import Box from "@/components/ui/Box";
import Icon from "@/components/ui/Icon";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Trans, useTranslation } from "react-i18next";
import { Pressable } from "react-native";

export default function ExperienceEnrollConfirmScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView>
      <Box padding="m">
        <Pressable onPress={() => router.dismissAll()}>
          <Icon name="close" size={24} color="black" />
        </Pressable>
      </Box>
      <Box paddingTop="3xl" alignItems="center" marginHorizontal="m" flex={1}>
        <Image
          source={require("@/assets/images/muscles.png")}
          style={{
            width: 80,
            height: 97,
            alignSelf: "center",
            marginBottom: 20,
          }}
        />

        <Box width="70%" marginBottom="l">
          <Text variant="header" lineHeight={38} textAlign="center">
            {t("applicationSent", "Application sent!")}
          </Text>
        </Box>

        <Text variant="secondary" textAlign="center">
          <Trans i18nKey="experienceConfirmationMessage">
            You have successfully submitted your application. Now you just have to wait for the
            organization to contact you to schedule the next steps. Remember that you can always
            check the status of your applications from the Attivati! Experiences tab.
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
