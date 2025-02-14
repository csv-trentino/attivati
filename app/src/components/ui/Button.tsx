import {
  BackgroundColorProps,
  BorderProps,
  ColorProps,
  SpacingProps,
  VariantProps,
  backgroundColor,
  border,
  color,
  composeRestyleFunctions,
  createVariant,
  spacing,
  useRestyle,
  useTheme,
} from "@shopify/restyle";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import { Theme } from "@/config/theme";
import { useMemo } from "react";
import Box from "./Box";
import Icon, { IconName } from "./Icon";
import Text from "./Text";

type ButtonSize = "s" | "m" | "l";

const SIZES = {
  s: {
    iconSize: 16,
    fontSize: 14,
    paddingHorizontal: "s",
    gap: "s",
  },
  m: {
    iconSize: 28,
    fontSize: 16,
    paddingHorizontal: "m",
    gap: "m",
  },
  l: {
    iconSize: 32,
    fontSize: 18,
    paddingHorizontal: "l",
    gap: "l",
  },
};

const variant = createVariant<Theme, "buttonVariants">({
  themeKey: "buttonVariants",
  defaults: {
    paddingHorizontal: "m",
    paddingVertical: "s",
    py: "m",
    borderRadius: "m",
  },
});

type RestyleProps = SpacingProps<Theme> &
  VariantProps<Theme, "buttonVariants"> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  BackgroundColorProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  variant,
  border,
  color,
  backgroundColor,
]);

type Props = RestyleProps & {
  onPress?: () => void;
  label: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  rightIcon?: IconName;
  leftIcon?: IconName;
  renderRightIcon?: () => React.ReactNode;
  size?: ButtonSize;
};

const Button = ({
  onPress,
  label,
  renderRightIcon: renderLeftIcon,
  rightIcon,
  leftIcon,
  isDisabled,
  isLoading,
  size,
  ...rest
}: Props) => {
  rest.variant = isDisabled ? "disabled" : rest.variant;

  const theme = useTheme<Theme>();
  const props = useRestyle(restyleFunctions, rest);
  const currentSize = SIZES[size || "m"];

  const textColor = useMemo(() => {
    switch (rest.variant) {
      case "primary":
      case "danger":
        return "whiteText";
      case "secondary":
        return "accentText";
      case "outline":
        return "mainText";
      case "ghost":
        return "mainText";
      case "disabled":
        return "whiteText";
      default:
        return "whiteText";
    }
  }, [rest.variant]);

  const iconColor = theme.colors[textColor || "mainText"];

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        opacity={isLoading ? 0.5 : 1}
        gap={currentSize.gap as any}
        {...props}
      >
        {renderLeftIcon ? (
          <Box>{renderLeftIcon()}</Box>
        ) : (
          <Box style={{ minWidth: rightIcon ? 28 : 0 }}>
            {leftIcon && <Icon name={leftIcon} color={iconColor} />}
          </Box>
        )}

        {isLoading ? (
          <ActivityIndicator color={iconColor} />
        ) : (
          <Text variant="body" color={textColor} fontSize={currentSize.fontSize}>
            {label}
          </Text>
        )}
        {rightIcon ? (
          <Box>{<Icon name={rightIcon} color={iconColor} />}</Box>
        ) : (
          <Box style={{ minWidth: leftIcon ? 28 : 0 }}></Box>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default Button;
