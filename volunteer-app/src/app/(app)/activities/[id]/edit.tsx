import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import InputDate from "@/components/ui/InputDate";
import InputTime from "@/components/ui/InputTime";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useNetwork } from "@/contexts/network";
import { ActivityUpdateData } from "@/types/data";
import { convertToDate, convertToDDMMYYYY } from "@/utils/formatters";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

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

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ActivityUpdateData>();

  useEffect(() => {
    if (data) {
      if (data.start_date) {
        setValue("start_date", convertToDDMMYYYY(data.start_date));
      }
      setValue("start_time", data.start_time);
      if (data.end_date) {
        setValue("end_date", convertToDDMMYYYY(data.end_date));
      }
      setValue("end_time", data.end_time);
    }
  }, [data, setValue]);

  if (!data) {
    return null;
  }

  async function onSubmit(data: ActivityUpdateData) {
    try {
      let start_date = undefined;
      let end_date = undefined;

      if (data.start_date) {
        start_date = data.start_date.split("/").reverse().join("-");
      }

      if (data.end_date) {
        end_date = data.end_date.split("/").reverse().join("-");
      }

      if (start_date && end_date) {
        if (new Date(start_date) > new Date(end_date)) {
          setError("end_date", {
            type: "manual",
            message: t("endDateBeforeStartDate", "End date must be after start date"),
          });

          return;
        }
      }

      if (data.start_time && data.end_time && data.start_date === data.end_date) {
        if (data.start_time > data.end_time) {
          setError("end_time", {
            type: "manual",
            message: t("endTimeBeforeStartTime", "End time must be after start time"),
          });

          return;
        }
      }

      if (data.start_time && data.start_date && start_date) {
        // if start_date is today, check if start_time is in the future

        const now = new Date();
        const from_date = new Date(start_date);

        if (now.toDateString() === from_date.toDateString()) {
          const [hours, minutes] = data.start_time.split(":").map((v) => parseInt(v));

          if (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() > minutes)) {
            setError("start_time", {
              type: "manual",
              message: t("startTimeInPast", "Start time must be in the future"),
            });

            return;
          }
        }
      }

      const res = await client.PUT(`/activities/{id}`, {
        params: {
          path: {
            id: activityId,
          },
        },
        body: {
          start_date,
          start_time: data.start_time,
          end_date,
          end_time: data.end_time,
        },
      });

      if (res.error) {
        throw new Error(res.error.detail);
      }

      queryClient.refetchQueries({ queryKey: ["activities"] });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text2: t("error", "Error: " + error.message),
      });
      return;
    }

    router.replace({
      pathname: "/activities/[id]/confirm",
      params: {
        id: activityId,
      },
    });
  }

  return (
    <SafeAreaView>
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <Topbar goBack title={t("editVolunteerActivvity", "Edit volunteer activity")} />

        <Box marginTop="xl" marginBottom="l" marginHorizontal="m" gap="s">
          <Text variant="header" color="secondaryText">
            {t("editActivityWith", "Edit activity with")}
          </Text>
          <Text variant="header">{data.experience.organization.name}</Text>
        </Box>
        <Box marginHorizontal="m" gap="l">
          <Box flexDirection="row" justifyContent="space-between" marginVertical="m" gap="m">
            <Box flex={1}>
              <Controller
                control={control}
                name="end_time"
                render={({ field: { onChange, value } }) => (
                  <InputTime
                    label={t("fromTime", "From hour")}
                    value={value}
                    error={errors.end_time?.message}
                    onChangeText={onChange}
                    placeholder="HH:MM"
                  />
                )}
              />
            </Box>
            <Box flex={1}>
              <Controller
                control={control}
                name="start_date"
                render={({ field: { onChange, value } }) => (
                  <InputDate
                    label={t("fromDay", "Of the day")}
                    value={value}
                    error={errors.start_date?.message}
                    minimumDate={new Date()}
                    maximumDate={data.end_date ? convertToDate(data.end_date) : undefined}
                    onChangeText={onChange}
                    placeholder="GG/MM/AAAA"
                  />
                )}
              />
            </Box>
          </Box>
        </Box>

        <Box marginHorizontal="m" gap="l" flex={1}>
          <Box flexDirection="row" justifyContent="space-between" marginVertical="s" gap="m">
            <Box flex={1}>
              <Controller
                control={control}
                name="end_time"
                render={({ field: { onChange, value } }) => (
                  <InputTime
                    label={t("toTime", "To hour")}
                    value={value}
                    error={errors.end_time?.message}
                    onChangeText={onChange}
                    placeholder="HH:MM"
                  />
                )}
              />
            </Box>
            <Box flex={1}>
              <Controller
                control={control}
                name="end_date"
                render={({ field: { onChange, value } }) => (
                  <InputDate
                    label={t("toDate", "Of the day")}
                    value={value}
                    error={errors.end_date?.message}
                    minimumDate={new Date()}
                    maximumDate={data.end_date ? convertToDate(data.end_date) : undefined}
                    onChangeText={onChange}
                    placeholder="GG/MM/AAAA"
                  />
                )}
              />
            </Box>
          </Box>

          <Button
            label={t("continue", "Continue")}
            marginVertical="s"
            onPress={handleSubmit(onSubmit)}
            // isDisabled={!email || !email.includes("@")}
            variant="primary"
          />
        </Box>
        <Box marginTop="l" alignItems="center">
          <Text variant="secondary">
            <Trans i18nKey="youCantParticipate">You can't participate?</Trans>
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: `/activities/[id]/giveup`,
                params: { id: id },
              })
            }
          >
            <Text variant="title" marginTop="m" textDecorationLine="underline" fontSize={18}>
              <Trans i18nKey="giveUpThisActivity">Give up this activity</Trans>
            </Text>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
