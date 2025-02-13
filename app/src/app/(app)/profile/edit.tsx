import CategoryPicker from "@/components/profile/CategoryPicker";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import InputText from "@/components/ui/InputText";
import InputTextDate from "@/components/ui/InputTextDate";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useSession } from "@/contexts/authentication";
import useProfile from "@/hooks/useProfile";
import { ProfileData } from "@/types/data";
import { convertToDDMMYYYY } from "@/utils/formatters";
import { validateCF } from "@/utils/validators";
import { router } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { When } from "react-if";
import { LayoutAnimation, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function ProfileEditScreen() {
  const { t } = useTranslation();
  const { session, fetchUser } = useSession();
  const { updateProfile } = useProfile();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues: {
      avatar: session?.user?.avatar,
      first_name: session?.user?.first_name,
      last_name: session?.user?.last_name,
      phone: session?.user?.phone,
      tax_code: session?.user?.tax_code,
      date_of_birth: session?.user?.date_of_birth,
      city: session?.user?.city,
      job: session?.user?.job,
      categories: session?.user?.categories?.map((category) => category.id) || [],
      // preferred_causes: session?.user?.preferred_causes,
      languages: session?.user?.languages,
      bio: session?.user?.bio,
    },
  });

  if (!session || !session.user) {
    router.push("/");
    return null;
  }
  const values = watch();

  async function handleAvatarChange(url: string) {
    if (!session?.user) {
      return;
    }

    setValue("avatar", url);

    handleSubmit(onSubmit)();
  }

  async function onSubmit(values: ProfileData) {
    if (!session?.user) {
      return;
    }

    if (values.tax_code && !validateCF(values.tax_code)) {
      setError("tax_code", {
        type: "manual",
        message: t("Invalid tax code"),
      });
      return;
    }

    values.notifications_activity_reminders = session?.user?.notifications_activity_reminders;
    values.notifications_followed_organizations =
      session?.user?.notifications_followed_organizations;
    values.notifications_nearby_activities = session?.user?.notifications_nearby_activities;

    updateProfile.mutate(values, {
      onSuccess: () => {
        fetchUser();
      },
    });
  }

  return (
    <ScrollView style={{ flex: 1 }} automaticallyAdjustKeyboardInsets={true}>
      <Topbar empty goBack title={t("editProfile", "Edit Profile")} />
      <Box px="m" mt="l">
        <Box alignItems="center" gap="l">
          <Controller
            control={control}
            name="avatar"
            render={({ field }) => (
              <ProfileAvatar
                url={field.value || undefined}
                editable
                onChange={handleAvatarChange}
              />
            )}
          />
        </Box>

        <Box borderTopColor="lightBorder" borderTopWidth={1} my="l">
          <ProfileDataForm
            label={t("name", "Name")}
            value={`${values.first_name} ${values.last_name}`}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => {
              setValue("first_name", session?.user?.first_name);
              setValue("last_name", session?.user?.last_name);
            }}
          >
            <Controller
              control={control}
              name="first_name"
              render={({ field }) => (
                <InputText
                  value={field.value}
                  onChangeText={field.onChange}
                  label={t("firstName", "First name")}
                />
              )}
            />
            <Controller
              control={control}
              name="last_name"
              render={({ field }) => (
                <InputText
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  label={t("lastName", "Last name")}
                />
              )}
            />
          </ProfileDataForm>
          <ProfileDataForm
            label={t("phone", "Phone")}
            value={values.phone || t("notSpecified", "Not specified")}
            error={errors.phone?.message}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => setValue("phone", session?.user?.phone)}
          >
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <InputText
                  value={field.value}
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                  onChangeText={field.onChange}
                  label={t("phone", "Phone")}
                />
              )}
            />
          </ProfileDataForm>
          <ProfileDataForm
            label={t("tax_code", "Tax Code")}
            value={values.tax_code || t("notSpecified", "Not specified")}
            error={errors.tax_code?.message}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => setValue("tax_code", session?.user?.tax_code)}
          >
            <Controller
              control={control}
              name="tax_code"
              render={({ field }) => (
                <InputText
                  value={field.value}
                  autoCapitalize={"characters"}
                  uppercase
                  error={errors.tax_code?.message}
                  onChangeText={field.onChange}
                  label={t("taxCode", "Tax code")}
                />
              )}
            />
          </ProfileDataForm>
          <ProfileDataForm
            label={t("dob", "Date of birth")}
            value={
              convertToDDMMYYYY(values.date_of_birth || "") || t("notSpecified", "Not specified")
            }
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => setValue("date_of_birth", session?.user?.date_of_birth)}
          >
            <Controller
              control={control}
              name="date_of_birth"
              render={({ field }) => (
                <InputTextDate
                  label={t("dateOfBirth", "Date of birth")}
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  maxLength={10}
                  placeholder="GG/MM/AAAA"
                />
              )}
            />
          </ProfileDataForm>
          <ProfileDataForm
            label={t("city", "City")}
            value={values.city || t("notSpecified", "Not specified")}
            onCancel={() => setValue("city", session?.user?.city)}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <InputText
                  value={field.value}
                  onChangeText={field.onChange}
                  label={t("city", "City")}
                />
              )}
            />
          </ProfileDataForm>
          <ProfileDataForm
            label={t("job", "Job")}
            value={values.job || t("notSpecified", "Not specified")}
            onCancel={() => setValue("job", session?.user?.job)}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="job"
              render={({ field }) => (
                <InputText
                  value={field.value}
                  onChangeText={field.onChange}
                  label={t("job", "Job")}
                />
              )}
            />
          </ProfileDataForm>
          <ProfileDataForm
            label={t("favoriteCategories", "Favorite categories")}
            value={
              session?.user?.categories?.length
                ? session?.user?.categories.map((c) => c.name).join(", ")
                : t("notSpecified", "Not specified")
            }
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() =>
              setValue(
                "categories",
                session?.user?.categories?.map((category) => category.id) || [],
              )
            }
          >
            <Controller
              control={control}
              name="categories"
              render={({ field }) => (
                <CategoryPicker
                  value={field.value || []}
                  onChange={field.onChange}
                  label={t("favoriteCategories", "Favorite categories")}
                />
              )}
            />
          </ProfileDataForm>
          {/* <ProfileDataForm
            label={t("preferredCauses", "Preferred causes")}
            value={values.preferred_causes}
          >
            <Controller
              control={control}
              name="preferred_causes"
              render={({ field }) => (
                <InputText
                  value={field.value}
                  onChangeText={field.onChange}
                  label={t("preferredCauses", "Preferred causes")}
                />
              )}
            />
          </ProfileDataForm> */}
          <ProfileDataForm
            label={t("languages", "Languages")}
            value={values.languages || t("notSpecified", "Not specified")}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => setValue("languages", session?.user?.languages)}
          >
            <Controller
              control={control}
              name="languages"
              render={({ field }) => (
                <InputText
                  value={field.value}
                  onChangeText={field.onChange}
                  label={t("languages", "Languages")}
                />
              )}
            />
          </ProfileDataForm>
          <ProfileDataForm
            label={t("aboutMe", "About me")}
            value={values.bio || t("notSpecified", "Not specified")}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => setValue("bio", session?.user?.bio)}
          >
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <InputText
                  value={field.value}
                  onChangeText={field.onChange}
                  label={t("aboutMe", "About me")}
                />
              )}
            />
          </ProfileDataForm>
        </Box>
      </Box>
    </ScrollView>
  );
}

