import { FC } from "react";
import { LayoutAnimation, Pressable } from "react-native";
import Box from "./Box";

const SIZES = {
  s: 24,
  m: 28,
  l: 32,
};

interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  size?: keyof typeof SIZES;
}

const Switch: FC<SwitchProps> = ({ value, onChange, size }) => {
  const chosenSize = SIZES[size || "m"];

  function handelChange() {
    LayoutAnimation.easeInEaseOut();
    onChange(!value);
  }

  return (
    <Pressable onPress={() => handelChange()}>
      <Box
        backgroundColor={value ? "accentText" : "lightBorder"}
        borderRadius="full"
        height={chosenSize + 2}
        width={chosenSize * 2 + 2}
        style={{
          paddingHorizontal: 1,
          paddingVertical: 1,
        }}
        justifyContent={value ? "flex-end" : "flex-start"}
        position="relative"
      >
        <Box
          borderRadius="full"
          backgroundColor="whiteText"
          position="absolute"
          left={value ? chosenSize : 1}
          top={1}
          width={chosenSize}
          height={chosenSize}
        ></Box>
      </Box>
    </Pressable>
  );
};

export default Switch;
