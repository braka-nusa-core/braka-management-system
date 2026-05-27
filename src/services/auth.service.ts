import { AxiosError } from "axios";
import { apiClient } from "@/lib/axios";
import type { AuthUser, LoginRequest, LoginResponse, MeResponse } from "@/types/auth";

function extractToken(payload: LoginResponse) {
  return (
    payload.data?.token ??
    payload.data?.accessToken ??
    payload.data?.access_token ??
    payload.token ??
    payload.accessToken ??
    payload.access_token ??
    null
  );
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const responseMessage =
      (error.response?.data as { message?: string } | undefined)?.message;

    return responseMessage ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function login(payload: LoginRequest) {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", payload);
    const token = extractToken(response.data);
    const user = response.data.data?.user ?? response.data.user ?? null;

    if (!token) {
      throw new Error("Login response does not include an auth token.");
    }

    return {
      token,
      user,
      message: response.data.message ?? "Login successful",
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Login failed"));
  }
}

export async function getProfile() {
  try {
    const response = await apiClient.get<MeResponse>("/auth/me");
    return response.data.data.user satisfies AuthUser;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch profile"));
  }
}
