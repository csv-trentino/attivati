import { FC } from "react";
import { Pressable } from "react-native";
import Box from "../ui/Box";
import Icon from "../ui/Icon";
import Text from "../ui/Text";

interface FilterHeaderProps {
  title: string;
  onClose?: () => void;
  onBack?: () => void;
}

const FilterHeader: FC<FilterHeaderProps> = ({ title, onClose, onBack }) => {
  return (
    <Box
      height={56}
      borderBottomWidth={1}
      flexDirection="row"
      borderBottomColor="lightBorder"
      width="100%"
      justifyContent="space-between"
      paddingHorizontal="m"
      position="relative"
      alignItems="center"
    >
      <Box minWidth={20}>
        {onClose && !onBack && (
          <Pressable onPress={onClose}>
            <Icon name="close" />
          </Pressable>
        )}

        {onBack && (
          <Pressable onPress={onBack}>
            <Icon name="chevron-left" />
          </Pressable>
        )}
      </Box>

      <Box>{title && <Text fontWeight="700">{title}</Text>}</Box>
      <Box minWidth={20}></Box>
    </Box>
  );
};

export default FilterHeader;
