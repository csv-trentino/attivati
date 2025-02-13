import { createTheme } from "@shopify/restyle";
import { palette } from "./colors";

const theme = createTheme({
  colors: {
    mainText: palette.black,
    secondaryText: palette.gray500,
    accentText: palette.pink500,
    errorText: palette.red400,
    whiteText: palette.white,
    mainBackground: palette.white,
    invertedBackground: palette.black,
    primaryBackground: palette.pink500,
    primaryLightBackground: palette.pink100,
    darkBackground: palette.gray900,
    shadow: palette.black,
    lightBorder: palette.gray50,
    mainBorder: palette.gray50,
    disabledBackground: palette.gray100,

    statusPending: palette.orange500,
    statusAccepted: palette.green500,
    statusRejected: palette.red500,
    statusCanceled: palette.gray500,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
    "2xl": 60,
    "3xl": 80,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 16,
    xl: 32,
    full: 9999,
  },
  buttonSizes: {
    s: {
      fontSize: 12,
    },
    m: {
      fontSize: 16,
    },
    l: {
      fontSize: 18,
    },
  },
  buttonVariants: {
    primary: {
      backgroundColor: "primaryBackground",
      borderRadius: "m",
      color: "whiteText",
    },
    secondary: {
      backgroundColor: "primaryLightBackground",
      borderRadius: "m",
      color: "accentText",
    },
    outline: {
      backgroundColor: "mainBackground",
      borderWidth: 1,
      borderColor: "mainBorder",
      color: "mainText",
    },
    ghost: {
      backgroundColor: "mainBackground",
      borderWidth: 1,
      color: "mainText",
    },
    danger: {
      backgroundColor: "errorText",
      color: "whiteText",
    },
    disabled: {
      backgroundColor: "disabledBackground",
      color: "whiteText",
    },
    link: {
      borderWidth: 0,
      backgroundColor: "mainBackground",
      color: "mainText",
      textDecorationLine: "underline",
    },
    defaults: {
      color: "whiteText",
      backgroundColor: "darkBackground",
    },
  },
  textVariants: {
    buttonLabel: {
      fontSize: 16,
      color: "mainBackground",
      fontFamily: "DMSansMedium",
    },
    inputLabel: {
      fontSize: 16,
      fontFamily: "DMSansMedium",
      lineHeight: 17.6,
    },
    header: {
      fontSize: 32,
      fontFamily: "DMSansMedium",
      lineHeight: 38,
    },
    title: {
      fontSize: 24,
      lineHeight: 25,
      fontFamily: "DMSansRegular",
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 18.8,
      fontWeight: "700",
      marginBottom: "s",
      marginTop: "m",
      fontFamily: "DMSansRegular",
    },
    body: {
      fontSize: 16,
      lineHeight: 18.8,
      fontFamily: "DMSansRegular",
    },
    link: {
      fontSize: 16,
      lineHeight: 18.8,
      fontFamily: "DMSansMedium",
      fontWeight: "700",
      textDecorationLine: "underline",
    },
    secondary: {
      fontSize: 13,
      lineHeight: 16.9,
      color: "secondaryText",
      fontFamily: "DMSansRegular",
    },
    error: {
      fontSize: 14,
      lineHeight: 16.8,
      fontFamily: "DMSansRegular",
      color: "errorText",
    },
    defaults: {
      fontFamily: "DMSansRegular",
      color: "mainText",
    },
  },
});

export type Theme = typeof theme;
export default theme;
