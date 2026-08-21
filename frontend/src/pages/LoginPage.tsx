import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiRequestError } from "../api/client";

function rateLimitMessage(err: ApiRequestError) {
  const details = err.errors as { retryAfterSeconds?: number } | undefined;
  const seconds = details?.retryAfterSeconds;
  return seconds ? `${err.message} Try again in ${seconds}s.` : err.message;
}

export function LoginPage() {
  const { isAuthenticated, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/organizations";
    return <Navigate to={redirectTo} replace />;
  }

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    try {
      await sendOtp(email, password);
      setNotice("An OTP has been sent to your email.");
      setOtp("");
      setStep("otp");
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.status === 429
            ? rateLimitMessage(err)
            : err.message
          : "Failed to send OTP. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await verifyOtp(email, otp);
      navigate("/organizations", { replace: true });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const backToCredentials = () => {
    setStep("credentials");
    setOtp("");
    setError(null);
    setNotice(null);
  };

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={step === "credentials" ? handleSendOtp : handleVerifyOtp}
      >
        <h1>Admin Panel</h1>
        <p className="auth-subtitle">
          {step === "credentials"
            ? "Sign in to manage organizations and projects"
            : `Enter the OTP sent to ${email}`}
        </p>

        {step === "credentials" ? (
          <>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                autoFocus
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
          </>
        ) : (
          <label className="field">
            <span>OTP Code</span>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoComplete="one-time-code"
              required
              autoFocus
            />
          </label>
        )}

        {notice && !error && <p className="muted">{notice}</p>}
        {error && <p className="field-error">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting
            ? step === "credentials"
              ? "Sending OTP..."
              : "Verifying..."
            : step === "credentials"
            ? "Send OTP"
            : "Verify & Sign in"}
        </button>

        {step === "otp" && (
          <button type="button" className="btn btn-ghost" onClick={backToCredentials} disabled={submitting}>
            Use a different email
          </button>
        )}
      </form>
    </div>
  );
}
