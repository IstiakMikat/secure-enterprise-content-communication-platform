import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setPendingAuth } = useAuth();

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      setPendingAuth({
        userId,
        purpose: searchParams.get("purpose") || "GOOGLE_LOGIN",
        otpDelivery: {
          channel: searchParams.get("channel") || "email",
          destination: searchParams.get("destination") || "",
          providerStatus: searchParams.get("providerStatus") || "queued",
          previewCode: searchParams.get("previewCode") || "",
        },
        otpMeta: {
          expiresAt: searchParams.get("expiresAt") || "",
          resendAvailableAt: searchParams.get("resendAvailableAt") || "",
        },
      });
      navigate("/verify-otp");
    } else {
      navigate("/login");
    }
  }, [searchParams, setPendingAuth, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent mx-auto"></div>
        <p className="text-white">Completing authentication...</p>
      </div>
    </div>
  );
}

export default AuthCallbackPage;