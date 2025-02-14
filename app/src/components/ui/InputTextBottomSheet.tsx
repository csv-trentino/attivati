import { FC, useState } from "react";
import { TextInput, TextInputProps } from "react-native";
import Box from "./Box";
import Text from "./Text";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

const SIZES = {
  s: 48,
  m: 56,
  l: 64,
};

interface InputTextProps {
  label?: string;
  error?: string;
  size?: keyof typeof SIZES;
}

export type InputTextBottomSheetProps = TextInputProps & InputTextProps;

const InputTextBottomSheet: FC<InputTextBottomSheetProps> = ({ label, size, error, ...rest }) => {
  const [isSecure, setIsSecure] = useState(rest.secureTextEntry || false);

  return (
    <Box width="100%">
      {label && <Text variant="inputLabel">{label}</Text>}
      <Box
        alignItems="center"
        borderWidth={1}
        borderColor="mainBorder"
        borderRadius="m"
        width="100%"
        position="relative"
        height={size ? SIZES[size] : SIZES.m}
      >
        {/* <TextInput
          style={{ flex: 1, width: "100%", paddingHorizontal: 16 }}
          {...rest}
          secureTextEntry={isSecure}
        /> */}

        <BottomSheetTextInput
          style={{ flex: 1, width: "100%", paddingHorizontal: 16 }}
          {...rest}
          secureTextEntry={isSecure}
        />

        {rest.secureTextEntry && (
          <Box position="absolute" right={16} height="100%" justifyContent="center">
            <Text
              variant="body"
              fontSize={12}
              fontWeight={700}
              fontFamily="DMSansRegular"
              textDecorationLine="underline"
              onPress={() => setIsSecure(!isSecure)}
              color="mainText"
            >
              {isSecure ? "Mostra" : "Nascondi"}
            </Text>
          </Box>
        )}
      </Box>
      {error && (
        <Text variant="error" marginTop="s">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default InputTextBottomSheet;
