import { FC } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native-gesture-handler";
import Box from "../ui/Box";
import Text from "../ui/Text";

interface FilterFooterProps {
  onReset?: () => void;
  onConfirm?: () => void;
}

const FilterFooter: FC<FilterFooterProps> = ({ onReset, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Box
      height={48}
      flexDirection="row"
      width="100%"
      marginVertical="m"
      justifyContent="space-between"
      paddingHorizontal="m"
      position="relative"
      alignItems="center"
    >
      <Box minWidth={20}>
        {onReset && (
          <TouchableOpacity onPress={onReset}>
            <Text variant="body" color="accentText">{t("resetFilter", "Reset filter")}</Text>
          </TouchableOpacity>
        )}
      </Box>

      <Box minWidth={20}>
        {onConfirm && (
          <TouchableOpacity onPress={onConfirm}>
            <Text variant="body" color="accentText">{t("confirm", "Conferma")}</Text>
          </TouchableOpacity>
        )}
      </Box>

    </Box>
  )
}

export default FilterFooter;

