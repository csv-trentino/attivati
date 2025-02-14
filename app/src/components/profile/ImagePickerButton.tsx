import { Theme } from "@/config/theme";
import { useTheme } from "@shopify/restyle";
import * as ImagePicker from "expo-image-picker";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import Box from "../ui/Box";
import Icon from "../ui/Icon";
import Text from "../ui/Text";
import { MediaResource } from "./ProfileAvatar";

interface ProfileDataFormProps {
  onSubmit?: (uri: MediaResource) => void;
}

const ImagePickerButton: FC<ProfileDataFormProps> = ({ onSubmit }) => {
  const theme = useTheme<Theme>();
  const { t } = useTranslation();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && onSubmit) {
      const filename = result.assets[0].uri.split("/").pop();

      onSubmit({
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || filename || "avatar.jpg",
        type: result.assets[0].mimeType || "",
      });
    }
  };

  return (
    <Pressable onPress={pickImage}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        borderBottomColor="lightBorder"
        alignItems="center"
        height={58}
        borderBottomWidth={1}
      >
        <Text variant="body">{t("pickFromGallery", "Pick an image from gallery")}</Text>

        <Icon name="chevron-right" size={24} color={theme.colors.mainText} strokeWith="1.5" />
      </Box>
    </Pressable>
  );
};

export default ImagePickerButton;
