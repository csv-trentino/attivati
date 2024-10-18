import { Theme } from "@/config/theme";
import { useTheme } from "@shopify/restyle";
import { FC } from "react";
import { Pressable } from "react-native";
import Box from "../ui/Box";
import Checkbox from "../ui/Checkbox";
import Icon from "../ui/Icon";
import Text from "../ui/Text";

interface ChoiceListItemProps {
  label: string;
  selected?: boolean;
  section?: boolean;
  onPress?: () => void;
}

const ChoiceListItem: FC<ChoiceListItemProps> = ({ label, section, selected, onPress }) => {
  const theme = useTheme<Theme>();

  return (
    <Pressable onPress={onPress}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        borderBottomColor="lightBorder"
        alignItems="center"
        py="s"
        width="100%"
        borderBottomWidth={1}
      >
        <Box flex={10}>
          <Text variant="body" color={selected ? "accentText" : "mainText"}>
            {label}
          </Text>
        </Box>

        {section ? (
          <Icon name="chevron-right" size={24} color={theme.colors.mainText} strokeWith="1.5" />
        ) : (
          <Box flex={1}>
            <Checkbox value={!!selected} accent onChange={onPress} />
          </Box>
        )}
      </Box>
    </Pressable>
  );
};

interface ChoiceListProps {
  children: React.ReactNode | React.ReactNode[];
}

const ChoiceList: FC<ChoiceListProps> & {
  Item: typeof ChoiceListItem;
} = ({ children }) => {
  return (
    <Box marginHorizontal="m" marginVertical="xs">
      {children}
    </Box>
  );
};

ChoiceList.Item = ChoiceListItem;

export default ChoiceList;
