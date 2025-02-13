import Box from "@/components/ui/Box";
import Switch from "@/components/ui/Switch";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useSession } from "@/contexts/authentication";
import useProfile from "@/hooks/useProfile";
import { ProfileData } from "@/types/data";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native";

interface NotificationItemProps {
  text: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const NotificationItem: FC<NotificationItemProps> = ({ text, value, onChange }) => {
  return (
    <Box borderBottomWidth={1} borderBottomColor="lightBorder" py="m" flexDirection="row" gap="m">
      <Box flex={1}>
        <Text variant="body">{text}</Text>
      </Box>
      <Box>
        <Switch value={value} onChange={onChange} />
      </Box>
    </Box>
  );
};

export default function SettingsNotificationsScreen() {
  const { t } = useTranslation();
  const { session, fetchUser } = useSession();
  const { updateProfile } = useProfile();
  const [nearbyActivities, setNearbyActivities] = useState<boolean>(
    session?.user?.notifications_activity_reminders ?? true,
  );
  const [followedOrganizations, setFollowedOrganizations] = useState<boolean>(
    session?.user?.notifications_followed_organizations ?? true,
  );
  const [activityReminders, setActivityReminders] = useState<boolean>(
    session?.user?.notifications_nearby_activities ?? true,
  );

  useEffect(() => {
    const data: ProfileData = {
      notifications_activity_reminders: nearbyActivities,
      notifications_followed_organizations: followedOrganizations,
      notifications_nearby_activities: activityReminders,
    };

    updateProfile.mutate(data, {
      onSuccess: () => {
        fetchUser();
      },
    });
  }, [nearbyActivities, followedOrganizations, activityReminders]);

  return (
    <SafeAreaView>
      <Topbar goBack empty />
      <Box px="m" mt="m">
        <Text variant="header">{t("notificationsSettings", "Notifications Settings")}</Text>

        <Box borderTopWidth={1} borderTopColor="lightBorder" mt="2xl">
          <NotificationItem
            text="Nuova richiesta di volontariato vicino a te"
            value={nearbyActivities}
            onChange={setNearbyActivities}
          />
          <NotificationItem
            text="Nuova richiesta di volontariato dall’organizzazione che segui"
            value={followedOrganizations}
            onChange={setFollowedOrganizations}
          />
          <NotificationItem
            text="La tua esperienza di volontariato si avvicina"
            value={activityReminders}
            onChange={setActivityReminders}
          />
        </Box>
      </Box>
    </SafeAreaView>
  );
}
