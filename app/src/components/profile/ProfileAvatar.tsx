import { getApiUrl } from "@/config/network";
import { useSession } from "@/contexts/authentication";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Platform, Pressable, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Box from "../ui/Box";
import Icon from "../ui/Icon";
import Text from "../ui/Text";
import CameraPickerButton from "./CameraPickerButton";
import ImagePickerButton from "./ImagePickerButton";

const emptyAvatarImage = require("@/assets/images/empty-avatar.png");

export type MediaResource = {
  uri: string;
  name: string;
  type: string;
};

interface ProfileAvatarProps {
  url?: string;
  onChange?: (url: string) => void;
  editable?: boolean;
}

const ProfileAvatar: FC<ProfileAvatarProps> = ({ url, onChange, editable }) => {
  const { t } = useTranslation();
  const { getAccessToken } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const uploadMedia = useMutation({
    mutationFn: async (media: MediaResource) => {
      const token = await getAccessToken();
      const formData = new FormData();

      // @ts-ignore
      formData.append("file", {
        uri: Platform.OS === "android" ? media.uri : media.uri.replace("file://", ""),
        name: media.name,
        type: media.type,
      });
      // formData.append("name", media.name);

      setIsLoading(true);

      const response = await fetch(`${getApiUrl()}/media`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        alert("Failed to upload media");
      }

      const data = await response.json();

      setIsLoading(false);

      return data;
    },
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, [bottomSheetModalRef]);

  const handleImagePickerSubmit = useCallback(
    async (media: MediaResource) => {
      try {
        uploadMedia.mutate(media, {
          onSuccess: (data) => {
            onChange && onChange(data.Url);
          },
        });
        handleCloseModalPress();
      } catch (e) {
        console.log(e);
      }
    },
    [onChange, handleCloseModalPress, uploadMedia],
  );

  const source = useMemo(() => {
    if (url) {
      return url;
    }

    return emptyAvatarImage;
  }, [url]);

  return (
    <Box justifyContent="center" alignItems="center">
      {isLoading ? (
        <Box
          width={160}
          height={160}
          borderRadius="full"
          borderRightColor="mainBorder"
          borderWidth={1}
          justifyContent="center"
          alignItems="center"
        >
          <ActivityIndicator />
        </Box>
      ) : (
        <Image
          source={source}
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
          }}
        />
      )}
      {editable && !isLoading && (
        <>
          <TouchableOpacity onPress={handlePresentModalPress}>
            <Box
              bottom={10}
              backgroundColor="darkBackground"
              px="m"
              py="s"
              gap="s"
              flexDirection="row"
              alignItems="center"
              borderRadius="full"
            >
              <Icon name="camera" size={24} color="#FFFFFF" />
              <Text color="whiteText">{t("add", "Add")}</Text>
            </Box>
          </TouchableOpacity>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            enablePanDownToClose={true}
            enableDynamicSizing={true}
            handleComponent={null}
            backgroundStyle={styles.modalBackground}
            backdropComponent={(props) => (
              <BottomSheetBackdrop
                opacity={0.6}
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
              />
            )}
          >
            <BottomSheetView style={{}}>
              <Box
                height={56}
                borderBottomWidth={1}
                flexDirection="row"
                borderBottomColor="lightBorder"
                width="100%"
                justifyContent="space-between"
                paddingHorizontal="m"
                position="relative"
                alignItems="center"
              >
                <Box minWidth={20}>
                  <Pressable onPress={handleCloseModalPress}>
                    <Icon name="close" />
                  </Pressable>
                </Box>

                <Text fontWeight="700">{t("chooseAvatar", "Choose an image")}</Text>
                <Box minWidth={20}></Box>
              </Box>
              <Box marginHorizontal="m" marginTop="s" marginBottom="2xl">
                <CameraPickerButton onSubmit={handleImagePickerSubmit} />
                <ImagePickerButton onSubmit={handleImagePickerSubmit} />
              </Box>
            </BottomSheetView>
          </BottomSheetModal>
        </>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default ProfileAvatar;
