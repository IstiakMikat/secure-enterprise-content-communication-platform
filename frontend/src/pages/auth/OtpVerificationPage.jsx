import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";

function OtpVerificationPage() {
  const navigate = useNavigate();
  const { pendingAuth, login, setPendingAuth } = useAuth();
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const otpMeta = pendingAuth?.otpMeta || {};
  const expiresAt = otpMeta.expiresAt ? new Date(otpMeta.expiresAt).getTime() : null;
  const resendAvailableAt = otpMeta.resendAvailableAt
    ? new Date(otpMeta.resendAvailableAt).getTime()
    : null;
  const maxAttempts = Number(otpMeta.maxAttempts || 5);

  const secondsToExpiry = useMemo(() => {
    if (!expiresAt) return null;
    return Math.max(0, Math.floor((expiresAt - now) / 1000));
  }, [expiresAt, now]);

  const secondsToResend = useMemo(() => {
    if (!resendAvailableAt) return 0;
    return Math.max(0, Math.floor((resendAvailableAt - now) / 1000));
  }, [resendAvailableAt, now]);

  const handleVerify = async () => {
    if (!pendingAuth?.userId) {
      setError("No pending authentication request found.");
      return;
    }

    const normalizedCode = otpCode.replace(/\D/g, "").slice(0, 6);
    if (!/^\d{6}$/.test(normalizedCode)) {
      setError("OTP must be a 6-digit numeric code.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setInfo("");
      const result = await authApi.verifyOtp({
        userId: pendingAuth.userId,
        otpCode: normalizedCode,
        purpose: pendingAuth.purpose,
      });
      login(result.token, result.user);
      setPendingAuth(null);
      navigate("/dashboard");
    } catch (verifyError) {
      setOtpAttempts((value) => value + 1);
      setError(verifyError.message || "OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async (otpChannel) => {
    if (!pendingAuth?.userId) {
      setError("No pending authentication request found.");
      return;
    }

    try {
      setIsResending(true);
      setError("");
      setInfo("");
      const result = await authApi.resendOtp({
        userId: pendingAuth.userId,
        purpose: pendingAuth.purpose,
        otpChannel,
      });
      setPendingAuth({
        ...pendingAuth,
        otpDelivery: result.otpDelivery,
        otpMeta: result.otpMeta,
      });
      setOtpCode("");
      setOtpAttempts(0);
      setInfo(`A new OTP has been issued to your ${result.otpDelivery?.channel || "selected channel"}.`);
    } catch (resendError) {
      setError(resendError.message || "Unable to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Two-Step Authentication</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Verify OTP</h2>
      <p className="mt-2 text-sm text-slate-400">
        Enter the one-time code sent to your {pendingAuth?.otpDelivery?.channel || "selected channel"}.
        {pendingAuth?.otpDelivery?.destination ? ` Destination: ${pendingAuth.otpDelivery.destination}` : ""}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        {secondsToExpiry !== null ? `Code expires in ${secondsToExpiry}s.` : "Use the latest 6-digit code sent to you."}
        {" "}
        Attempts: {otpAttempts}/{maxAttempts}
      </p>
      {pendingAuth?.otpDelivery?.providerStatus === "sent" ? (
        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          OTP dispatched successfully. Check your {pendingAuth.otpDelivery.channel}.
        </div>
      ) : null}
      {["demo_logged", "preview"].includes(pendingAuth?.otpDelivery?.providerStatus) ? (
        <div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm text-sky-100">
          Delivery is running in demo mode for local development. Check the backend terminal for the OTP code.
        </div>
      ) : null}
      {pendingAuth?.otpDelivery?.providerStatus === "failed" ? (
        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
          {pendingAuth.otpDelivery.errorMessage || "Delivery failed."} You can resend to email or switch to phone OTP below.
        </div>
      ) : null}
      <input
        className="input mt-8 text-center text-lg tracking-[0.5em]"
        maxLength={6}
        placeholder="000000"
        value={otpCode}
        onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
      />
      {info ? <p className="mt-3 text-sm text-emerald-300">{info}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      <button className="button-primary mt-6 w-full" onClick={handleVerify} disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify and Enter Workspace"}
      </button>
      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white">Need another delivery method?</p>
          <p className="mt-1 text-xs text-slate-400">
            If email does not arrive, switch to phone OTP. The backend will generate a fresh code and invalidate the previous one.
            {secondsToResend > 0 ? ` You can request again in ${secondsToResend}s.` : ""}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button className="button-secondary w-full" onClick={() => handleResend("email")} disabled={isResending || secondsToResend > 0}>
              {isResending ? "Processing..." : "Resend to Email"}
            </button>
            <button className="button-secondary w-full" onClick={() => handleResend("phone")} disabled={isResending || secondsToResend > 0}>
              {isResending ? "Processing..." : "Switch to Phone OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerificationPage;
