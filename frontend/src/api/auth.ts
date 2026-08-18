import { apiRequest, endpoints } from "./client";
import type { AuthUser } from "./types";

interface LoginResponse {
  success: true;
  message: string;
  user: AuthUser;
}

export const login = (email: string, password: string) =>
  apiRequest<LoginResponse>(endpoints.login, {
    method: "POST",
    body: { email, password },
  }).then((res) => res.user);
