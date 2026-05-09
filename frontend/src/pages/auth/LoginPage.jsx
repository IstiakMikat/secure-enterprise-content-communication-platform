import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";

function LoginPage() {
  const navigate = useNavigate();
  const { setPendingAuth } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", otpChannel: "email" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const result = await authApi.login({
        ...form,
        email: form.email.trim(),
      });
      setPendingAuth({
        userId: result.userId,
        purpose: "LOGIN",
        otpDelivery: result.otpDelivery,
        otpMeta: result.otpMeta,
        email: form.email.trim(),
      });
      navigate("/verify-otp");
    } catch (submitError) {
      setError(submitError.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Authentication</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Login</h2>
      <div className="mt-8">
        <button
          className="button-secondary w-full mb-4"
          type="button"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-accent/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-accent">Or continue with email</span>
          </div>
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">Email Address</label>
          <input className="input" placeholder="e.g. rudmila.rudaba@gmail.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">Password</label>
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">OTP Delivery</label>
          <select className="input" value={form.otpChannel} onChange={(event) => setForm({ ...form, otpChannel: event.target.value })}>
            <option value="email">Send code to email</option>
            <option value="phone">Send code to phone</option>
          </select>
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button className="button-primary w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Authenticating..." : "Continue to OTP"}
        </button>
      </form>
      <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-4 text-xs text-slate-300">
        Demo seeded account after running the seed script: <span className="font-semibold text-white">admin@enterprise.local</span> / <span className="font-semibold text-white">Admin12345!</span>
      </div>
      <div className="mt-6 flex justify-between text-sm text-slate-400">
        <Link to="/forgot-password">Forgot password</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default LoginPage;
