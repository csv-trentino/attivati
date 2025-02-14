import { Theme } from "@/config/theme";
import { TouchableOpacity } from "react-native";
import { BaseToastProps, ErrorToast } from "react-native-toast-message";
import Box from "./Box";
import Icon, { IconName } from "./Icon";
import Text from "./Text";

type IconToastProps = {
  props: {
    icon?: IconName;
  };
} & BaseToastProps;

export const toastConfig = (theme: Theme) => {
  return {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props: IconToastProps) => (
      <TouchableOpacity
        onPress={props.onPress}
        activeOpacity={props.activeOpacity}
        {...props.touchableContainerProps}
      >
        <Box
          flexDirection="row"
          marginHorizontal="xl"
          borderWidth={1}
          borderRadius="m"
          borderColor="mainBorder"
          paddingHorizontal="m"
          paddingVertical="m"
          shadowColor="shadow"
          shadowOffset={{ width: -2, height: 4 }}
          shadowOpacity={0.2}
          shadowRadius={3}
          elevation={6}
          width="90%"
          backgroundColor="mainBackground"
        >
          {props.props.icon && (
            <Box
              justifyContent="center"
              alignItems="center"
              backgroundColor="darkBackground"
              borderRadius="full"
              width={40}
              height={40}
              mr="m"
            >
              <Icon name={props.props.icon} size={24} color={theme.colors.whiteText} />
            </Box>
          )}
          <Box pr="m" flex={1}>
            <Text variant="title" fontSize={15} lineHeight={20} marginBottom="s" fontWeight={700}>
              {props.text1}
            </Text>
            <Text variant="body" fontSize={14} lineHeight={16} fontWeight={400}>
              {props.text2}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props: BaseToastProps) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
    // icon: ({ name, ...props }: IconToasProps) => (
    //   <Box style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
    //     <Text>{props.text1}</Text>
    //     <Text>{props.text2}</Text>
    //   </Box>
    // )
  };
};
