import { useSession } from "@/contexts/authentication";
import { NotificationProvider } from "@/contexts/notifications";
import { useTheme } from "@shopify/restyle";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const theme = useTheme();
  const { session } = useSession();

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session?.user) {
    return <Redirect href="/" />;
  }

  if (!session.user.accepted_tos) {
    return <Redirect href="/registration" />;
  }

  return (
    <NotificationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            flex: 1,
            backgroundColor: theme.colors.mainBackground,
          },
        }}
      />
    </NotificationProvider>
  );
}
