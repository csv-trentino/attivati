export function getApiUrl(): string {
  let baseUrl = process.env.EXPO_PUBLIC_API_URL;

  if (__DEV__) {
    baseUrl = process.env.EXPO_PUBLIC_DEV_API_URL;
  }
  if (!baseUrl) {
    throw new Error("API_BASE_URL is not set");
  }

  return baseUrl;
}
