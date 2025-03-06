import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import InputDate from "@/components/ui/InputDate";
import InputText from "@/components/ui/InputText";
import InputTime from "@/components/ui/InputTime";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useSession } from "@/contexts/authentication";
import { useNetwork } from "@/contexts/network";
import { convertToDate } from "@/utils/formatters";
import { validateCF } from "@/utils/validators";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAfter, isBefore, isSameDay } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

interface EnrollmentData {
  from_date: string;
  to_date: string;
  from_time: string;
  to_time: string;
  tax_code?: string;
  accepted_requirements: boolean;
  accepted_privacy: boolean;
  message: string;
}

export default function ExperienceEnrollScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { client } = useNetwork();
  const { session, fetchUser } = useSession();
  const queryClient = useQueryClient();

  if (!id || Array.isArray(id)) {
    throw new Error("id should be a string");
  }

  const experienceId = parseInt(id);

  const { data } = useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      const response = await client.GET("/experiences/{id}", {
        params: {
          path: {
            id: experienceId,
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
    formState: { errors },
  } = useForm<EnrollmentData>();

  if (!data) {
    return null;
  }

  async function onSubmit(values: EnrollmentData) {
    let errors = [];

    const volStartDate = new Date(values?.from_date?.split("/").reverse().join("-"));
    const volEndDate = new Date(values?.to_date?.split("/").reverse().join("-"));
    const volStartTime = values.from_time; // HH:MM
    const volEndTime = values.to_time; // HH:MM
    const expStartDate = new Date(data.start_date);
    const expEndDate = new Date(data.end_date);
    const today = new Date()
    today.setHours(0, 0, 0, 0);

    try {
      if (!session?.user?.tax_code && (!values.tax_code || !validateCF(values.tax_code))) {
        errors.push("tax_code");
        setError("tax_code", {
          type: "manual",
          message: t("Invalid tax code"),
        });
      }

      if (!values.accepted_requirements) {
        errors.push("accepted_requirements");
        setError("accepted_requirements", {
          type: "manual",
          message: t("youMustAcceptRequirements", "You must accept the required criteria"),
        });
      }

      if (!values.accepted_privacy) {
        errors.push("accepted_privacy");
        setError("accepted_privacy", {
          type: "manual",
          message: t("youMustAcceptPrivacy", "You must accept the privacy policy"),
        });
      }

      // error if vol start date is not filled
      if (!values.from_date) {
        errors.push("from_date");
        setError("from_date", {
          type: "manual",
          message: t("fillStartDate", "You must fill the start date"),
        });
      }

      // error if vol end date is not filled
      if (!values.to_date) {
        errors.push("to_date");
        setError("to_date", {
          type: "manual",
          message: t("fillEndDate", "You must fill the end date"),
        });
      }

      // error if vol end date is before vol start date
      if (volStartDate && volEndDate && isAfter(volStartDate, volEndDate)) {
        errors.push("to_date");
        setError("to_date", {
          type: "manual",
          message: t("endDateBeforeStartDate", "End date must be after start date"),
        });
      }
      

      // error if vol start date is before today (equal admitted)
      if (volStartDate && isBefore(volStartDate, today)) {
        errors.push("from_date");
        setError("from_date", {
          type: "manual",
          message: t("startDateBeforeToday", "Start date must be after today"),
        });
      }

      
      // error if vol start date is before exp start date (equal admitted)
      if (volStartDate && isBefore(volStartDate, expStartDate)) {
        errors.push("from_date");
        setError("from_date", {
          type: "manual",
          message: t("startDateBeforeExperience", "Start date must be after experience start date"),
        });
      }
      
      // error if vol start date is after exp end date (equal admitted)
      if (volStartDate && isAfter(volStartDate, expEndDate)) {
        errors.push("from_date");
        setError("from_date", {
          type: "manual",
          message: t("startDateAfterExperience", "Start date must be before experience end date"),
        });
      }

      
      // error if vol end date is before today (equal admitted)
      if (volEndDate &&  isBefore(volEndDate, today)) {
        errors.push("to_date");
        setError("to_date", {
          type: "manual",
          message: t("endDateBeforeToday", "End date must be after today"),
        });
      }

      // error if vol end date is before exp start date (equal admitted)
      if (volEndDate && isBefore(volEndDate, expStartDate)) {
        errors.push("to_date");
        setError("to_date", {
          type: "manual",
          message: t("endDateBeforeExperience", "End date must be after experience start date"),
        });
      }

      // error if vol end date is after exp end date (equal admitted)
      if (volEndDate && isAfter(volEndDate, expEndDate)) {
        errors.push("to_date");
        setError("to_date", {
          type: "manual",
          message: t("endDateAfterExperience", "End date must be before experience end date"),
        });
      }


      // if is today (volStartTime == volEndTime) check if hour start is before hour end
      if (volStartDate && volEndDate && volStartTime && volEndTime && isSameDay(volStartDate, volEndDate)) {
        const startTime = new Date()
        startTime.setHours(
          parseInt(volStartTime.split(":")[0]),
          parseInt(volStartTime.split(":")[1]),
          0,
          0,
        );

        const endTime = new Date()
        endTime.setHours(
          parseInt(volEndTime.split(":")[0]),
          parseInt(volEndTime.split(":")[1]),
          0,
          0,
        );

        if (isAfter(startTime, endTime)) {
          errors.push("to_time");
          setError("to_time", {
            type: "manual",
            message: t("endTimeBeforeStartTime", "End time must be after start time"),
          });
        }
      }
      
      if (errors.length > 0) {
        console.log("errors", errors);
        return;
      }

      const res = await client.POST("/activities", {
        body: {
          start_date: volStartDate.toISOString().split("T")[0],
          start_time: values.from_time || "",
          end_date: volEndDate.toISOString().split("T")[0],
          end_time: values.to_time || "",
          experience_id: experienceId,
          tax_code: values.tax_code || "",
          message: values.message || "",
        },
      });

      if (res.error) {
        throw new Error(res.error.detail);
      }

      if (values.tax_code) {
        fetchUser();
      }

      queryClient.refetchQueries({ queryKey: ["activities"] });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t("error", "Error: " + error.message),
      });
      return;
    }

    router.replace(`/experiences/${id}/confirm`);
  }

  return (
    <SafeAreaView>
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <Topbar goBack title="Conferma esperienza" />

        <Box marginTop="xl" marginBottom="l" marginHorizontal="m" gap="s">
          <Text variant="header" color="secondaryText">
            {t("iWantToHelp", "I want to help")}
          </Text>
          <Text variant="header">{data.organization.name}</Text>
        </Box>

        <Box marginHorizontal="m" gap="l">
          <Text fontWeight="bold">{t("activityMessageLabel", "Why you would like to help")}</Text>
          <Controller
            control={control}
            name="message"
            render={({ field: { onChange, value } }) => (
              <InputText
                value={value}
                style={{ height: 100 }}
                onChangeText={onChange}
                placeholder={t(
                  "activityWriteMessagePlaceholder",
                  "Your message to the organization (optional)",
                )}
                multiline
              />
            )}
          />
          <Text fontWeight="bold">Quali sono le tue disponibilità?</Text>
          <Box flexDirection="row" justifyContent="space-between" gap="m">
            <Box flex={1}>
              <Controller
                control={control}
                name="from_date"
                render={({ field: { onChange, value } }) => (
                  <InputDate
                    label={t("fromDay", "Of the day")}
                    value={value}
                    minimumDate={new Date()}
                    maximumDate={convertToDate(data.end_date)}
                    error={errors.from_date?.message}
                    onChangeText={onChange}
                    placeholder="GG/MM/AAAA"
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
                    error={errors.to_date?.message}
                    minimumDate={new Date()}
                    maximumDate={convertToDate(data.end_date)}
                    onChangeText={onChange}
                    placeholder="GG/MM/AAAA"
                  />
                )}
              />
            </Box>
          </Box>
        </Box>

        <Box marginHorizontal="m" marginVertical="m" gap="l">
          <Box flexDirection="row" justifyContent="space-between" marginVertical="s" gap="m">
            <Box flex={1}>
              <Controller
                control={control}
                name="from_time"
                render={({ field: { onChange, value } }) => (
                  <InputTime
                    label={t("fromTime", "From hour")}
                    value={value}
                    error={errors.from_time?.message}
                    onChangeText={onChange}
                    placeholder="HH:MM"
                  />
                )}
              />
            </Box>
            <Box flex={1}>
              <Controller
                control={control}
                name="to_time"
                render={({ field: { onChange, value } }) => (
                  <InputTime
                    label={t("toTime", "To hour")}
                    value={value}
                    error={errors.to_time?.message}
                    onChangeText={onChange}
                    placeholder="HH:MM"
                  />
                )}
              />
            </Box>
          </Box>
          {!session?.user?.tax_code && (
            <Controller
              control={control}
              name="tax_code"
              render={({ field: { onChange, value } }) => (
                <InputText
                  label={t("taxCode", "Tax code")}
                  value={value}
                  autoCapitalize={"characters"}
                  error={errors.tax_code?.message}
                  uppercase
                  onChangeText={onChange}
                  placeholder={t("yourTaxCode", "Insert your tax code for insurance purposes")}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="accepted_requirements"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                value={value || false}
                onChange={onChange}
                error={errors.accepted_requirements?.message}
              >
                <Box flexDirection="row" gap="s" flexWrap="wrap">
                  <Text variant="body">
                    <Trans i18nKey="acceptedRequirements">
                      I confirm that I meet the required criteria
                    </Trans>
                  </Text>
                  <Box marginLeft="s">
                    {/* <Text variant="body" color="secondaryText">
                      • Avere almeno 14 anni
                    </Text>
                    <Text variant="body" color="secondaryText">
                      • Auto
                    </Text> */}
                  </Box>
                </Box>
              </Checkbox>
            )}
          />

          <Controller
            control={control}
            name="accepted_privacy"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                value={value || false}
                onChange={onChange}
                error={errors.accepted_privacy?.message}
              >
                <Box flexDirection="row" gap="s" flexWrap="wrap">
                  <Text variant="body">
                    <Trans
                      i18nKey="acceptedOrganizationPrivacy"
                      values={{ organization: data.organization.name }}
                    >
                      I consent to share my data with {{ organization: data.organization.name }}
                    </Trans>
                  </Text>
                </Box>
              </Checkbox>
            )}
          />

          <Button
            label={t("continue", "Continue")}
            marginVertical="s"
            onPress={handleSubmit(onSubmit)}
            // isDisabled={!email || !email.includes("@")}
            variant="primary"
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
