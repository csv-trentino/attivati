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
    let errors = false;
    try {
      if (!session?.user?.tax_code && (!values.tax_code || !validateCF(values.tax_code))) {
        errors = true;
        setError("tax_code", {
          type: "manual",
          message: t("Invalid tax code"),
        });
      }

      if (!values.accepted_requirements) {
        errors = true;
        setError("accepted_requirements", {
          type: "manual",
          message: t("youMustAcceptRequirements", "You must accept the required criteria"),
        });
      }

      if (!values.accepted_privacy) {
        errors = true;
        setError("accepted_privacy", {
          type: "manual",
          message: t("youMustAcceptPrivacy", "You must accept the privacy policy"),
        });
      }

      if (errors) {
        return;
      }

      let start_date = "";
      let end_date = "";

      if (values.from_date && values.to_date) {
        start_date = values.from_date.split("/").reverse().join("-");
        end_date = values.to_date.split("/").reverse().join("-");

        if (new Date(start_date) > new Date(end_date)) {
          setError("to_date", {
            type: "manual",
            message: t("endDateBeforeStartDate", "End date must be after start date"),
          });

          return;
        }
      }

      if (values.from_time && values.to_time && values.from_date === values.to_date) {
        if (values.from_time > values.to_time) {
          setError("to_time", {
            type: "manual",
            message: t("endTimeBeforeStartTime", "End time must be after start time"),
          });

          return;
        }
      }

      if (values.from_time && values.from_date) {
        // if from_date is today, check if from_time is in the future
        const now = new Date();
        const from_date = new Date(start_date);

        if (now.toDateString() === from_date.toDateString()) {
          const [hours, minutes] = values.from_time.split(":").map((v) => parseInt(v));

          if (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() > minutes)) {
            setError("from_time", {
              type: "manual",
              message: t("startTimeInPast", "Start time must be in the future"),
            });

            return;
          }
        }
      }

      const res = await client.POST("/activities", {
        body: {
          start_date,
          start_time: values.from_time || "",
          end_date,
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
