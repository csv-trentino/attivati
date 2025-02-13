import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import InputText from "@/components/ui/InputText";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useNetwork } from "@/contexts/network";
import { ActivityUpdateData } from "@/types/data";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function ActivityGiveupScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { client } = useNetwork();
  const queryClient = useQueryClient();

  if (!id || Array.isArray(id)) {
    throw new Error("id should be a string");
  }

  const activityId = parseInt(id);

  const { data } = useQuery({
    queryKey: ["activity", id],
    queryFn: async () => {
      const response = await client.GET("/activities/{id}", {
        params: {
          path: {
            id: activityId,
          },
        },
      });
      return response.data;
    },
  });

  const { handleSubmit, control } = useForm<ActivityUpdateData>();

  if (!data) {
    return null;
  }

  async function onSubmit(data: ActivityUpdateData) {
    try {
      const res = await client.PUT("/activities/{id}", {
        params: {
          path: {
            id: activityId,
          },
        },
        body: {
          status: "canceled",
          message: data.message || "",
        },
      });

      if (res.error) {
        throw new Error(res.error.detail);
      }

      queryClient.refetchQueries({ queryKey: ["activities"] });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t("error", "Error: " + error.message),
      });
      return;
    }

    router.replace({
      pathname: "/activities/[id]/confirm_giveup",
      params: {
        id: activityId,
      },
    });
  }

  return (
    <SafeAreaView>
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <Topbar goBack title={t("giveupVolunteerActivvity", "Give up volunteer activity")} />

        <Box marginTop="xl" marginBottom="l" marginHorizontal="m" gap="s">
          <Text variant="header" color="secondaryText">
            {t("giveupVolunteerActivvityWith", "Give up activity with")}
          </Text>
          <Text variant="header">{data.experience.organization.name}</Text>
        </Box>

        <Box px="m">
          <Text variant="body" color="secondaryText">
            {t("giveupActivityConfirmation", "Are you sure you want to give up this activity?")}
          </Text>

          <Box py="l">
            <Controller
              control={control}
              name="message"
              render={({ field: { value, onChange } }) => (
                <InputText
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={10}
                  placeholder={t("yourMessageOptional", "Your message (optional)")}
                />
              )}
            />
          </Box>
          <Button
            label={t("giveUp", "Give up")}
            marginVertical="s"
            onPress={handleSubmit(onSubmit)}
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
