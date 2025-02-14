import { Theme } from "@/config/theme";
import { useTheme } from "@shopify/restyle";
import React, { FC } from "react";
import { LayoutAnimation, Pressable } from "react-native";
import Box from "./Box";
import Icon from "./Icon";
import Text from "./Text";

interface CheckboxProps {
  children?: React.ReactNode;
  value: boolean;
  onChange?: (checked: boolean) => void;
  accent?: boolean;
  error?: string;
}

const Checkbox: FC<CheckboxProps> = ({ children, error, value, onChange, accent }) => {
  const theme = useTheme<Theme>();

  const bgColor = accent ? "primaryBackground" : "invertedBackground";

  function handlePress() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange && onChange(!value);
  }

  return (
    <Box flexDirection="row" alignItems="flex-start" gap="m">
      <Pressable onPress={handlePress}>
        <Box
          width={32}
          height={32}
          borderRadius="s"
          borderWidth={1}
          borderColor="mainBorder"
          backgroundColor={value ? bgColor : "mainBackground"}
          justifyContent="center"
          alignItems="center"
        >
          {value && <Icon name="check" size={24} color={theme.colors.whiteText} />}
        </Box>
      </Pressable>
      <Box flex={1}>
        <Box flex={1} flexDirection="row" alignItems="center" justifyContent="center">
          {children && <Box flex={1}>{children}</Box>}
        </Box>
        {error && (
          <Box flex={1}>
            <Text color="errorText">{error}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Checkbox;
