import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { sendOtp as sendOtpRequest, verifyOtp as verifyOtpRequest } from "../api/auth";
import { clearAccessToken, setAccessToken } from "../api/client";
import type { AuthUser } from "../api/types";

const USER_STORAGE_KEY = "admin_panel_user";

interface StoredUser {
  id: number;
  name: string;
  email: string;
  role: AuthUser["role"];
}

interface AuthContextValue {
  user: StoredUser | null;
  isAuthenticated: boolean;
  sendOtp: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => loadStoredUser());

  const sendOtp = async (email: string, password: string) => {
    await sendOtpRequest(email, password);
  };

  const verifyOtp = async (email: string, otp: string) => {
    const authUser = await verifyOtpRequest(email, otp);
    setAccessToken(authUser.accessToken);

    const stored: StoredUser = {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(stored));
    setUser(stored);
  };

  const logout = () => {
    clearAccessToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, sendOtp, verifyOtp, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
