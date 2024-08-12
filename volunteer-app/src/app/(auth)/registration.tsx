import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import InputText from "@/components/ui/InputText";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useSession } from "@/contexts/authentication";
import { useNetwork } from "@/contexts/network";
import { ProfileData } from "@/types/data";
import { validateCF } from "@/utils/validators";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as Yup from "yup";

type RegistrationData = Pick<
  ProfileData,
  "first_name" | "last_name" | "date_of_birth" | "tax_code" | "accepted_tos" | "accepted_newsletter"
>;

const schema = Yup.object().shape({
  first_name: Yup.string().required("Questo campo è obbligatorio"),
  last_name: Yup.string().required("Questo campo è obbligatorio"),
  date_of_birth: Yup.string().required("Questo campo è obbligatorio"),
  tax_code: Yup.string(),
  accepted_tos: Yup.boolean()
    .required("Devi accettare i Termini di Servizio")
    .oneOf([true], "Devi accettare i Termini di Servizio"),
  accepted_newsletter: Yup.boolean().oneOf([true, false]),
});

export default function RegistrationScreen() {
  const { client } = useNetwork();
  const { fetchUser, signOut } = useSession();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    formState: { errors },
    control,
    watch,
    setValue,
    handleSubmit,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // first_name: "test",
      // last_name: "test",
      // date_of_birth: "20/12/1980",
      // tax_code: "test",
      // accepted_tos: true,
      accepted_newsletter: false,
    },
  });

  async function onSubmit(data: RegistrationData) {
    try {
      setIsLoading(true);

      if (data.tax_code && !validateCF(data.tax_code)) {
        setError("tax_code", {
          type: "manual",
          message: t("Invalid tax code"),
        });
        setIsLoading(false);
        return;
      }

      const response = await client.PATCH("/auth/user", {
        body: data,
      });

      await fetchUser();
      setIsLoading(false);

      if (!response.error) {
        router.replace("/explore");
        return;
      } else {
        console.log("profile error:", response.error);
        Toast.show({
          type: "error",
          text2: t(
            "profileUpdateError",
            "An error occurred while updating your profile. Please try again later.",
          ),
        });
      }
    } catch (error) {
      console.error("profile error:", error);
      setIsLoading(false);
      Toast.show({
        type: "error",
        text2: t(
          "profileUpdateError",
          "An error occurred while updating your profile. Please try again later.",
        ),
      });
    }
  }

  const dateOfBirth = watch("date_of_birth");
  const taxCode = watch("tax_code");

  useEffect(() => {
    if (dateOfBirth && dateOfBirth.length === 2) {
      setValue("date_of_birth", dateOfBirth + "/");
    }

    if (dateOfBirth && dateOfBirth.length === 5) {
      setValue("date_of_birth", dateOfBirth + "/");
    }

    if (dateOfBirth && dateOfBirth.length === 11) {
      setValue("date_of_birth", dateOfBirth.slice(0, 10));
    }
  }, [dateOfBirth, setValue]);

  useEffect(() => {
    if (taxCode) {
      setValue("tax_code", taxCode.toUpperCase());
    }
  }, [taxCode, setValue]);

  return (
    <SafeAreaView>
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <Topbar
          title={t("completeRegistration", "Complete registration")}
          goBackFn={() => {
            signOut();
            router.replace("/");
          }}
        />
        <Box flexDirection="column" gap="l" paddingHorizontal="m" marginTop="l">
          <Controller
            control={control}
            name="first_name"
            render={({ field: { onChange, value } }) => (
              <InputText
                label={t("firstName", "First name")}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.first_name && <Text variant="error">{errors.first_name.message}</Text>}

          <Box>
            <Controller
              control={control}
              name="last_name"
              render={({ field: { onChange, value } }) => (
                <InputText
                  label={t("lastName", "Last name")}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <Text variant="secondary" marginTop="s">
              <Trans i18nKey="registrationNameDescription">
                Enter your first and last name. Make sure your first and last name match the ones on
                your ID.
              </Trans>
            </Text>
            {errors.last_name && <Text variant="error">{errors.last_name.message}</Text>}
          </Box>

          <Box marginTop="s">
            <Controller
              control={control}
              name="date_of_birth"
              render={({ field: { onChange, value } }) => (
                <InputText
                  label={t("dateOfBirth", "Date of birth")}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  maxLength={10}
                  placeholder="GG/MM/AAAA"
                />
              )}
            />
            <Text variant="secondary" marginTop="s">
              {errors.date_of_birth && <Text variant="error">{errors.date_of_birth.message}</Text>}
              <Trans i18nKey="registrationAgeDescription">
                To register for FaXTe you must be at least 16 years old.
              </Trans>
            </Text>
          </Box>

          <Box marginVertical="s">
            <Controller
              control={control}
              name="tax_code"
              render={({ field: { onChange, value } }) => (
                <InputText label={t("taxCode", "Tax code")} value={value} onChangeText={onChange} />
              )}
            />
            {errors.tax_code && <Text variant="error">{errors.tax_code.message}</Text>}
            <Text variant="secondary" marginTop="s">
              <Trans i18nKey="registrationTaxCodeDescription">The tax code is required to...</Trans>
            </Text>
          </Box>

          <Controller
            control={control}
            name="accepted_tos"
            render={({ field: { onChange, value } }) => (
              <Checkbox value={value || false} onChange={onChange}>
                <Box flexDirection="row" gap="s" flexWrap="wrap">
                  <Text variant="body">Ho letto e accetto</Text>
                  <Text variant="link">i Termini di Servizio</Text>
                  <Text variant="body">e</Text>
                  <Text variant="link">l’Informativa sulla Privacy</Text>
                </Box>
              </Checkbox>
            )}
          />
          {errors.accepted_tos && <Text variant="error">{errors.accepted_tos.message}</Text>}
          <Controller
            control={control}
            name="accepted_newsletter"
            render={({ field: { onChange, value } }) => (
              <Checkbox value={value || false} onChange={onChange}>
                <Box flexDirection="row" gap="s" flexWrap="wrap">
                  <Text variant="body">
                    <Trans i18nKey="registrationNewsletterDescription">
                      I want to receive communications about FaXTe initiatives
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
            isLoading={isLoading}
            // isDisabled={!email || !email.includes("@")}
            variant="primary"
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
