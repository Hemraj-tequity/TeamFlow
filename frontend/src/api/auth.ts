import { apiRequest, endpoints } from "./client";
import type { AuthUser } from "./types";

interface VerifyOtpResponse {
  success: true;
  message: string;
  user: AuthUser;
}

export const sendOtp = (email: string, password: string) =>
  apiRequest<{ success: true; message: string }>(endpoints.sendOtp, {
    method: "POST",
    body: { email, password },
  });

export const verifyOtp = (email: string, otp: string) =>
  apiRequest<VerifyOtpResponse>(endpoints.verifyOtp, {
    method: "POST",
    body: { email, otp },
  }).then((res) => res.user);
