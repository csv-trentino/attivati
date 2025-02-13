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
import { it } from "date-fns/locale";
import { Image } from "expo-image";
import { router } from "expo-router";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RenderHtml from "react-native-render-html";
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
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const contacts = useMemo(() => {
    return {
      email: experience.contact_email || experience.organization.email,
      phone: experience.contact_phone || experience.organization.phone,
      website: experience.organization.website,
    };
  }, [
    experience.contact_email,
    experience.contact_phone,
    experience.organization.email,
    experience.organization.phone,
    experience.organization.website,
  ]);

  const hasContacts = useMemo(() => {
    return (
      (contacts.email && contacts.email !== "") ||
      (contacts.phone && contacts.phone !== "") ||
      (contacts.website && contacts.website !== "")
    );
  }, [contacts]);

  const image = useMemo(() => {
    return experience.image ? { uri: experience.image } : imagePlaceholder;
  }, [experience.image]);

  const organizationWebsite = useMemo(() => {
    if (!experience.organization.website) {
      return "";
    }

    if (experience.organization.website.startsWith("http")) {
      return experience.organization.website;
    }

    return `https://${experience.organization.website}`;
  }, [experience.organization.website]);

  return (
    <ScrollView>
      <Topbar goBack />
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
                    {t("from", "From")}{" "}
                    {format(new Date(experience.start_date), "d MMMM yyyy", { locale: it })}
                  </>
                )}
              </Text>
              <Text variant="body">
                {experience.end_date && (
                  <>
                    {t("to", "To")}{" "}
                    {format(new Date(experience.end_date), "d MMMM yyyy", {
                      locale: it,
                    })}
                  </>
                )}
              </Text>
            </Box>
          </Box>
        </Box>

        <Text variant="title">{t("opportunity", "Opportunity")}</Text>

        <RenderHtml contentWidth={width} source={{ html: experience.description }} />

        <Divider />

        <Text variant="title">{t("requirements", "Requirements")}</Text>

        <Box marginLeft="s">
          <Text variant="body" color="secondaryText">
            {experience.skills ? experience.skills : "• Avere almeno 14 anni"}
          </Text>
        </Box>

        {hasContacts && (
          <>
            <Divider />
            <Text variant="title">{t("contacts", "Contacts")}</Text>

            <ScrollView horizontal>
              <Box flexDirection="row" gap="m">
                {contacts.email && (
                  <Button
                    variant="secondary"
                    leftIcon="mail"
                    size="s"
                    label={t("email", "Email")}
                    onPress={() => Linking.openURL(`mailto:${contacts.email}`)}
                  />
                )}
                {contacts.phone && (
                  <Button
                    variant="secondary"
                    leftIcon="phone"
                    size="s"
                    label={t("call", "Call")}
                    onPress={() => Linking.openURL(`tel:${contacts.phone}`)}
                  />
                )}
                {contacts.website && (
                  <Button
                    variant="secondary"
                    leftIcon="globe"
                    size="s"
                    label={t("website", "Website")}
                    onPress={() => Linking.openURL(organizationWebsite)}
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
