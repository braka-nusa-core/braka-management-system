"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiClient } from "@/lib/axios";
import {
  clearStoredAuthToken,
  getStoredAuthToken,
  setStoredAuthToken,
} from "@/lib/auth-storage";
import { getProfile, login as loginRequest } from "@/services/auth.service";
import type { AuthUser, LoginRequest } from "@/types/auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_PATH_PREFIXES = ["/progress"];
const AUTH_ONLY_PATHS = ["/login"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthOnlyPath(pathname: string) {
  return AUTH_ONLY_PATHS.some((path) => pathname === path);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasBootstrapped = useRef(false);

  const applyToken = (nextToken: string | null) => {
    setToken(nextToken);

    if (nextToken) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
      setStoredAuthToken(nextToken);
      return;
    }

    delete apiClient.defaults.headers.common.Authorization;
    clearStoredAuthToken();
  };

  const logout = () => {
    setUser(null);
    applyToken(null);
    router.replace("/login");
  };

  const refreshProfile = async () => {
    const nextUser = await getProfile();
    setUser(nextUser);
    return nextUser;
  };

  const login = async (payload: LoginRequest) => {
    const result = await loginRequest(payload);
    applyToken(result.token);

    if (result.user) {
      setUser(result.user);
    } else {
      await refreshProfile();
    }
  };

  useEffect(() => {
    if (hasBootstrapped.current) {
      return;
    }

    hasBootstrapped.current = true;

    const bootstrap = async () => {
      const storedToken = getStoredAuthToken();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        applyToken(storedToken);
        await refreshProfile();
      } catch {
        setUser(null);
        applyToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!token && !isPublicPath(pathname) && !isAuthOnlyPath(pathname)) {
      router.replace("/login");
      return;
    }

    if (token && isAuthOnlyPath(pathname)) {
      router.replace("/dashboard");
    }
  }, [isLoading, pathname, router, token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        isLoading,
        user,
        token,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
