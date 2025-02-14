import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import "react-native-reanimated";

import "react-native-gesture-handler";

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { Platform } from "react-native";
import { useNetwork } from "./network";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError("Permission not granted to get push token for push notification!");
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

interface NotificationContextType {
  expoPushToken: string;
  setExpoPushToken?: (token: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const { client } = useNetwork();

  console.log("Expo Push Token: ", expoPushToken);

  useEffect(() => {
    async function registerDevice() {
      try {
        const token = await registerForPushNotificationsAsync();
        setExpoPushToken(token ?? "");
        console.log("Registered for push notifications with token: ", token);
        if (token) {
          console.log("post");
          await client.POST("/user-devices", {
            body: {
              brand: Device.brand || "Unknown",
              device_name: Device.deviceName || "Unknown",
              model: Device.modelName || "Unknown",
              device_type: Device.deviceType?.toString() || "Unknown",
              os_name: Device.osName || "Unknown",
              token: token,
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    registerDevice();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      // TODO handle notification
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      // TODO handle response
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, setExpoPushToken }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
