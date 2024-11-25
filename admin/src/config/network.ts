import axios from "axios";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../authProvider";

export function getApiEndpoint() {
  if (process.env.NODE_ENV === "production") {
    return "https://attivati.volontariatotrentino.it/api";
  } else {
    return "http://localhost:3000/api";
  }
}

export function getAxiosInstance() {
  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if ((error.response.data?.detail as string)?.includes("23503")) {
        return Promise.reject(
          new Error(
            "Impossibile eliminare l'elemento. Esistono elementi collegati."
          )
        );
      }

      if (error.response.status === 401) {
        // try renew token
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          return Promise.reject(error);
        }

        const apiEndpoint = getApiEndpoint();
        return axios
          .post(`${apiEndpoint}/auth/refresh`, {
            refresh_token: refreshToken,
          })
          .then((response) => {
            if (response.data.access_token) {
              localStorage.setItem(
                ACCESS_TOKEN_KEY,
                response.data.access_token
              );
              localStorage.setItem(
                REFRESH_TOKEN_KEY,
                response.data.refresh_token
              );

              // try request again
              return axios.request(error.config);
            } else {
              localStorage.removeItem(ACCESS_TOKEN_KEY);
              localStorage.removeItem(REFRESH_TOKEN_KEY);
              return Promise.reject(new Error("Sessione scaduta, effettua nuovamente il login"));
            }
          })
          .catch(() => {
            return Promise.reject(error);
          });
      } else {
        return Promise.reject(error);
      }
    }
  );

  return axiosInstance;
}
