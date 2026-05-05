import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { setPendingAuth } = useAuth();
  const [form, setForm] = useState({
    employeeId: "",
    username: "",
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    password: "",
    otpChannel: "email",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const departments = [
    { label: "Fraud Operations", value: "Fraud Operations" },
    { label: "Customer Service", value: "Customer Service" },
    { label: "Network Operations", value: "Network Operations" },
    { label: "Compliance", value: "Compliance" },
    { label: "HR", value: "HR" },
    { label: "IT Security", value: "IT Security" },
    { label: "Finance", value: "Finance" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.employeeId.trim() ||
      !form.username.trim() ||
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.designation.trim() ||
      !form.department ||
      !form.password
    ) {
      setError("Please complete all required registration fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const result = await authApi.register({
        ...form,
        employeeId: form.employeeId.trim(),
        username: form.username.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        designation: form.designation.trim(),
      });
      setPendingAuth({
        userId: result.userId,
        purpose: "REGISTRATION",
        otpDelivery: result.otpDelivery,
        email: form.email.trim(),
      });
      navigate("/verify-otp");
    } catch (submitError) {
      setError(submitError.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Employee Enrollment</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Register</h2>
      <form className="mt-8" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" placeholder="Employee ID" value={form.employeeId} onChange={(event) => setForm({ ...form, employeeId: event.target.value })} />
          <input className="input" placeholder="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          <input className="input" placeholder="Full Name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <input className="input" placeholder="Designation" value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value })} />
          <select className="input" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })}>
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.value} value={department.value}>
                {department.label}
              </option>
            ))}
          </select>
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <select className="input md:col-span-2" value={form.otpChannel} onChange={(event) => setForm({ ...form, otpChannel: event.target.value })}>
            <option value="email">Verify through email</option>
            <option value="phone">Verify through phone</option>
          </select>
        </div>
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        <button className="button-primary mt-6 w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Secure Account"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
