import { AuthProvider } from "@refinedev/core"
import { getApiEndpoint } from "./config/network"

export const ACCESS_TOKEN_KEY = "auth-access-token"
export const REFRESH_TOKEN_KEY = "auth-refresh-token"

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const apiEndpoint = getApiEndpoint()
    const response = await fetch(`${apiEndpoint}/admin/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (data.access_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
      return { success: true }
    }

    return { success: false }
  },
  logout: async () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    return {
      success: true,
      redirectTo: "/login",
    }
  },
  check: async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)

    if (!token) {
      return {
        authenticated: false,
        redirectTo: "/login",
      }
    }

    const apiEndpoint = getApiEndpoint()
    const response = await fetch(`${apiEndpoint}/auth/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (data.id) {
      return {
        authenticated: true,
      }
    }

    const accessTokenResponse = await fetch(`${apiEndpoint}/auth/refresh`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        refresh_token: localStorage.getItem(REFRESH_TOKEN_KEY),
      }),
    })

    const accessTokenData = await accessTokenResponse.json()

    if (accessTokenData.access_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessTokenData.access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, accessTokenData.refresh_token)
      return {
        authenticated: true,
      }
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    }
  },
  updatePassword: async ({ password, confirmPassword }) => {
    // If the process is successful.
    return {
      success: true,
    }

    return {
      success: false,
      error: {
        name: "Login Error",
        message: "Invalid email or password",
      },
    }
  },
  forgotPassword: async ({ email }) => {
    // You can handle the reset password process according to your needs.

    console.log("Forgot password email: ", email)

    // If the process is successful.
    return {
      success: true,
    }
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    const apiEndpoint = getApiEndpoint()
    const response = await fetch(`${apiEndpoint}/auth/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (data.id) {
      return data
    }

    return null
  },
  onError: async (error) => {
    console.log(error)

    return {
      logout: false,
    }
  },
}
