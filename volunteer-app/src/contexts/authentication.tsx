import { Session, useStorageState } from "@/hooks/useStorageState";
import { RequestCodeData, VerifyCodeData } from "@/types/data";
import * as Device from "expo-device";
import { Middleware } from "openapi-fetch";
import React from "react";
import { useNetwork } from "./network";
import { useNotifications } from "./notifications";

const AuthContext = React.createContext<{
  requestAuthCode: (data: RequestCodeData) => Promise<boolean>;
  verifyAuthCode: (data: VerifyCodeData) => Promise<boolean>;
  fetchUser: () => Promise<void>;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
}>({
  requestAuthCode: () => Promise.resolve(false),
  verifyAuthCode: () => Promise.resolve(false),
  fetchUser: () => Promise.resolve(),
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const { client } = useNetwork();
  const { expoPushToken } = useNotifications();
  const [hasTriedRefresh, setHasTriedRefresh] = React.useState(false);

  const tokenMiddleware: Middleware = {
    async onRequest(req, options) {
      if (session?.token?.accessToken) {
        req.headers.set("Authorization", `Bearer ${session.token.accessToken}`);
      }
      return req;
    },
    async onResponse(res, options) {
      if (res.status === 401 && session?.token?.refreshToken && !hasTriedRefresh) {
        try {
          const refreshTokenResponse = await client.POST("/auth/refresh", {
            body: {
              refresh_token: session.token.refreshToken,
            },
          });

          if (refreshTokenResponse.error) {
            setSession(null);
            return res;
          }

          setSession({
            user: session.user,
            token: {
              accessToken: refreshTokenResponse.data.access_token,
              refreshToken: refreshTokenResponse.data.refresh_token,
            },
          });

          return res;
        } catch (error) {
          setSession(null);
          // Gestisci l'errore di refresh token
          console.error("Failed to refresh token", error);
        }
      } else if (res.status === 401 && hasTriedRefresh) {
        setSession(null);
        setHasTriedRefresh(false);
      }
      return res;
    },
  };

  client.use(tokenMiddleware);

  return (
    <AuthContext.Provider
      value={{
        fetchUser: async () => {
          if (session?.token?.accessToken) {
            const data = await client.GET("/auth/user", {
              headers: {
                Authorization: `Bearer ${session.token.accessToken}`,
              },
            });

            if (data?.data) {
              setSession({
                user: data.data,
                token: session.token,
              });
            }
          }
        },
        requestAuthCode: async (data) => {
          const response = await client.POST("/auth/request-code", {
            body: data,
          });

          if (response.error) {
            console.error("request code error:", response.error);
            return false;
          }

          return true;
        },
        verifyAuthCode: async (data) => {
          const response = await client.POST("/auth/verify-code", {
            body: data,
          });

          if (response.data?.access_token) {
            const headers = {
              Authorization: `Bearer ${response.data.access_token}`,
            };

            const data = await client.GET("/auth/user", { headers });

            if (data?.data) {
              setSession({
                user: data.data,
                token: {
                  accessToken: response.data.access_token,
                  refreshToken: response.data.refresh_token,
                },
              });

              await client.POST("/user-devices", {
                body: {
                  brand: Device.brand || "Unknown",
                  device_name: Device.deviceName || "Unknown",
                  model: Device.modelName || "Unknown",
                  device_type: Device.deviceType?.toString() || "Unknown",
                  os_name: Device.osName || "Unknown",
                  token: expoPushToken,
                },
                headers,
              });

              return true;
            }
          }

          return false;
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
