import { Session, useStorageState } from "@/hooks/useStorageState";
import { RequestCodeData, VerifyCodeData } from "@/types/data";
import { Middleware } from "openapi-fetch";
import React, { useCallback, useMemo } from "react";
import { useNetwork } from "./network";

const AuthContext = React.createContext<{
  requestAuthCode: (data: RequestCodeData) => Promise<boolean>;
  verifyAuthCode: (data: VerifyCodeData) => Promise<boolean>;
  deleteProfile: (otp: string) => Promise<boolean>;
  fetchUser: () => Promise<void>;
  signOut: () => void;
  session?: Session | null;
  getAccessToken: () => Promise<string | null>;
}>({
  requestAuthCode: () => Promise.resolve(false),
  verifyAuthCode: () => Promise.resolve(false),
  deleteProfile: () => Promise.resolve(false),
  fetchUser: () => Promise.resolve(),
  signOut: () => null,
  getAccessToken: () => Promise.resolve(null),
  session: null,
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
  const [session, setSession] = useStorageState("session");
  const { client } = useNetwork();

  const tokenMiddleware: Middleware = {
    async onRequest({ request, options }) {
      if (session?.token?.accessToken && request.url !== "/auth/verify-code") {
        request.headers.set("Authorization", `Bearer ${session.token.accessToken}`);
      }
      return request;
    },
    async onResponse({ request, response, options }) {
      if (
        response.status === 401 &&
        session?.token?.refreshToken &&
        !(request.url.includes("api/auth/") && request.method === "POST")
      ) {
        let newAccessToken;

        try {
          const refreshTokenResponse = await client.POST("/auth/refresh", {
            body: {
              refresh_token: session.token.refreshToken,
            },
          });

          if (refreshTokenResponse.error) {
            throw new Error(refreshTokenResponse.error.errors?.join(", "));
          }

          setSession({
            user: session.user,
            token: {
              accessToken: refreshTokenResponse.data.access_token,
              refreshToken: refreshTokenResponse.data.refresh_token,
            },
          });

          newAccessToken = refreshTokenResponse.data.access_token;
        } catch (error) {
          setSession(null);
          console.debug("Middleware: Failed to refresh token", error);
        }

        // Retry the original request with the new access token
        const newRes = await fetch(request.url, {
          method: request.method,
          headers: {
            ...Object.fromEntries(request.headers.entries()),
            authorization: `Bearer ${newAccessToken}`,
          },
          body: request.body,
        });

        return newRes;
      }

      return response;
    },
  };

  client.use(tokenMiddleware);

  const getAccessToken = useCallback(async () => {
    if (session?.token?.accessToken) {
      const res = await client.GET("/auth/user", {
        headers: {
          Authorization: `Bearer ${session.token.accessToken}`,
        },
      });

      if (res.error) {
        try {
          const refreshTokenResponse = await client.POST("/auth/refresh", {
            body: {
              refresh_token: session.token.refreshToken,
            },
          });

          if (refreshTokenResponse.error) {
            throw new Error(refreshTokenResponse.error.errors?.join(", "));
          }

          setSession({
            user: session.user,
            token: {
              accessToken: refreshTokenResponse.data.access_token,
              refreshToken: refreshTokenResponse.data.refresh_token,
            },
          });

          return refreshTokenResponse.data.access_token;
        } catch (error) {
          setSession(null);
          console.debug("GetAccessToken: Failed to refresh token", error);
        }
      }

      return session.token.accessToken;
    }

    return null;
  }, [session, client, setSession]);

  const fetchUser = useCallback(async () => {
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
  }, [session, client, setSession]);

  const initialState = useMemo(
    () => ({
      fetchUser,
      requestAuthCode: async (data: RequestCodeData) => {
        const response = await client.POST("/auth/request-code", {
          body: data,
        });

        if (response.error) {
          console.debug("request code error:", response.error);
          return false;
        }

        return true;
      },
      verifyAuthCode: async (data: VerifyCodeData) => {
        const response = await client.POST("/auth/verify-code", {
          body: data,
        });

        if (response.error) {
          console.debug("verify code error:", response.error);
          return false;
        }

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

            return true;
          }
        }

        return false;
      },
      deleteProfile: async (otp: string) => {
        const response = await client.DELETE("/auth/user", {
          body: {
            otp,
          },
        });

        if (response.error) {
          console.debug("delete profile error:", response.error);
          return false;
        }

        setSession(null);

        return true;
      },
      signOut: () => {
        setSession(null);
      },
      session,
      getAccessToken,
    }),
    [session, fetchUser, setSession, client, getAccessToken],
  );

  return <AuthContext.Provider value={initialState}>{props.children}</AuthContext.Provider>;
}
