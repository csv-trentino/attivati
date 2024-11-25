import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import Icon from "@/components/ui/Icon";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useNetwork } from "@/contexts/network";
import { tActivityStatus } from "@/utils/enumTransl";
import { processColorByStatus } from "@/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, isToday } from "date-fns";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RenderHtml from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityScreen() {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { client } = useNetwork();
  if (!id || Array.isArray(id)) {
    throw new Error("id should be a string");
  }

  const activityId = parseInt(id);

  const { data } = useQuery({
    queryKey: ["activity", id],
    queryFn: async () => {
      const response = await client.GET("/activities/{id}", {
        params: {
          path: {
            id: activityId,
          },
        },
      });
      return response.data;
    },
  });

  if (!data) {
    return null;
  }

  const isDone = !isToday(new Date(data.end_date)) && isAfter(new Date(), new Date(data.end_date));

  return (
    <SafeAreaView>
      <ScrollView>
        <Topbar
          goBack
          rightComponent={
            <Pressable
              onPress={() => {
                router.back();
              }}
            >
              <Icon name="share" />
            </Pressable>
          }
        />
        {!isDone && (
          <Box
            p="m"
            justifyContent="center"
            alignItems="center"
            backgroundColor={processColorByStatus(data.status)}
            width="100%"
          >
            <Text color="whiteText">{tActivityStatus(data.status)}</Text>
          </Box>
        )}

        {isDone && (
          <Box
            p="m"
            justifyContent="center"
            alignItems="center"
            backgroundColor="statusAccepted"
            width="100%"
          >
            <Text color="whiteText">
              {t("doneAt", "Completed in date") + " " + format(new Date(), "d/MM")}
            </Text>
          </Box>
        )}
        <Image
          source={data.experience.image}
          style={{
            width: "100%",
            height: 390,
          }}
        />
        <Box marginHorizontal="m" marginVertical="l" gap="l">
          {/* Organization and title */}
          <Text variant="body" color="accentText">
            {data.experience.organization.name}
          </Text>
          <Text fontSize={32} fontFamily="DMSansMedium" lineHeight={38}>
            {data.experience.title}
          </Text>

          {/* Location and dates */}
          <Box borderRadius="m" borderWidth={1} borderColor="mainBorder">
            <Box
              flexDirection="row"
              padding="m"
              gap="m"
              borderBottomWidth={1}
              borderBottomColor="mainBorder"
            >
              <Icon name="marker" size={32} color="black" strokeWith="1.5" />
              <Box>
                <Text variant="body">{data.experience.address}</Text>
                <Text variant="body">{data.experience.city}</Text>
              </Box>
            </Box>
            <Box flexDirection="row" padding="m" gap="m">
              <Icon name="calendar" size={32} color="black" strokeWith="1.5" />

              <Box>
                <Text variant="body">
                  {data.experience.start_date && (
                    <>
                      {t("from", "From")}{" "}
                      {format(new Date(data.experience.start_date), "d MMMM yyyy")}
                    </>
                  )}
                </Text>
                <Text variant="body">
                  {data.experience.end_date && (
                    <>
                      {t("to", "To")} {format(new Date(data.experience.end_date), "d MMMM yyyy")}
                    </>
                  )}
                </Text>
              </Box>
            </Box>
          </Box>

          <Text variant="title">{t("opportunity", "Opportunity")}</Text>

          <RenderHtml contentWidth={width} source={{ html: data.experience.description }} />

          <Divider />

          <Text variant="title">{t("requirements", "Requirements")}</Text>

          <Box marginLeft="s">
            <Text variant="body" color="secondaryText">
              • Avere almeno 14 anni
            </Text>
          </Box>

          <Divider />

          <Text variant="title">{t("contacts", "Contacts")}</Text>

          <ScrollView horizontal>
            <Box flexDirection="row" gap="m" marginBottom="3xl">
              <Button
                variant="secondary"
                leftIcon="mail"
                size="s"
                label={t("email", "Email")}
                onPress={() => Linking.openURL(`mailto:${data.experience.organization.email}`)}
              />
              <Button
                variant="secondary"
                leftIcon="phone"
                size="s"
                label={t("call", "Call")}
                onPress={() => Linking.openURL(`tel:${data.experience.organization.phone}`)}
              />
              <Button
                variant="secondary"
                leftIcon="globe"
                size="s"
                label={t("website", "Website")}
                onPress={() => Linking.openURL(`${data.experience.organization.website}`)}
              />
            </Box>
          </ScrollView>
        </Box>
      </ScrollView>

      {!isDone && (
        <Box
          position="absolute"
          flexDirection="row"
          bottom={0}
          left={0}
          right={0}
          p="s"
          justifyContent="space-between"
          alignItems="center"
          backgroundColor="whiteText"
          width="100%"
        >
          <Box>
            <Text>{t("waitYouAt", "We wait you:")}</Text>
            {format(data.start_date, "d/MM") === format(data.end_date, "d/MM") ? (
              <Text>
                {t("the", "The")} {format(data.start_date, "d/MM")}
              </Text>
            ) : (
              <Text>
                {t("from", "From")} {format(data.start_date, "d/MM")} {t("to", "To")}{" "}
                {format(data.end_date, "d/MM")}
              </Text>
            )}
          </Box>
          <Button
            variant="primary"
            label={t("Edit", "Edit")}
            paddingHorizontal="xl"
            borderRadius="m"
            onPress={() => {
              router.push(`/experiences/activities/${id}/edit`);
            }}
          />
        </Box>
      )}
    </SafeAreaView>
  );
}
