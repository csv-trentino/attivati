import { Theme } from "@/config/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@shopify/restyle";
import { format } from "date-fns";
import { FC, useState } from "react";
import { Pressable, TextInputProps } from "react-native";
import Box from "./Box";
import Text from "./Text";

const SIZES = {
  s: 48,
  m: 56,
  l: 64,
};

interface InpuDateProps {
  label?: string;
  error?: string;
  size?: keyof typeof SIZES;
  minimumDate?: Date;
  maximumDate?: Date;
}

const InputDate: FC<TextInputProps & InpuDateProps> = ({
  label,
  value,
  error,
  maximumDate,
  minimumDate,
  onChangeText,
  ...props
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));
  const [show, setShow] = useState(false);
  const theme = useTheme<Theme>();

  return (
    <>
      <Pressable onPress={() => setShow(true)}>
        <Text variant="inputLabel">{label}</Text>
        <Box borderWidth={1} borderColor="mainBorder" borderRadius="m" px="m" py="m">
          {value ? <Text>{value}</Text> : <Text color="secondaryText">GG/MM/AAAA</Text>}
        </Box>
        {error && (
          <Text variant="error" marginTop="s">
            {error}
          </Text>
        )}
      </Pressable>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          mode="date"
          value={currentDate}
          is24Hour={false}
          locale="it-IT"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          style={{ backgroundColor: theme.colors.accentText }}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setShow(false);
              setCurrentDate(selectedDate);
              onChangeText && onChangeText(format(selectedDate, "dd/MM/yyyy"));
            }
          }}
        />
      )}
    </>
  );
};

export default InputDate;
