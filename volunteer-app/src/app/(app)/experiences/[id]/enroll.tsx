import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import InputDate from "@/components/ui/InputDate";
import SafeAreaView from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useNetwork } from "@/contexts/network";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";

interface EnrollmentData {
  from_date: string;
  to_date: string;
  accepted_requirements: boolean;
  accepted_privacy: boolean;
}

export default function ExperienceEnrollScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { client } = useNetwork();

  if (!id || Array.isArray(id)) {
    throw new Error("id should be a string");
  }

  const experienceId = parseInt(id);

  const { data } = useQuery({
    queryKey: ["activities", id],
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

  const { control, handleSubmit } = useForm<EnrollmentData>();

  if (!data) {
    return null;
  }

  async function onSubmit(data: EnrollmentData) {
    console.log(data); // TODO: send data to API

    router.replace(`/experiences/${id}/confirm`);
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Topbar goBack title="Conferma esperienza" />

        <Box marginTop="xl" marginBottom="l" marginHorizontal="m" gap="s">
          <Text variant="header" color="secondaryText">
            {t("iWantToHelp", "I want to help")}
          </Text>
          <Text variant="header">{data.organization.name}</Text>
        </Box>
        <Box marginHorizontal="m" gap="l" marginTop="m">
          <Box flexDirection="row" justifyContent="space-between" marginVertical="m" gap="m">
            <Box flex={1}>
              <Controller
                control={control}
                name="from_date"
                render={({ field: { onChange, value } }) => (
                  <InputDate
                    label={t("from", "From")}
                    value={value}
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
                    label={t("to", "To")}
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
            name="accepted_requirements"
            render={({ field: { onChange, value } }) => (
              <Checkbox value={value || false} onChange={onChange}>
                <Box flexDirection="row" gap="s" flexWrap="wrap">
                  <Text variant="body">
                    <Trans i18nKey="acceptedRequirements">
                      I confirm that I meet the required criteria
                    </Trans>
                  </Text>
                  <Box marginLeft="s">
                    <Text variant="body" color="secondaryText">
                      • Maggiore età
                    </Text>
                    <Text variant="body" color="secondaryText">
                      • Auto
                    </Text>
                  </Box>
                </Box>
              </Checkbox>
            )}
          />

          <Controller
            control={control}
            name="accepted_privacy"
            render={({ field: { onChange, value } }) => (
              <Checkbox value={value || false} onChange={onChange}>
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
