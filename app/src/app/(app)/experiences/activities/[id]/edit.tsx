import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import InputDate from "@/components/ui/InputDate";
import InputText from "@/components/ui/InputText";
import InputTime from "@/components/ui/InputTime";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useNetwork } from "@/contexts/network";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import Toast from "react-native-toast-message";

interface EnrollmentData {
  from_date: string;
  to_date: string;
  from_time: string;
  to_time: string;
  accepted_requirements: boolean;
  accepted_privacy: boolean;
  message: string;
}

export default function ActivityEditScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { client } = useNetwork();
  const queryClient = useQueryClient();

  if (!id || Array.isArray(id)) {
    throw new Error("id should be a string");
  }

  const activityId = parseInt(id);

  const { data } = useQuery({
    queryKey: ["activities", id],
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

  const { control, handleSubmit, setValue } = useForm<EnrollmentData>();

  useEffect(() => {
    if (!data) {
      return;
    }
    setValue("from_time", data.start_time);
    // 2024-07-29T02:00:00+02:00 to 29/07/2024
    setValue("from_date", data.start_date.split("T")[0].split("-").reverse().join("/"));
    setValue("to_time", data.end_time);
    setValue("to_date", data.end_date.split("T")[0].split("-").reverse().join("/"));
    setValue("message", data.message);
    // setValue("accepted_requirements", data.accepted_requirements);
    // setValue("accepted_privacy", data.accepted_privacy);
  }, [data]);

  const deleteActivity = async () => {
    try {
      const res = await client.DELETE("/activities/{id}", {
        params: {
          path: {
            id: activityId,
          },
        },
      });
      if (res.error) {
        throw new Error(res.error.detail);
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t("error", "Error: " + error.message),
      });
      return;
    }

    await queryClient.refetchQueries({ queryKey: ["activities"] });

    Toast.show({
      type: "success",
      text1: t("activityDeleted", "Activity deleted"),
    });

    router.push("/experiences");
  };

  async function onSubmit(data: EnrollmentData) {
    try {
      const res = await client.PATCH("/activities/{id}", {
        body: {
          start_date: data.from_date.split("/").reverse().join("-"),
          start_time: data.from_time,
          end_date: data.to_date.split("/").reverse().join("-"),
          end_time: data.to_time,
          message: data.message || "",
          // accepted_requirements: data.accepted_requirements,
          // accepted_privacy: data.accepted_privacy,
        },
        params: {
          path: {
            id: activityId,
          },
        },
      });

      if (res.error) {
        throw new Error(res.error.detail);
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t("error", "Error: " + error.message),
      });
      return;
    }

    router.push({
      pathname: "/experiences/activities/[id]/confirm",
      params: {
        id: activityId,
      },
    });
  }
  if (!data) {
    return null;
  }

  return (
    <SafeAreaView>
      <Topbar goBack title="Modifica esperienza" />

      <Box marginTop="xl" marginBottom="l" marginHorizontal="m" gap="s">
        <Text variant="header" color="secondaryText">
          {t("iWantToHelp", "I want to help")}
        </Text>
        <Text variant="header">{data.experience.organization.name}</Text>
      </Box>
      <Box marginHorizontal="m" gap="l" marginTop="m">
        <Box flexDirection="row" justifyContent="space-between" marginVertical="m" gap="m">
          <Box flex={1}>
            <Controller
              control={control}
              name="from_time"
              render={({ field: { onChange, value } }) => (
                <InputTime
                  label={t("fromTime", "From hour")}
                  value={value}
                  onChangeText={onChange}
                  placeholder="HH:MM"
                />
              )}
            />
          </Box>
          <Box flex={1}>
            <Controller
              control={control}
              name="from_date"
              render={({ field: { onChange, value } }) => (
                <InputDate
                  label={t("fromDay", "Of the day")}
                  value={value}
                  onChangeText={onChange}
                  placeholder="GG/MM/AAAA"
                />
              )}
            />
          </Box>
        </Box>
      </Box>

      <Box marginHorizontal="m" gap="l" marginTop="m">
        <Box flexDirection="row" justifyContent="space-between" marginVertical="m" gap="m">
          <Box flex={1}>
            <Controller
              control={control}
              name="to_time"
              render={({ field: { onChange, value } }) => (
                <InputTime
                  label={t("toTime", "To hour")}
                  value={value}
                  onChangeText={onChange}
                  placeholder="HH:MM"
                />
              )}
            />
          </Box>
          <Box flex={1}>
            <Controller
              control={control}
              name="to_date"
              render={({ field: { onChange, value } }) => (
                <InputDate
                  label={t("toDate", "Of the day")}
                  value={value}
                  onChangeText={onChange}
                  placeholder="GG/MM/AAAA"
                />
              )}
            />
          </Box>
        </Box>

        <Controller
          control={control}
          name="message"
          render={({ field: { onChange, value } }) => (
            <InputText
              label={t("activityMessageLabel", "Why you would like to help")}
              value={value}
              onChangeText={onChange}
              placeholder={t(
                "activityWriteMessagePlaceholder",
                "Your message to the organization (optional)",
              )}
              multiline
              numberOfLines={4}
            />
          )}
        />

        <Button
          label={t("Edit", "Edit")}
          marginVertical="s"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
        />
      </Box>

      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p="s"
        justifyContent="center"
        alignItems="center"
        backgroundColor="whiteText"
        width="100%"
      >
        <Text variant="secondary">{t("cantPartecipate", "Can't partecipate anymore?")}</Text>

        <Pressable onPress={deleteActivity}>
          <Text variant="header" fontSize={18}>
            {t("giveUpActivity", "Give up this activity")}
          </Text>
        </Pressable>
      </Box>
    </SafeAreaView>
  );
}
