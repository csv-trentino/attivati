import ProfileAvatar from "@/components/profile/ProfileAvatar";
import Box from "@/components/ui/Box";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useSession } from "@/contexts/authentication";
import { useNetwork } from "@/contexts/network";
import { Link, router } from "expo-router";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { session } = useSession();

  if (!session || !session.user) {
    router.push("/");
    return null;
  }

  const user = session.user;

  return (
    <SafeAreaView>
      <ScrollView>
        <Topbar
          empty
          rightComponent={
            <Link href="/profile/edit">
              <Text variant="link">{t("Edit", "Edit")}</Text>
            </Link>
          }
        />
        <Box my="l" gap="l" px="m">
          <Box alignItems="center" gap="l">
            <ProfileAvatar url={user.avatar} />
            <Text variant="header">
              {user.first_name} {user.last_name}
            </Text>
          </Box>

          <ProfileStats />

          <Box>
            <ProfileItem label={t("profile.iLiveIn", "I live in")} value={user.city || "-"} />
            <ProfileItem label={t("profile.myJob", "My Job")} value={user.job || "-"} />
            <ProfileItem
              label={t("profile.myCauses", "My Causes")}
              value={user.categories?.map((c) => c.name).join(", ") || "-"}
            />
            <ProfileItem
              label={t("profile.myLanguages", "My Languages")}
              value={user.languages || "-"}
            />
          </Box>

          <Text variant="title">{t("profile.aboutMe", "About me")}</Text>
          <Text variant="body" lineHeight={23}>
            {user.bio || t("profile.aboutMeTellSomething", "Tell something about you")}
          </Text>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const ProfileStats = () => {
  const { t } = useTranslation();
  const { client } = useNetwork();
  const { session } = useSession();

  const [days, setDays] = useState<number | null>(daysFromDate(session?.user?.created_at || ""));
  const [activityCount, setActivityCount] = useState<number | null>(null);

  useEffect(() => {
    async function getActivityCount() {
      const response = await client.GET("/activities");
      if (response.data) {
        setActivityCount(response.data.page_info.total);
      }
    }
    getActivityCount();
  }, [setActivityCount, client]);

  return (
    <Box
      borderRadius="m"
      borderWidth={1}
      borderColor="lightBorder"
      flexDirection="row"
      width="100%"
    >
      <Box padding="m" flex={1}>
        <Text textAlign="center" variant="header">
          {days || "-"}
        </Text>
        <Text textAlign="center" variant="secondary">
          {t("daysOnApp", "Days on App")}
        </Text>
      </Box>
      <Box width={1} height="100%" borderLeftWidth={1} borderLeftColor="lightBorder" />
      <Box padding="m" flex={1}>
        <Text textAlign="center" variant="header">
          {activityCount || "-"}
        </Text>
        <Text textAlign="center" variant="secondary">
          {t("Experiences", "Experiences")}
        </Text>
      </Box>
    </Box>
  );
};

interface ProfileItemProps {
  label: string;
  value: string;
}

const ProfileItem: FC<ProfileItemProps> = ({ label, value }) => {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      paddingVertical="m"
      borderBottomWidth={1}
      borderBottomColor="lightBorder"
      gap="s"
    >
      <Box flex={1}>
        <Text variant="secondary">{label}</Text>
      </Box>
      <Box flex={1}>
        <Text textAlign="right" variant="body">
          {value}
        </Text>
      </Box>
    </Box>
  );
};

function daysFromDate(date: string) {
  const diff = new Date().getTime() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
