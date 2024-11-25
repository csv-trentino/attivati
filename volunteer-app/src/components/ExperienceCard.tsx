import Box from "@/components/ui/Box";
import Text from "@/components/ui/Text";
import { Experience } from "@/types/data";
import { format } from "date-fns";
import { FC, useMemo } from "react";
import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import Icon from "./ui/Icon";

export interface ExperienceCardProps {
  experience: Experience;
  onPress?: () => void;
  onClose?: () => void;
}

const imagePlaceholder = require("@/assets/images/experience-placeholder.png");

export const ExperienceCard: FC<ExperienceCardProps> = ({ experience, onPress, onClose }) => {
  const image = useMemo(() => {
    return experience.image && experience.image !== ""
      ? { uri: experience.image }
      : imagePlaceholder;
  }, [experience.image]);

  return (
    <Pressable onPress={onPress}>
      <Box
        shadowColor="shadow"
        shadowOffset={{ width: -2, height: 4 }}
        shadowOpacity={0.2}
        shadowRadius={3}
        elevation={6}
        m={"l"}
        maxHeight={190}
        position="relative"
        borderRadius="m"
        flexDirection="row"
        backgroundColor="mainBackground"
        marginHorizontal="m"
        marginVertical="s"
      >
        {onClose && (
          <Pressable
            onPress={onClose}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <Box
              width={32}
              height={32}
              zIndex={1000}
              justifyContent="center"
              alignItems="center"
              borderRadius="full"
              backgroundColor="mainBackground"
              borderWidth={1}
              borderColor="mainBorder"
            >
              <Icon name="close" color="#000" />
            </Box>
          </Pressable>
        )}
        <Box flex={1} padding="m">
          <Text variant="secondary" numberOfLines={2}>
            {experience.organization.name}
          </Text>
          <Box flex={1} marginVertical="s">
            <Text variant="body" fontSize={16} fontFamily={"DMSansMedium"} numberOfLines={3}>
              {experience.title}
            </Text>
          </Box>
          <Text variant="body" fontSize={13}>
            {experience.city}
          </Text>
          <Text variant="secondary">
            {experience.start_date ? format(new Date(experience.start_date), "d/MM/yyyy") : ""}

            {experience.end_date ? ` - ${format(new Date(experience.end_date), "d/MM/yyyy")}` : ""}
          </Text>
        </Box>
        <Box flex={1}>
          <Animated.Image
            source={image}
            style={{
              width: "100%",
              minHeight: 179,
              height: "100%",
              borderBottomRightRadius: 8,
              borderTopRightRadius: 8,
            }}
          />
        </Box>
      </Box>
    </Pressable>
  );
};
