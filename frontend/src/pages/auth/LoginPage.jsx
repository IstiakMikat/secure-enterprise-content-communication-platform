import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    login("demo-token", {
      id: "demo-user",
      fullName: "Amina Rahman",
      email: form.email || "admin@enterprise.local",
      role: "ADMIN",
      department: "IT Security",
    });
    navigate("/verify-otp");
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Authentication</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Login</h2>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <input className="input" placeholder="Employee email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <button className="button-primary w-full" type="submit">
          Continue to OTP
        </button>
      </form>
      <div className="mt-6 flex justify-between text-sm text-slate-400">
        <Link to="/forgot-password">Forgot password</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default LoginPage;