interface ProfileDataFormProps {
  label: string;
  value: string;
  error?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode | React.ReactNode[];
}

const ProfileDataForm: FC<ProfileDataFormProps> = ({
  label,
  value,
  onSubmit,
  onCancel,
  error,
  children,
}) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);

  function handleToggle() {
    LayoutAnimation.easeInEaseOut();
    setShowForm(!showForm);
    onCancel && onCancel();
  }

  function handleSubmit() {
    setShowForm(false);
    onSubmit && onSubmit();
  }

  useEffect(() => {
    if (error) {
      setShowForm(true);
    }
  }, [error]);

  return (
    <Box
      borderBottomWidth={1}
      borderBottomColor="lightBorder"
      py="m"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <When condition={!showForm}>
        <Box flex={1} marginRight="s">
          <Text variant="body">{label}</Text>
          <Text variant="secondary">{value || t("notSet", "Not set")}</Text>
        </Box>
        <Pressable onPress={handleToggle}>
          <Text variant="link">{value ? t("Edit", "Edit") : t("add", "Add")}</Text>
        </Pressable>
      </When>
      <When condition={showForm}>
        <Box gap="m" width="100%">
          {children}
          <Button variant="primary" label={t("save", "Save")} onPress={handleSubmit} />

          <Box alignItems="center" py="m">
            <Pressable onPress={handleToggle}>
              <Text variant="link">{t("cancel", "Cancel")}</Text>
            </Pressable>
          </Box>
        </Box>
      </When>
    </Box>
  );
};
