import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import FavoriteButton from "@/components/ui/FavoriteButton";
import Icon from "@/components/ui/Icon";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { Experience } from "@/types/data";
import { tActivityStatus } from "@/utils/enumTransl";
import { processColorByStatus } from "@/utils/formatters";
import { format } from "date-fns";
import { Image } from "expo-image";
import { router } from "expo-router";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AppIcon from "./ui/AppIcon";

interface ExeperienceDetailsProps {
  experience: Experience;
  isFavorite?: boolean;
  activityStatus?: string;
}
const imagePlaceholder = require("@/assets/images/experience-placeholder.png");

const ExperienceDetails: FC<ExeperienceDetailsProps> = ({
  experience,
  isFavorite,
  activityStatus,
}) => {
  const { t } = useTranslation();

  const hasContacts = useMemo(() => {
    return (
      experience.organization.email ||
      experience.organization.phone ||
      experience.organization.website
    );
  }, [
    experience.organization.email,
    experience.organization.phone,
    experience.organization.website,
  ]);

  const image = useMemo(() => {
    return experience.image ? { uri: experience.image } : imagePlaceholder;
  }, [experience.image]);

  return (
    <ScrollView>
      <Topbar
        goBack
        rightComponent={
          <Pressable>
            <Icon name="share" />
          </Pressable>
        }
      />
      {activityStatus && (
        <Box backgroundColor={processColorByStatus(activityStatus)} py="m">
          <Text textAlign="center" color="whiteText">
            {tActivityStatus(activityStatus)}
          </Text>
        </Box>
      )}
      <Image
        source={image}
        style={{
          width: "100%",
          height: 390,
        }}
      />
      <Box marginHorizontal="m" marginVertical="l" gap="l">
        {/* Organization and title */}
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/organizations/[id]",
              params: {
                id: experience.organization.id,
              },
            })
          }
        >
          <Box
            flexDirection="row"
            alignItems="center"
            gap="l"
            pb="m"
            borderBottomWidth={1}
            borderBottomColor="mainBorder"
          >
            {experience.organization.logo ? (
              <Image
                source={experience.organization.logo}
                contentFit="cover"
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 1000,
                }}
              />
            ) : (
              <Box
                width={54}
                height={54}
                backgroundColor="mainBorder"
                borderRadius="full"
                justifyContent="center"
                alignItems="center"
              >
                <AppIcon color="#fff" />
              </Box>
            )}
            <Box flex={1}>
              <Text variant="body">{experience.organization.name}</Text>
            </Box>
            <FavoriteButton
              id={experience.organization.id}
              isFavorite={isFavorite || false}
              refetch={console.log}
            />
          </Box>
        </Pressable>
        <Text fontSize={32} fontFamily="DMSansMedium" lineHeight={38}>
          {experience.title}
        </Text>

        <Text variant="body" color="accentText">
          {experience.category.name}
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
            <Box flex={1}>
              <Text variant="body">{experience.address}</Text>
              <Text variant="body">{experience.city}</Text>
            </Box>
          </Box>
          <Box flexDirection="row" padding="m" gap="m">
            <Icon name="calendar" size={32} color="black" strokeWith="1.5" />

            <Box>
              <Text variant="body">
                {experience.start_date && (
                  <>
                    {t("from", "From")} {format(new Date(experience.start_date), "d MMMM yyyy")}
                  </>
                )}
              </Text>
              <Text variant="body">
                {experience.end_date && (
                  <>
                    {t("to", "To")} {format(new Date(experience.end_date), "d MMMM yyyy")}
                  </>
                )}
              </Text>
            </Box>
          </Box>
        </Box>

        <Text variant="title">{t("opportunity", "Opportunity")}</Text>

        <Text variant="body" color="secondaryText">
          {experience.description}
        </Text>

        <Divider />

        <Text variant="title">{t("requirements", "Requirements")}</Text>

        <Box marginLeft="s">
          <Text variant="body" color="secondaryText">
            • Avere almeno 14 anni
          </Text>
        </Box>

        {hasContacts && (
          <>
            <Divider />
            <Text variant="title">{t("contacts", "Contacts")}</Text>

            <ScrollView horizontal>
              <Box flexDirection="row" gap="m">
                {experience.organization.email && (
                  <Button
                    variant="secondary"
                    leftIcon="mail"
                    size="s"
                    label={t("email", "Email")}
                    onPress={() => Linking.openURL(`mailto:${experience.organization.email}`)}
                  />
                )}
                {experience.organization.phone && (
                  <Button
                    variant="secondary"
                    leftIcon="phone"
                    size="s"
                    label={t("call", "Call")}
                    onPress={() => Linking.openURL(`tel:${experience.organization.phone}`)}
                  />
                )}
                {experience.organization.website && (
                  <Button
                    variant="secondary"
                    leftIcon="globe"
                    size="s"
                    label={t("website", "Website")}
                    onPress={() => Linking.openURL(`${experience.organization.website}`)}
                  />
                )}
              </Box>
            </ScrollView>
          </>
        )}
        <Box marginBottom="3xl" />
      </Box>
    </ScrollView>
  );
};

export default ExperienceDetails;