import { FC, useMemo, useState } from "react";
import { TextInput, TextInputProps } from "react-native";
import Box from "./Box";
import Text from "./Text";

const SIZES = {
  s: 48,
  m: 56,
  l: 64,
};

export interface InputTextProps {
  label?: string;
  error?: string;
  size?: keyof typeof SIZES;
  uppercase?: boolean;
}

const InputText: FC<TextInputProps & InputTextProps> = ({ label, size, error, ...rest }) => {
  const [isSecure, setIsSecure] = useState(rest.secureTextEntry || false);

  function handleTextChange(text: string) {
    if (rest.uppercase) {
      rest.onChangeText?.(text.toUpperCase());
    } else {
      rest.onChangeText?.(text);
    }
  }

  const getHeigth = useMemo(() => {
    if (rest.multiline) {
      return { height: 100, minHeight: 100 };
    }
    return {
      height: size ? SIZES[size] : SIZES.m,
      minHeight: size ? SIZES[size] : SIZES.m,
    };
  }, [rest.multiline, size]);

  return (
    <Box>
      {label && <Text variant="inputLabel">{label}</Text>}
      <Box
        alignItems="center"
        borderWidth={1}
        borderColor="mainBorder"
        borderRadius="m"
        width="100%"
        position="relative"
        height={getHeigth.height}
      >
        <TextInput
          {...rest}
          style={{
            flex: 1,
            width: "100%",
            paddingHorizontal: 16,
            paddingVertical: rest.multiline ? 16 : 0,
            height: getHeigth.height,
            minHeight: getHeigth.height,
            textAlignVertical: rest.multiline ? "top" : "center",
          }}
          multiline={rest.multiline}
          numberOfLines={10}
          onChangeText={handleTextChange}
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

export default InputText;
