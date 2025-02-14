import Box from "@/components/ui/Box";
import Text from "@/components/ui/Text";
import { Activity } from "@/types/data";
import { format } from "date-fns";
import { FC } from "react";
import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import Icon from "./ui/Icon";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { processColorByStatus } from "@/utils/formatters";
import { tActivityStatus } from "@/utils/enumTransl";

export interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
  onClose?: () => void;
}

export const DoneActivityCard: FC<ActivityCardProps> = ({ activity, onPress, onClose }) => {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress}>
      <Box
        borderRadius="m"
        overflow="hidden"
        flexDirection="row"
        backgroundColor="mainBackground"
        marginHorizontal="m"
        marginVertical="s"
        marginTop="xl"
      >
        <Box flex={1}>
          <Animated.Image
            source={{ uri: activity.experience.image }}
            style={{ width: "100%", height: 179 }}
          />
        </Box>
        <Box flex={1} padding="m">
          <Text variant="secondary">{activity.experience.organization.name}</Text>
          <Box flex={1} marginVertical="s">
            <Text variant="title" fontSize={16}>
              {activity.experience.title}
            </Text>
          </Box>
          <Text variant="body">{activity.experience.city}</Text>
          <Text variant="secondary">
            {activity.start_date ? format(new Date(activity.start_date), "d/MM") : ""}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
};
