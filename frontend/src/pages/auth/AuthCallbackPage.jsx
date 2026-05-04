import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // For Google auth, we just set the token and let the context bootstrap fetch the user
      login(token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [searchParams, login, navigate]);

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