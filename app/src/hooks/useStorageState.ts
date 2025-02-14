import { User } from "@/types/data";
import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { Platform } from "react-native";

type UseStateHook<T> = [T | null, (value: T | null) => void];

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface Session {
  user: User | null;
  token: Token | null;
}

function useAsyncState<T>(initialValue: T | null = null): UseStateHook<T> {
  return React.useReducer(
    (state: T | null, action: T | null = null): T | null => action,
    initialValue,
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<Session> {
  // Public
  const [session, setSession] = useAsyncState<Session>();

  // Get
  React.useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          const value = localStorage.getItem(key);
          setSession(value ? JSON.parse(value) : null);
        }
      } catch (e) {
        console.error("Local storage is unavailable:", e);
      }
    } else {
      SecureStore.getItemAsync(key).then((value) => {
        setSession(value ? JSON.parse(value) : null);
      });
    }
  }, [key, setSession]);

  // Set
  const setValue = React.useCallback(
    (value: Session | null) => {
      setSession(value);
      setStorageItemAsync(key, value ? JSON.stringify(value) : null);
    },
    [key, setSession],
  );

  return [session, setValue];
}
