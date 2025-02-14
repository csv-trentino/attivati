import { Theme } from "@/config/theme";
import { BoxProps } from "@shopify/restyle";
import { FC } from "react";
import Box from "./Box";

const Divider: FC<BoxProps<Theme>> = (props) => {
  return <Box height={1} flex={1} backgroundColor="mainBorder" {...props} />;
};

export default Divider;
